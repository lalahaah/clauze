// src/app/api/checkout/route.ts
// 결제 요청 처리 — Dodo Payments 결제/구독 생성

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { dodoClient, DODO_PRODUCTS, PLAN_INFO, type PlanType } from "@/lib/dodo";

export async function POST(request: NextRequest) {
  try {
    // 1. Firebase 토큰 검증
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.replace("Bearer ", "").trim();

    if (!idToken) {
      return NextResponse.json(
        { error: "인증 토큰이 필요합니다" },
        { status: 401 }
      );
    }

    let uid: string;
    let userEmail: string;

    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
      userEmail = decoded.email ?? "";
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다" },
        { status: 401 }
      );
    }

    // 2. 요청 본문 파싱
    const body = await request.json();
    const { planType, userName } = body as {
      planType: PlanType;
      userName?: string;
    };

    if (!planType || !["single", "pro", "business"].includes(planType)) {
      return NextResponse.json(
        { error: "유효한 플랜 타입이 아닙니다" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // 3. 이미 같은 플랜의 구독을 가진 경우 확인 (pro/business)
    if (planType !== "single") {
      const userDoc = await adminDb.collection("users").doc(uid).get();
      const userData = userDoc.data();
      if (userData?.plan === planType && userData?.subscriptionId) {
        return NextResponse.json(
          {
            error: `이미 ${PLAN_INFO[planType].name} 플랜을 구독 중입니다`,
            code: "ALREADY_SUBSCRIBED",
          },
          { status: 400 }
        );
      }
    }

    // 4. Dodo Payments 결제 생성
    const productId = DODO_PRODUCTS[planType];
    const planInfo = PLAN_INFO[planType];

    try {
      let checkoutUrl: string;

      // 공통 배송지 정보 (선택적)
      const billing = {
        city: "Seoul",
        country: "KR" as any,
        state: "Seoul",
        street: "N/A",
        zipcode: "00000",
      };

      // 공통 고객 정보
      const customer = {
        email: userEmail || "",
        name: (userName || "고객") as string,
      };

      if (planType === "single") {
        // 단건 결제 — Payments API 사용
        const paymentResponse = await dodoClient.payments.create({
          payment_link: true,
          billing,
          customer,
          product_cart: [
            {
              product_id: productId,
              quantity: 1,
            },
          ],
          return_url: `${baseUrl}/payment/success?type=single`,
        });

        checkoutUrl = paymentResponse.payment_link ?? "";
      } else {
        // 구독 결제 — Subscriptions API 사용
        const subscriptionResponse = await dodoClient.subscriptions.create({
          payment_link: true,
          billing,
          customer,
          product_id: productId,
          quantity: 1,
          return_url: `${baseUrl}/payment/success?type=${planType}`,
        });

        checkoutUrl = subscriptionResponse.payment_link ?? "";
      }

      if (!checkoutUrl) {
        throw new Error("결제 링크를 생성할 수 없습니다");
      }

      // 5. 결제 시작 로그 (선택적 — 추적용)
      await adminDb
        .collection("users")
        .doc(uid)
        .collection("checkoutLogs")
        .add({
          planType,
          status: "pending",
          createdAt: new Date().toISOString(),
        });

      return NextResponse.json({ checkoutUrl });
    } catch (dodoErr) {
      console.error("Dodo payment creation error:", dodoErr);

      // Dodo API 에러 처리
      const errorMessage =
        dodoErr instanceof Error ? dodoErr.message : "결제 생성 실패";

      return NextResponse.json(
        { error: `결제 처리 중 오류: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "결제 요청 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
