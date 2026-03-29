// src/app/api/webhook/route.ts
// Stripe 결제 웹훅 - 구독 상태 Firestore 동기화

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// Next.js body parsing 비활성화 (Stripe 서명 검증에 raw body 필요)
export const config = { api: { bodyParser: false } };

async function upsertUserPlan(uid: string, plan: string, customerId: string) {
  try {
    await adminDb.collection("users").doc(uid).set(
      { plan, stripeCustomerId: customerId, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (err) {
    console.error("Firestore plan update failed:", err);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.metadata?.uid;
        const plan = session.metadata?.plan;
        const customerId = session.customer as string;
        if (uid && plan && customerId) {
          // customer에 uid 메타데이터 저장
          await stripe.customers.update(customerId, { metadata: { uid } });
          await upsertUserPlan(uid, plan, customerId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.uid;
        const customerId = sub.customer as string;
        if (!uid) break;
        // 구독 상태에 따라 플랜 결정
        const plan = sub.status === "active" ? (sub.metadata?.plan ?? "free") : "free";
        await upsertUserPlan(uid, plan, customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.uid;
        const customerId = sub.customer as string;
        if (!uid) break;
        await upsertUserPlan(uid, "free", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        // 고객에서 uid 조회
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const uid = customer.metadata?.uid;
        if (uid) {
          await adminDb.collection("users").doc(uid).set(
            { paymentFailed: true, updatedAt: new Date().toISOString() },
            { merge: true }
          );
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // 500을 반환하면 Stripe가 재시도하므로 200 반환
  }

  return NextResponse.json({ received: true });
}
