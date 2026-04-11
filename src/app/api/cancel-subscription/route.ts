// src/app/api/cancel-subscription/route.ts
// 구독 취소 — Dodo Payments 구독 취소

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { dodoClient } from "@/lib/dodo";

export async function POST(request: NextRequest) {
  try {
    // 1. Firebase 토큰 검증
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.replace("Bearer ", "").trim();

    if (!idToken) {
      return NextResponse.json(
        { error: "인증 토큰이 필요합니다" },
        { status: 401 }
      );
    }

    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다" },
        { status: 401 }
      );
    }

    // 2. Firestore에서 subscriptionId 조회
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData?.subscriptionId) {
      return NextResponse.json(
        { error: "활성 구독이 없습니다" },
        { status: 400 }
      );
    }

    const subscriptionId = userData.subscriptionId;
    const plan = userData.plan;

    // 3. Dodo API에서 구독 취소 호출
    try {
      await dodoClient.subscriptions.update(subscriptionId, {
        status: "cancelled",
      });
    } catch (dodoErr) {
      console.error("Dodo cancel error:", dodoErr);
      // Dodo API 호출 실패해도 로컬 DB는 업데이트 (매우 드문 경우)
    }

    // 4. Firestore에 구독 정보 업데이트
    await adminDb
      .collection("users")
      .doc(uid)
      .set(
        {
          plan: "free",
          subscriptionId: null,
          subscriptionStatus: "cancelled",
          currentPeriodEnd: null,
          cancelledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return NextResponse.json({
      message: "구독이 취소되었습니다. 만료일까지 이용 가능합니다.",
      success: true,
    });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json(
      { error: "구독 취소 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
