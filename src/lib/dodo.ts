// src/lib/dodo.ts
// Dodo Payments 클라이언트 초기화 및 상수

import DodoPayments from "dodopayments";

// Plan 타입
export type PlanType = "single" | "pro" | "business";
export type PlanKey = "free" | "single" | "pro" | "business";

// Dodo Products (환경변수에서 가져옴)
export const DODO_PRODUCTS = {
  single: process.env.DODO_PRODUCT_SINGLE!,
  pro: process.env.DODO_PRODUCT_PRO!,
  business: process.env.DODO_PRODUCT_BUSINESS!,
} as const;

// Plan 정보
export const PLAN_INFO = {
  single: {
    name: "Single Review",
    price: 9900,
    credits: 1,
    description: "필요할 때 한 건씩. 구독 없이.",
  },
  pro: {
    name: "Pro",
    price: 17000,
    description: "반복 계약이 많은 프리랜서 · 1인 사업자",
  },
  business: {
    name: "Business",
    price: 79000,
    description: "법무팀 없는 중소기업",
  },
} as const;

// Dodo Payments 클라이언트 초기화
export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment:
    (process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode") ||
    "test_mode",
});

// Webhook 서명 검증용 Secret Key
export const DODO_WEBHOOK_KEY = process.env.DODO_PAYMENTS_WEBHOOK_KEY!;
