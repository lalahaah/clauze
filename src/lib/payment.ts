// src/lib/payment.ts
// 다중 결제 수단 지원 (Toss Payments + Dodo Payments)

export const PAYMENT_PROVIDERS = {
  toss: "toss",
  dodo: "dodo",
} as const;

export type PaymentProvider = typeof PAYMENT_PROVIDERS[keyof typeof PAYMENT_PROVIDERS];

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    orderName: "Clauze Free",
    reviewsPerMonth: 1,
    features: {
      reviews: 1,
      summary: true,
      translation: false,
      history: false,
      pattern: false,
      email: false,
    },
  },
  single: {
    name: "Single Review",
    price: 9900,
    orderName: "Clauze Single Review",
    reviewsPerMonth: 1,
    features: {
      reviews: 1,
      summary: true,
      translation: true,
      history: false,
      pattern: false,
      email: false,
    },
  },
  pro: {
    name: "Pro",
    price: 17000,
    orderName: "Clauze Pro 구독",
    reviewsPerMonth: null, // unlimited
    features: {
      reviews: -1, // unlimited
      summary: true,
      translation: true,
      history: true,
      pattern: true,
      email: true,
    },
  },
  business: {
    name: "Business",
    price: 79000,
    orderName: "Clauze Business 구독",
    reviewsPerMonth: null, // unlimited
    features: {
      reviews: -1, // unlimited
      summary: true,
      translation: true,
      history: true,
      pattern: true,
      email: true,
      teamSize: 5,
      api: true,
      priority: true,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// ===== Toss Payments =====

function getTossAuthHeader() {
  const secret = process.env.TOSS_SECRET_KEY!;
  return "Basic " + Buffer.from(secret + ":").toString("base64");
}

export async function issueBillingKey(authKey: string, customerKey: string) {
  const res = await fetch(
    "https://api.tosspayments.com/v1/billing/authorizations/issue",
    {
      method: "POST",
      headers: {
        Authorization: getTossAuthHeader(),
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
        Authorization: getTossAuthHeader(),
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

// ===== Dodo Payments =====

function getDodoAuthHeader() {
  const apiKey = process.env.DODO_API_KEY!;
  return "Bearer " + apiKey;
}

export async function issueDodoBillingKey(
  cardToken: string,
  customerKey: string,
  customerEmail: string,
  customerName: string
) {
  const res = await fetch(
    "https://api.dodo.dev/v1/billing/keys",
    {
      method: "POST",
      headers: {
        Authorization: getDodoAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardToken,
        customerKey,
        customerEmail,
        customerName,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "도도 빌링키 발급 실패");
  }
  return res.json();
}

export async function chargeDodoBilling({
  billingKey,
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
}: {
  billingKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const res = await fetch(
    "https://api.dodo.dev/v1/billing/charges",
    {
      method: "POST",
      headers: {
        Authorization: getDodoAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billingKey,
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
    throw new Error(err.message ?? "도도 결제 실패");
  }
  return res.json();
}

// 일회성 결제 (Dodo)
export async function chargeOnce({
  cardToken,
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
}: {
  cardToken: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const res = await fetch(
    "https://api.dodo.dev/v1/charges",
    {
      method: "POST",
      headers: {
        Authorization: getDodoAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardToken,
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
