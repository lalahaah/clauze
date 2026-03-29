// src/lib/toss.ts
// 토스 페이먼츠 서버 유틸리티

export const PLANS = {
  pro: {
    name: "Pro",
    price: 19000,
    orderName: "Clauze Pro 구독",
  },
  business: {
    name: "Business",
    price: 79000,
    orderName: "Clauze Business 구독",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

function getAuthHeader() {
  const secret = process.env.TOSS_SECRET_KEY!;
  return "Basic " + Buffer.from(secret + ":").toString("base64");
}

// 빌링키 발급
export async function issueBillingKey(authKey: string, customerKey: string) {
  const res = await fetch(
    "https://api.tosspayments.com/v1/billing/authorizations/issue",
    {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authKey, customerKey }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "빌링키 발급 실패");
  }
  return res.json();
}

// 자동결제 실행
export async function chargeBilling({
  billingKey,
  customerKey,
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
}: {
  billingKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const res = await fetch(
    `https://api.tosspayments.com/v1/billing/${encodeURIComponent(billingKey)}`,
    {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
        customerEmail,
        customerName,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "결제 실패");
  }
  return res.json();
}
