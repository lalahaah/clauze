// src/app/api/stripe/portal/route.ts
// Stripe Billing Portal (구독 관리/취소)

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

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

    // uid로 Stripe 고객 찾기
    const existing = await stripe.customers.search({
      query: `metadata["uid"]:"${uid}"`,
      limit: 1,
    });

    if (existing.data.length === 0) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: existing.data[0].id,
      return_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Portal session error:", err);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
