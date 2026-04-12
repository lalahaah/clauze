// src/app/api/review/route.ts
// 핵심 AI 검토 엔진 - PDF 수신 → Claude 호출 → Firestore 저장

import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { reviewContract } from "@/lib/claude";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { findPastReviews, detectRepeatedClauses } from "@/lib/pattern-analyzer";
import { RepeatPattern } from "@/lib/types";
import { INDUSTRY_PROFILES, IndustryKey } from "@/lib/industry-profiles";
import { checkReviewPermission, consumeCredit, incrementFreePlanReviewCount } from "@/lib/plan-guard";

export const runtime = "nodejs";
export const maxDuration = 60; // 60초 타임아웃 (PDF 분석 여유 확보)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    // 업종 파라미터 — 없으면 general 기본값
    const industryRaw = formData.get("industry") as string | null;
    const industry: IndustryKey =
      industryRaw && industryRaw in INDUSTRY_PROFILES
        ? (industryRaw as IndustryKey)
        : "general";

    // 파일 유효성 검사
    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "PDF 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 10MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // 플랜 제한 확인 (userId가 있을 경우)
    if (userId) {
      try {
        const permission = await checkReviewPermission(userId);
        if (!permission.allowed) {
          // 에러 메시지 정의
          let errorMsg = "검토 한도를 초과했습니다.";
          if (permission.reason === "free_limit") {
            errorMsg = "무료 플랜은 월 1건만 검토 가능합니다. Pro 플랜을 업그레이드해주세요.";
          } else if (permission.reason === "no_credits") {
            errorMsg = "검토 크레딧이 부족합니다. Single Review를 구매하거나 Pro 플랜을 업그레이드해주세요.";
          } else if (permission.reason === "subscription_cancelled") {
            errorMsg = "구독이 취소된 상태입니다. 다시 구독해주세요.";
          }

          return NextResponse.json(
            {
              error: errorMsg,
              code: "PLAN_LIMIT_EXCEEDED",
              reason: permission.reason,
            },
            { status: 429 }
          );
        }
      } catch (err) {
        // 플랜 확인 실패는 검토를 막지 않음 (신규 유저 보호)
        console.error("Plan permission check error (허용으로 계속):", err);
      }
    }

    // PDF를 base64로 변환
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const startTime = Date.now();

    // 업종별 추가 프롬프트 추출
    const industryAddition = INDUSTRY_PROFILES[industry].systemPromptAddition || undefined;

    // Claude API 호출하여 계약서 검토 (업종 프롬프트 포함)
    const result = await reviewContract(base64, industryAddition);

    const processingTime = Date.now() - startTime;

    // 리뷰 ID 생성
    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Firestore에 검토 결과 저장 (userId가 있을 경우만)
    let repeatedPatterns: RepeatPattern[] = [];

    if (userId) {
      try {
        const createdAt = new Date().toISOString();

        await adminDb.collection("reviews").doc(reviewId).set({
          id: reviewId,
          uid: userId,
          fileName: file.name,
          storageUrl: "", // Cloud Storage에 저장되지 않은 경우
          result,
          riskLevel: result.overallRisk,
          processingTime,
          createdAt,
          industry, // 업종 태그
          repeatedPatterns: [], // 패턴 분석 후 업데이트
        });

        // 사용자의 reviewCount 증가
        await adminDb.collection("users").doc(userId).update({
          reviewCount: admin.firestore.FieldValue.increment(1),
        });

        // 플랜에 따른 크레딧 처리
        try {
          const userDoc = await adminDb.collection("users").doc(userId).get();
          const userData = userDoc.data();
          const plan = userData?.plan ?? "free";

          if (plan === "single") {
            // Single Review: 크레딧 차감
            const consumed = await consumeCredit(userId);
            if (!consumed) {
              console.warn(`Failed to consume credit for user ${userId}`);
            }
          } else if (plan === "free") {
            // Free: 월간 검토 수 증가 (선택적 추적)
            await incrementFreePlanReviewCount(userId);
          }
          // Pro/Business: 별도 처리 불필요 (무제한)
        } catch (creditErr) {
          console.error("Credit management error (비치명적):", creditErr);
          // 크레딧 관리 실패는 무시 (검토 결과는 저장됨)
        }

        // 패턴 분석 - 실패해도 메인 검토 결과에는 영향 없음
        try {
          const pastReviews = await findPastReviews(userId, reviewId);
          repeatedPatterns = detectRepeatedClauses(result.clauses, pastReviews);

          // 패턴이 있을 때만 업데이트 (불필요한 쓰기 절약)
          if (repeatedPatterns.length > 0) {
            await adminDb.collection("reviews").doc(reviewId).update({
              repeatedPatterns,
            });
          }
        } catch (patternErr) {
          console.error("패턴 분석 실패 (비치명적):", patternErr);
          // 패턴 분석 실패는 무시
        }
      } catch (firebaseErr) {
        console.error("Firestore save error (비치명적):", firebaseErr);
        // Firestore 저장 실패는 무시하고 결과는 반환 (클라이언트는 검토 완료)
      }
    }

    return NextResponse.json({
      reviewId,
      result,
      processingTime,
      fileName: file.name,
      repeatedPatterns,
      industry,
    });
  } catch (error) {
    console.error("=== REVIEW API ERROR ===");
    console.error("Type:", typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    console.error("Stack:", error instanceof Error ? error.stack : "");

    let errorMsg = "계약서 검토 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    if (error instanceof Error) {
      // 구체적인 오류 메시지 전파
      if (error.message.includes("API 키") || error.message.includes("인증")) {
        errorMsg = "서버 설정 오류. 관리자에게 문의해주세요.";
      } else if (error.message.includes("형식") || error.message.includes("파싱")) {
        errorMsg = error.message;
      } else if (error.message.includes("시간 초과")) {
        errorMsg = "처리 시간이 너무 오래 걸렸습니다. 파일 크기를 줄여주세요.";
      } else if (error.message.includes("요청") || error.message.includes("429")) {
        errorMsg = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message.includes("PDF")) {
        errorMsg = error.message;
      } else if (error.message && error.message.length < 100) {
        errorMsg = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
