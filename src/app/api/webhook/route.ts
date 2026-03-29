// src/app/api/webhook/route.ts
// 토스 페이먼츠 웹훅 — 결제 상태 변화를 Firestore에 동기화

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const { eventType, data } = body as {
      eventType: string;
      data: Record<string, string>;
    };

    if (eventType === "PAYMENT_STATUS_CHANGED") {
      const { status, orderId } = data;

      if (status === "CANCELED" || status === "ABORTED") {
        // orderId로 사용자 찾아 플랜 free로 변경
        const snap = await adminDb
          .collection("users")
          .where("lastOrderId", "==", orderId)
          .limit(1)
          .get();

        if (!snap.empty) {
          const uid = snap.docs[0].id;
          await adminDb
            .collection("users")
            .doc(uid)
            .set(
              {
                plan: "free",
                paymentFailed: true,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
        }
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // 500을 반환하면 토스가 재시도하므로 200 반환
  }

  return NextResponse.json({ received: true });
}
