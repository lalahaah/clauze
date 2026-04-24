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

    const baseUrl = process.env.DODO_PAYMENTS_RETURN_URL?.replace("/payment/success", "") ?? "https://clauze-ai.vercel.app";

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

    try {
      let checkoutUrl: string;

      // 고객 정보
      const customer = {
        email: userEmail || "",
        name: (userName || "고객") as string,
      };

      // Dodo Checkout Sessions API (단건/구독 통합)
      // 공식 문서: https://docs.dodopayments.com/developer-resources/integration-guide
      const sessionResponse = await dodoClient.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        customer,
        return_url: `${baseUrl}/payment/success?type=${planType}`,
      });

      checkoutUrl = sessionResponse.checkout_url ?? "";

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
