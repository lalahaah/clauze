// src/app/api/dodo/cancel/route.ts
// 도도 페이먼츠 구독 취소

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.replace("Bearer ", "").trim();
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData?.billingKey) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 404 }
      );
    }

    // 도도 API에서 구독 취소 (구독 플랜인 경우)
    if (userData.billingKey?.startsWith("dodo_")) {
      const paymentKey = userData.billingKey.replace("dodo_", "");
      try {
        const cancelRes = await fetch(
          `https://api.dodo.dev/v1/billing/${encodeURIComponent(paymentKey)}/cancel`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.DODO_API_KEY!}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!cancelRes.ok) {
          console.error("Dodo cancel error:", await cancelRes.json());
          // Dodo API 호출 실패해도 로컬 DB는 업데이트
        }
      } catch (err) {
        console.error("Dodo cancel request failed:", err);
        // 계속 진행
      }
    }

    // Firestore에서 구독 정보 제거
    await adminDb
      .collection("users")
      .doc(uid)
      .set(
        {
          plan: "free",
          billingKey: null,
          cancelledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
