// src/app/api/stripe/checkout/route.ts
// Stripe Checkout Session 생성 (Pro / Business 구독)

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  business: process.env.STRIPE_BUSINESS_PRICE_ID!,
};

export async function POST(request: NextRequest) {
  try {
    // Firebase ID 토큰으로 사용자 인증
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.replace("Bearer ", "").trim();
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let uid: string;
    let email: string;
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
      email = decoded.email ?? "";
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { plan } = await request.json();
    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // 기존 Stripe 고객 검색 또는 신규 생성
    let customerId: string | undefined;
    const existing = await stripe.customers.search({
      query: `metadata["uid"]:"${uid}"`,
      limit: 1,
    });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(customerId ? { customer: customerId } : { customer_email: email }),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { uid, plan },
      },
      metadata: { uid, plan },
      success_url: `${baseUrl}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "ko",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
