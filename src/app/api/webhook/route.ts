// src/app/api/webhook/route.ts
// Stripe 결제 웹훅 - 구독 상태 Firestore 동기화

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 구독 이벤트 처리 (Firestore 연동 시 활성화)
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      // const subscription = event.data.object as Stripe.Subscription;
      // Firestore에 구독 상태 업데이트
      break;

    case "customer.subscription.deleted":
      // 구독 취소 처리 - plan을 'free'로 변경
      break;

    case "invoice.payment_failed":
      // 결제 실패 처리
      break;
  }

  return NextResponse.json({ received: true });
}
