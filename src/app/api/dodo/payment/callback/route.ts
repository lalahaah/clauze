// src/app/api/dodo/payment/callback/route.ts
// 도도 페이먼츠 결제 완료 콜백 — 결제 결과 저장 및 구독 처리

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { PLANS, type PlanKey } from "@/lib/payment";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");
  const paymentKey = searchParams.get("paymentKey");
  const plan = searchParams.get("plan") as PlanKey | null;
  const userId = searchParams.get("userId");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!orderId || !status || !plan || !PLANS[plan] || !userId || !paymentKey) {
    return NextResponse.redirect(`${baseUrl}/pricing?checkout=cancelled`);
  }

  if (status !== "success") {
    return NextResponse.redirect(
      `${baseUrl}/pricing?checkout=cancelled&reason=payment_failed`
    );
  }

  try {
    // 도도 결제 검증 (서버에서 결제 상태 확인)
    const verifyRes = await fetch(
      `https://api.dodo.dev/v1/payment/${encodeURIComponent(paymentKey)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DODO_API_KEY!}`,
        },
      }
    );

    if (!verifyRes.ok) {
      console.error("Payment verification failed");
      return NextResponse.redirect(
        `${baseUrl}/pricing?checkout=cancelled&reason=verification_failed`
      );
    }

    const payment = (await verifyRes.json()) as {
      status: string;
      amount: number;
    };

    if (payment.status !== "completed") {
      return NextResponse.redirect(
        `${baseUrl}/pricing?checkout=cancelled&reason=payment_not_completed`
      );
    }

    const planInfo = PLANS[plan];

    // Firestore에 결제 정보 및 구독 정보 저장
    const userDocData: Record<string, unknown> = {
      plan,
      lastPaymentKey: paymentKey,
      lastOrderId: orderId,
      paymentAmount: payment.amount,
      paymentProvider: "dodo",
      paymentFailed: false,
      updatedAt: new Date().toISOString(),
    };

    // 구독 플랜인 경우 추가 정보 저장
    if (plan !== "single") {
      userDocData.billingKey = `dodo_${paymentKey}`;
      userDocData.subscriptionStartedAt = new Date().toISOString();
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .set(userDocData, { merge: true });

    return NextResponse.redirect(
      `${baseUrl}/dashboard?checkout=success&plan=${plan}`
    );
  } catch (err) {
    console.error("Dodo payment callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/pricing?checkout=cancelled&reason=server_error`
    );
  }
}

// Webhook 처리 (도도에서 결제 결과를 POST로 전송하는 경우)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, paymentKey, userId, plan } = body;

    if (!orderId || !status || !paymentKey || !userId || !plan) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (status !== "completed") {
      await adminDb
        .collection("users")
        .doc(userId)
        .set(
          {
            paymentFailed: true,
            lastFailedReason: status,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      return NextResponse.json({ success: false });
    }

    const planInfo = PLANS[plan as PlanKey];
    if (!planInfo) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const userDocData: Record<string, unknown> = {
      plan,
      lastPaymentKey: paymentKey,
      lastOrderId: orderId,
      paymentProvider: "dodo",
      paymentFailed: false,
      updatedAt: new Date().toISOString(),
    };

    if (plan !== "single") {
      userDocData.billingKey = `dodo_${paymentKey}`;
      userDocData.subscriptionStartedAt = new Date().toISOString();
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .set(userDocData, { merge: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
