// src/app/api/review/route.ts
// 핵심 AI 검토 엔진 - PDF 수신 → Claude 호출 → JSON 반환

import { NextRequest, NextResponse } from "next/server";
import { reviewContract } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60; // 60초 타임아웃 (PDF 분석 여유 확보)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

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

    // userId received but Firestore integration pending
    void userId;

    // PDF를 base64로 변환
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const startTime = Date.now();

    // Claude API 호출하여 계약서 검토
    const result = await reviewContract(base64);

    const processingTime = Date.now() - startTime;

    // 리뷰 ID 생성 (실제 구현 시 Firestore에 저장)
    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      reviewId,
      result,
      processingTime,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Review API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AI 응답 파싱 중 오류가 발생했습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "계약서 검토 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
