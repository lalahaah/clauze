// src/app/api/dodo/payment/request/route.ts
// 도도 페이먼츠 결제 요청 — 호스팅된 결제 페이지 URL 반환

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { PLANS, type PlanKey } from "@/lib/payment";
import { randomUUID } from "crypto";

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

    const body = await request.json();
    const { plan, email, name } = body as {
      plan: PlanKey;
      email?: string;
      name?: string;
    };

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const planInfo = PLANS[plan];
    const orderId = `clauze_${randomUUID().replace(/-/g, "")}`;

    // 도도 결제 요청
    // NOTE: 도도 페이먼츠 API 문서에 따라 실제 구현 필요
    // 아래는 예시 구조 — 실제 도도 API와 맞춰서 수정
    const dodoRequestBody = {
      merchantId: process.env.DODO_MERCHANT_ID,
      orderId,
      orderName: planInfo.orderName,
      amount: planInfo.price,
      currency: "KRW",
      customerEmail: email,
      customerName: name,
      returnUrl: `${baseUrl}/api/dodo/payment/callback`,
      failUrl: `${baseUrl}/pricing?checkout=cancelled`,
      metadata: {
        plan,
        userId: uid,
        isSubscription: plan !== "single",
      },
    };

    const dodoRes = await fetch(
      "https://api.dodo.dev/v1/payment/hosted/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DODO_API_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dodoRequestBody),
      }
    );

    if (!dodoRes.ok) {
      const err = await dodoRes.json();
      console.error("Dodo payment request error:", err);
      return NextResponse.json(
        { error: err.message ?? "도도 결제 요청 실패" },
        { status: 500 }
      );
    }

    const data = (await dodoRes.json()) as { paymentUrl: string };

    return NextResponse.json({
      paymentUrl: data.paymentUrl,
      orderId,
    });
  } catch (err) {
    console.error("Payment request error:", err);
    return NextResponse.json(
      { error: "Failed to request payment" },
      { status: 500 }
    );
  }
}
