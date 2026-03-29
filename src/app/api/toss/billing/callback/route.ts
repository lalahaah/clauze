// src/app/api/toss/billing/callback/route.ts
// 토스 빌링 인증 성공 콜백 — 빌링키 발급 + 첫 결제 + Firestore 저장

import { NextRequest, NextResponse } from "next/server";
import { issueBillingKey, chargeBilling, PLANS, type PlanKey } from "@/lib/toss";
import { adminDb } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get("authKey");
  const customerKey = searchParams.get("customerKey"); // Firebase UID
  const plan = searchParams.get("plan") as PlanKey | null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!authKey || !customerKey || !plan || !PLANS[plan]) {
    return NextResponse.redirect(`${baseUrl}/pricing?checkout=cancelled`);
  }

  try {
    // 1. 빌링키 발급
    const billingData = await issueBillingKey(authKey, customerKey);
    const { billingKey, card, customerEmail, customerName } = billingData;

    // 2. 첫 결제 실행
    const planInfo = PLANS[plan];
    const orderId = `clauze_${randomUUID().replace(/-/g, "")}`;

    const payment = await chargeBilling({
      billingKey,
      customerKey,
      amount: planInfo.price,
      orderId,
      orderName: planInfo.orderName,
      customerEmail: customerEmail ?? undefined,
      customerName: customerName ?? undefined,
    });

    // 3. Firestore에 구독 정보 저장
    await adminDb
      .collection("users")
      .doc(customerKey)
      .set(
        {
          plan,
          billingKey,
          tossCustomerKey: customerKey,
          lastPaymentKey: payment.paymentKey,
          lastOrderId: orderId,
          cardInfo: card
            ? { brand: card.company ?? null, last4: card.number?.slice(-4) ?? null }
            : null,
          paymentFailed: false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return NextResponse.redirect(
      `${baseUrl}/dashboard?checkout=success&plan=${plan}`
    );
  } catch (err) {
    console.error("Toss billing callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/pricing?checkout=cancelled&reason=payment_failed`
    );
  }
}
