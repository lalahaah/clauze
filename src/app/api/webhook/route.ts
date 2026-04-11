// src/app/api/webhook/route.ts
// Dodo Payments 웹훅 처리 — 결제/구독 이벤트 처리

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { DODO_WEBHOOK_KEY, type PlanType } from "@/lib/dodo";
import { Webhook } from "standardwebhooks";

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 읽기
    const body = await request.text();

    // 2. Webhook 서명 검증 (standardwebhooks)
    const signature = request.headers.get("webhook-signature") ?? "";
    const timestamp = request.headers.get("webhook-timestamp") ?? "";

    if (!signature || !timestamp) {
      console.warn("Missing webhook headers");
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    try {
      const wh = new Webhook(DODO_WEBHOOK_KEY);
      wh.verify(body, {
        "webhook-signature": signature,
        "webhook-timestamp": timestamp,
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    // 3. 웹훅 이벤트 파싱
    const event = JSON.parse(body) as {
      type: string;
      data: Record<string, any>;
    };

    const eventType = event.type;
    const eventData = event.data;

    console.log(`Webhook received: ${eventType}`, eventData);

    // 4. 이벤트 타입별 처리
    switch (eventType) {
      // 단건 결제 완료
      case "payment.succeeded": {
        const paymentId = eventData.id;
        const customerId = eventData.customerId;
        const metadata = eventData.metadata ?? {};

        if (!customerId) {
          console.warn("payment.succeeded: missing customerId");
          break;
        }

        // 단건 결제 크레딧 +1
        const userDoc = await adminDb
          .collection("users")
          .doc(customerId)
          .get();
        const currentCredits = userDoc.data()?.singleReviewCredits ?? 0;

        await adminDb
          .collection("users")
          .doc(customerId)
          .set(
            {
              singleReviewCredits: currentCredits + 1,
              lastPaymentId: paymentId,
              lastPaymentAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

        console.log(`Payment succeeded for user ${customerId}`);
        break;
      }

      // 구독 활성화 (처음 결제 성공)
      case "subscription.active": {
        const subscriptionId = eventData.id;
        const customerId = eventData.customerId;
        const metadata = eventData.metadata ?? {};
        const planType = metadata.planType as PlanType;
        const currentPeriodEnd = eventData.currentPeriodEnd;

        if (!customerId || !planType) {
          console.warn("subscription.active: missing customerId or planType");
          break;
        }

        await adminDb
          .collection("users")
          .doc(customerId)
          .set(
            {
              plan: planType,
              subscriptionId,
              subscriptionStatus: "active",
              currentPeriodEnd: currentPeriodEnd
                ? new Date(currentPeriodEnd).toISOString()
                : null,
              subscriptionStartedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

        console.log(`Subscription ${subscriptionId} activated for user ${customerId}`);
        break;
      }

      // 구독 갱신 (정기적인 결제)
      case "subscription.renewed": {
        const subscriptionId = eventData.id;
        const customerId = eventData.customerId;
        const currentPeriodEnd = eventData.currentPeriodEnd;

        if (!customerId) {
          console.warn("subscription.renewed: missing customerId");
          break;
        }

        await adminDb
          .collection("users")
          .doc(customerId)
          .set(
            {
              currentPeriodEnd: currentPeriodEnd
                ? new Date(currentPeriodEnd).toISOString()
                : null,
              subscriptionStatus: "active",
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

        console.log(`Subscription ${subscriptionId} renewed for user ${customerId}`);
        break;
      }

      // 구독 취소
      case "subscription.cancelled": {
        const subscriptionId = eventData.id;
        const customerId = eventData.customerId;

        if (!customerId) {
          console.warn("subscription.cancelled: missing customerId");
          break;
        }

        await adminDb
          .collection("users")
          .doc(customerId)
          .set(
            {
              plan: "free",
              subscriptionId: null,
              subscriptionStatus: null,
              currentPeriodEnd: null,
              cancelledAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

        console.log(`Subscription ${subscriptionId} cancelled for user ${customerId}`);
        break;
      }

      // 구독 결제 실패
      case "subscription.failed": {
        const subscriptionId = eventData.id;
        const customerId = eventData.customerId;

        if (!customerId) {
          console.warn("subscription.failed: missing customerId");
          break;
        }

        // 구독 실패 시 free로 롤백 (결제 실패 시 서비스 중단)
        await adminDb
          .collection("users")
          .doc(customerId)
          .set(
            {
              plan: "free",
              subscriptionStatus: "failed",
              failedPaymentAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

        console.log(`Subscription ${subscriptionId} failed for user ${customerId}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    // 5. 모든 이벤트에 대해 200 OK 반환 (처리 여부와 관계없이)
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    // 웹훅 처리 실패해도 200 반환 (Dodo가 재시도하도록)
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
