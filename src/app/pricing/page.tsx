// src/app/pricing/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadTossPayments } from "@tosspayments/sdk";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { FooterDisclaimer } from "@/components/legal/Disclaimer";
import type { PlanKey } from "@/lib/payment";

// 결제 수단 선택 (환경 변수로 기본값 설정)
const PAYMENT_PROVIDER = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "dodo") as "toss" | "dodo";

// 디자인 토큰
const T = {
  bgDark:   "#093944",
  bgLight:  "#F6F7FB",
  bgCard:   "#FFFFFF",
  teal:     "#00A599",
  tealBr:   "#00C2B5",
  tealDk:   "#00857C",
  text:     "#042228",
  textMid:  "#3D5A5E",
  textLt:   "#7A9A9E",
  border:   "rgba(4,34,40,0.08)",
  borderDk: "rgba(255,255,255,0.10)",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
  btnR:     "28px",
} as const;

// FAQ 데이터
const FAQ_ITEMS = [
  {
    q: "단건 결제와 구독의 차이가 뭔가요?",
    qEn: "What's the difference between per-review and subscription?",
    a: "단건(₩9,900)은 계약서 1건씩 필요할 때만 결제합니다. 구독 없이 자유롭게 이용하실 수 있습니다. 월 2건 이상 검토하신다면 Pro(₩17,000)가 더 저렴합니다.",
    aEn: "Single Review (₩9,900) charges per contract with no subscription. If you review 2+ contracts per month, Pro (₩17,000) is more cost-effective.",
  },
  {
    q: "무료 플랜 이후 자동으로 요금이 청구되나요?",
    qEn: "Will I be charged automatically after the free plan?",
    a: "아니요. 무료 플랜은 자동 결제가 없습니다. 월 1건 검토를 무료로 이용하시고, 추가 검토가 필요할 때 직접 단건 결제 또는 Pro를 선택하시면 됩니다.",
    aEn: "No. Free plan has no automatic charges. You get 1 free review per month. Choose Single Review or Pro when you need more.",
  },
  {
    q: "외국인도 결제할 수 있나요?",
    qEn: "Can international users pay?",
    a: "네. Visa, Mastercard, Amex 등 해외 발급 카드로 결제 가능합니다. 토스페이먼츠를 통해 안전하게 처리됩니다.",
    aEn: "Yes. We accept Visa, Mastercard, Amex and other international cards, processed securely through Toss Payments.",
  },
  {
    q: "구독은 언제든지 취소 가능한가요?",
    qEn: "Can I cancel my subscription anytime?",
    a: "네. 계정 설정에서 언제든지 취소하실 수 있습니다. 취소 후에도 현재 결제 기간 만료일까지 서비스를 계속 이용하실 수 있습니다.",
    aEn: "Yes, cancel anytime from your account settings. Your plan stays active until the end of the current billing period.",
  },
];

// FAQ 아코디언 아이템
function FaqItem({ q, qEn, a, aEn, open, onToggle }: {
  q: string; qEn: string; a: string; aEn: string;
  open: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "22px 0", background: "none",
          border: "none", cursor: "pointer", textAlign: "left", gap: 16,
        }}
      >
        <div>
          <div style={{ fontFamily: T.fontSans, fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>{q}</div>
          <div style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textLt, marginTop: 2 }}>{qEn}</div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: `1.5px solid ${open ? T.teal : T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: open ? T.teal : T.textLt,
          fontSize: 16, fontWeight: 700, transition: "all 0.2s",
          background: open ? "rgba(0,165,153,0.06)" : "transparent",
        }}>
          {open ? "−" : "+"}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 20 }}>
              <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textMid, lineHeight: 1.75, margin: "0 0 6px" }}>{a}</p>
              <p style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textLt, lineHeight: 1.7, margin: 0 }}>{aEn}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 플랜 카드 컴포넌트
interface CardProps {
  planKey: PlanKey;
  name: string;
  price: string;
  period: string;
  priceNote?: string;
  descKo: string;
  descEn: string;
  features: string[];
  lockedFeatures: string[];
  ctaKo: string;
  featured?: boolean;
  savingsNote?: string;
  betaNote?: boolean;
  currentPlan: string;
  checkoutLoading: string | null;
  onSelect: () => void;
}

function PlanCard({
  planKey, name, price, period, priceNote, descKo, descEn,
  features, lockedFeatures, ctaKo, featured = false, savingsNote,
  betaNote, currentPlan, checkoutLoading, onSelect,
}: CardProps) {
  const [hov, setHov] = useState(false);
  const isActive = checkoutLoading !== null;
  const isThisLoading = checkoutLoading === planKey || checkoutLoading === "portal";

  // CTA 텍스트 결정
  let ctaText = ctaKo;
  if (currentPlan === planKey) {
    ctaText = planKey === "free" ? "현재 플랜" : "구독 관리";
  }
  if (isThisLoading) ctaText = "연결 중...";

  const isFilled = featured;

  return (
    <div
      style={{
        background: featured ? T.bgDark : T.bgCard,
        borderRadius: 4,
        border: featured ? `2px solid ${T.teal}` : `0.5px solid ${T.border}`,
        padding: "36px 28px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        boxShadow: featured ? "0 12px 40px rgba(0,165,153,0.18)" : "none",
      }}
    >
      {/* MOST POPULAR 배지 */}
      {featured && (
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "1.6px",
          color: T.tealBr, textTransform: "uppercase",
          fontFamily: T.fontSans, marginBottom: 12,
        }}>
          Most Popular
        </div>
      )}

      {/* 플랜명 */}
      <div style={{
        fontSize: 18, fontWeight: 800,
        color: featured ? "#FFFFFF" : T.text,
        letterSpacing: "-0.02em", fontFamily: T.fontSans,
        marginBottom: 4,
      }}>
        {name}
      </div>

      {/* 설명 */}
      <div style={{
        fontSize: 12,
        color: featured ? "rgba(255,255,255,0.65)" : T.textLt,
        fontFamily: T.fontSans, marginBottom: 20, lineHeight: 1.5,
      }}>
        {descKo}<br />
        <span style={{ opacity: 0.75 }}>{descEn}</span>
      </div>

      {/* 가격 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: priceNote ? 4 : 24 }}>
        <span style={{
          fontSize: 38, fontWeight: 800,
          color: featured ? "#FFFFFF" : T.text,
          letterSpacing: "-0.04em", fontFamily: T.fontMono,
        }}>
          {price}
        </span>
        <span style={{
          fontSize: 13,
          color: featured ? "rgba(255,255,255,0.65)" : T.textLt,
          fontFamily: T.fontSans,
        }}>
          {period}
        </span>
      </div>

      {/* 가격 보조 텍스트 (단건용) */}
      {priceNote && (
        <div style={{
          fontSize: 11, color: featured ? "rgba(255,255,255,0.5)" : T.textLt,
          fontFamily: T.fontSans, marginBottom: 20,
        }}>
          {priceNote}
        </div>
      )}

      {/* 기능 목록 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
        {features.map(f => (
          <div key={f} style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            fontSize: 13,
            color: featured ? "rgba(255,255,255,0.85)" : T.textMid,
            fontFamily: T.fontSans,
          }}>
            <span style={{ color: featured ? T.tealBr : T.teal, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
            {f}
          </div>
        ))}
        {lockedFeatures.map(f => (
          <div key={f} style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            fontSize: 13,
            color: featured ? "rgba(255,255,255,0.25)" : "rgba(122,154,158,0.6)",
            textDecoration: "line-through", fontFamily: T.fontSans,
          }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>✕</span>
            {f}
          </div>
        ))}
      </div>

      {/* 베타 안내 (단건용) */}
      {betaNote && (
        <div style={{
          fontSize: 11, color: T.textLt, fontFamily: T.fontSans,
          marginBottom: 8, textAlign: "center",
        }}>
          ※ 베타 운영 중 · 로그인 후 이용 가능
        </div>
      )}

      {/* CTA 버튼 */}
      <button
        onClick={onSelect}
        disabled={isActive}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: "100%", padding: "13px 28px",
          background: isFilled
            ? (hov ? T.tealDk : T.teal)
            : (hov ? "rgba(4,34,40,0.06)" : "transparent"),
          color: isFilled ? "#FFFFFF" : T.text,
          border: isFilled ? `1.5px solid ${T.teal}` : `1.5px solid ${T.text}`,
          borderRadius: T.btnR,
          fontSize: 14, fontWeight: 700,
          fontFamily: T.fontSans,
          cursor: isActive ? "not-allowed" : "pointer",
          opacity: isActive && !isThisLoading ? 0.5 : 1,
          transition: "all 0.2s",
        }}
      >
        {ctaText}
      </button>

      {/* Pro 절약 안내 */}
      {savingsNote && (
        <div style={{
          marginTop: 12, fontSize: 11, color: T.tealBr,
          fontFamily: T.fontSans, textAlign: "center", lineHeight: 1.5,
        }}>
          {savingsNote}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────
export default function PricingPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlan = userData?.plan ?? "free";

  // 플랜 선택 핸들러
  const handleSelectPlan = async (plan: PlanKey) => {
    // 무료 플랜: 대시보드 또는 회원가입으로
    if (plan === "free") {
      router.push(user ? "/dashboard" : "/login?signup=true");
      return;
    }

    // 비로그인 상태: 회원가입으로 이동
    if (!user) {
      router.push(`/login?signup=true&plan=${plan}`);
      return;
    }

    // 이미 구독 중인 플랜: 구독 관리 포털로
    if ((currentPlan === "pro" || currentPlan === "business") && currentPlan === plan) {
      await openBillingPortal();
      return;
    }

    setCheckoutLoading(plan);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        router.push(`/login?signup=true&plan=${plan}`);
        return;
      }

      if (PAYMENT_PROVIDER === "toss") {
        await handleTossPayment(plan, uid);
      } else {
        await handleDodoPayment(plan, uid);
      }
      // 리디렉션 — 이후 코드 미실행
    } catch (err) {
      console.error("Payment error:", err);
      alert("결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setCheckoutLoading(null);
    }
  };

  // Toss Payments 처리
  const handleTossPayment = async (plan: PlanKey, uid: string) => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
    const tossPayments = await loadTossPayments(clientKey);

    await tossPayments.requestBillingAuth("카드", {
      customerKey: uid,
      successUrl: `${window.location.origin}/api/toss/billing/callback?plan=${plan}`,
      failUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      customerEmail: user?.email ?? undefined,
      customerName: user?.displayName ?? user?.email ?? "고객",
    });
  };

  // Dodo Payments 처리
  const handleDodoPayment = async (plan: PlanKey, uid: string) => {
    const idToken = await auth.currentUser?.getIdToken();
    const res = await fetch("/api/dodo/payment/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        plan,
        userId: uid,
        email: user?.email,
        name: user?.displayName ?? user?.email ?? "고객",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? "결제 요청 실패");
    }

    const data = (await res.json()) as { paymentUrl: string };
    window.location.href = data.paymentUrl;
  };

  // 구독 취소 포털
  const openBillingPortal = async () => {
    if (!user) return;
    if (!confirm("구독을 취소하시겠습니까?\n취소 후 즉시 무료 플랜으로 전환됩니다.")) return;
    setCheckoutLoading("portal");
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const cancelEndpoint = PAYMENT_PROVIDER === "toss" ? "/api/toss/cancel" : "/api/dodo/cancel";
      const res = await fetch(cancelEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        alert("구독이 취소되었습니다.");
        window.location.reload();
      } else {
        alert("구독 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  // 4개 플랜 정의
  const plans: CardProps[] = [
    {
      planKey: "free",
      name: "Free",
      price: "₩0",
      period: "/월",
      descKo: "첫 계약서, 부담 없이 확인해보세요",
      descEn: "Try your first review, no commitment",
      features: ["월 1건 검토", "한국어 요약", "위험도 분류 (고위험/주의/정상)"],
      lockedFeatures: ["영문 번역", "검토 이력 저장"],
      ctaKo: "무료로 시작",
      featured: false,
      currentPlan, checkoutLoading,
      onSelect: () => handleSelectPlan("free"),
    },
    {
      planKey: "single",
      name: "Single Review",
      price: "₩9,900",
      period: "/건",
      priceNote: "구독 아님 · 건별 결제 / No subscription · Per use",
      descKo: "필요할 때 한 건씩. 구독 없이.",
      descEn: "Pay only when you need it. No subscription.",
      features: [
        "단건 검토 (1회)",
        "한국어 + 영문 동시 요약",
        "위험도 전체 분류 (고위험/주의/정상)",
      ],
      lockedFeatures: ["협상 이메일 생성", "검토 이력 저장", "패턴 감지"],
      ctaKo: "건별 결제하기",
      featured: false,
      betaNote: true,
      currentPlan, checkoutLoading,
      onSelect: () => handleSelectPlan("single"),
    },
    {
      planKey: "pro",
      name: "Pro",
      price: "₩17,000",
      period: "/월",
      descKo: "반복 계약이 많은 프리랜서 · 1인 사업자",
      descEn: "For freelancers with recurring contracts",
      features: [
        "무제한 검토",
        "한국어 + 영문 번역",
        "위험 조항 하이라이트",
        "검토 이력 무제한 저장",
        "패턴 감지 (반복 위험 조항 알림)",
        "협상 이메일 자동 생성",
        "업종별 맞춤 분석",
      ],
      lockedFeatures: [],
      ctaKo: "Pro 시작하기",
      featured: true,
      savingsNote: "월 2건 이상이면 단건보다 저렴합니다\n2+ reviews/month? Pro beats per-review pricing.",
      currentPlan, checkoutLoading,
      onSelect: () => handleSelectPlan("pro"),
    },
    {
      planKey: "business",
      name: "Business",
      price: "₩79,000",
      period: "/월",
      descKo: "법무팀 없는 중소기업",
      descEn: "For teams without a legal department",
      features: [
        "Pro 모든 기능",
        "팀 5인 공유",
        "커스텀 체크리스트",
        "API 연동",
        "우선 지원",
      ],
      lockedFeatures: [],
      ctaKo: "Business 시작",
      featured: false,
      currentPlan, checkoutLoading,
      onSelect: () => handleSelectPlan("business"),
    },
  ];

  return (
    <div style={{ background: T.bgLight, minHeight: "100vh", fontFamily: T.fontSans }}>
      {/* 반응형 그리드 CSS */}
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          max-width: 1200px;
          margin: -40px auto 0;
          padding: 0 40px 80px;
          align-items: start;
        }
        .pricing-grid > div:nth-child(3) {
          margin-top: -16px;
        }
        @media (max-width: 1100px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pricing-grid > div:nth-child(3) {
            margin-top: 0;
          }
        }
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            padding: 0 20px 60px;
          }
        }
        details summary::-webkit-details-marker { display: none; }
      `}</style>

      {/* 유틸리티 바 */}
      <div style={{
        background: T.bgDark, padding: "6px 40px",
        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 24,
      }}>
        {!loading && user ? (
          <>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: T.fontSans }}>
              {user.email}
            </span>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
                color: "rgba(255,255,255,0.7)", fontFamily: T.fontSans, textTransform: "uppercase",
              }}
            >
              DASHBOARD
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
              color: "rgba(255,255,255,0.7)", fontFamily: T.fontSans, textTransform: "uppercase",
            }}
          >
            LOGIN
          </button>
        )}
        <button
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
            color: "rgba(255,255,255,0.7)", fontFamily: T.fontSans, textTransform: "uppercase",
          }}
        >
          GET SUPPORT
        </button>
      </div>

      {/* 네비게이션 */}
      <nav style={{
        background: T.bgCard, borderBottom: `1px solid ${T.border}`,
        padding: "0 40px", display: "flex", alignItems: "center",
        gap: 36, height: 68, position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 16, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={T.tealBr} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={T.tealBr}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={T.tealDk}/>
          </svg>
          <span style={{ fontFamily: T.fontSans, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            CLAUZE
          </span>
        </Link>
        {([["dashboard", "Dashboard"], ["pricing", "Pricing"]] as [string, string][]).map(([href, label]) => (
          <Link
            key={href}
            href={`/${href}`}
            style={{
              fontSize: 14, fontFamily: T.fontSans,
              fontWeight: href === "pricing" ? 700 : 500,
              color: T.text, padding: "4px 0", textDecoration: "none",
              borderBottom: href === "pricing" ? `2px solid ${T.teal}` : "2px solid transparent",
            }}
          >
            {label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        {/* 현재 플랜 배지 */}
        {!loading && user && currentPlan !== "free" && (
          <div style={{
            padding: "4px 12px", borderRadius: 20,
            background: "rgba(0,165,153,0.10)",
            fontSize: 11, fontWeight: 700, color: T.teal,
            fontFamily: T.fontSans, textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            {currentPlan} Plan
          </div>
        )}
        <button
          onClick={() => router.push(user ? "/dashboard" : "/login?signup=true")}
          style={{
            padding: "13px 28px", background: T.tealBr, color: "#FFFFFF",
            border: `1.5px solid ${T.tealBr}`, borderRadius: T.btnR,
            fontSize: 14, fontWeight: 700, fontFamily: T.fontSans, cursor: "pointer",
          }}
        >
          {user ? "대시보드" : "시작하기"}
        </button>
      </nav>

      {/* 헤더 다크 섹션 */}
      <div style={{ background: T.bgDark, padding: "80px 40px 96px", textAlign: "center" }}>
        <p style={{
          fontFamily: T.fontSans, fontSize: 12, fontWeight: 700,
          letterSpacing: "1.8px", textTransform: "uppercase",
          color: T.tealBr, margin: "0 0 14px",
        }}>
          Pricing
        </p>
        <h1 style={{
          fontFamily: T.fontSans, fontSize: "clamp(32px,5vw,52px)",
          fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em", margin: "0 0 16px",
        }}>
          Simple, transparent pricing
        </h1>
        <p style={{
          fontSize: 17, color: "rgba(255,255,255,0.85)",
          maxWidth: 480, margin: "0 auto", fontFamily: T.fontSans, lineHeight: 1.6,
        }}>
          필요한 만큼만. 한 건이든 무제한이든.<br />
          <span style={{ fontSize: 14, opacity: 0.7 }}>Pay only for what you need. One review or unlimited.</span>
        </p>
      </div>

      {/* 플랜 카드 그리드 */}
      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.planKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            style={{ height: "100%" }}
          >
            <PlanCard {...plan} />
          </motion.div>
        ))}
      </div>

      {/* 구독 취소 링크 (유료 구독자용) */}
      {!loading && user && (currentPlan === "pro" || currentPlan === "business") && (
        <div style={{ textAlign: "center", marginTop: -40, marginBottom: 48 }}>
          <button
            onClick={openBillingPortal}
            disabled={checkoutLoading === "portal"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: T.textLt, fontFamily: T.fontSans,
              textDecoration: "underline",
            }}
          >
            {checkoutLoading === "portal" ? "연결 중..." : "구독 취소 또는 결제 정보 변경 →"}
          </button>
        </div>
      )}

      {/* FAQ 섹션 */}
      <div style={{ background: T.bgCard, borderTop: `1px solid ${T.border}`, padding: "80px 40px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{
            fontFamily: T.fontSans, fontSize: 12, fontWeight: 700,
            letterSpacing: "1.8px", textTransform: "uppercase",
            color: T.teal, margin: "0 0 12px", textAlign: "center",
          }}>
            FAQ
          </p>
          <h2 style={{
            fontFamily: T.fontSans, fontSize: "clamp(24px,3vw,36px)",
            fontWeight: 800, color: T.text, letterSpacing: "-0.03em",
            textAlign: "center", margin: "0 0 8px",
          }}>
            자주 묻는 질문
          </h2>
          <p style={{
            textAlign: "center", fontSize: 13, color: T.textLt,
            fontFamily: T.fontSans, margin: "0 0 40px",
          }}>
            Frequently Asked Questions
          </p>
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={i}
                {...item}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 CTA 섹션 */}
      <div style={{ background: T.bgDark, padding: "80px 40px", textAlign: "center" }}>
        <p style={{
          fontFamily: T.fontSans, fontSize: 12, fontWeight: 700,
          letterSpacing: "1.8px", textTransform: "uppercase",
          color: T.tealBr, margin: "0 0 16px",
        }}>
          Get Started
        </p>
        <h3 style={{
          fontFamily: T.fontSans, fontSize: "clamp(24px,4vw,40px)",
          fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em", margin: "0 0 12px",
        }}>
          지금 바로 첫 계약서를 검토해보세요
        </h3>
        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.65)",
          margin: "0 0 32px", fontFamily: T.fontSans,
        }}>
          Start reviewing your first contract today.
        </p>
        <button
          onClick={() => router.push(user ? "/dashboard" : "/login?signup=true")}
          style={{
            padding: "15px 40px", background: T.tealBr, color: "#FFFFFF",
            border: `1.5px solid ${T.tealBr}`, borderRadius: T.btnR,
            fontSize: 15, fontWeight: 700, fontFamily: T.fontSans,
            cursor: "pointer", marginBottom: 16,
          }}
        >
          무료로 시작하기 →
        </button>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.4)",
          fontFamily: T.fontSans, margin: 0,
        }}>
          월 1건 무료 · 신용카드 불필요<br />
          <span style={{ opacity: 0.75 }}>1 free review/month · No credit card required</span>
        </p>
      </div>

      {/* 엔터프라이즈 섹션 */}
      <div style={{ background: T.bgDark, borderTop: `1px solid ${T.borderDk}`, padding: "56px 40px", textAlign: "center" }}>
        <p style={{
          fontFamily: T.fontSans, fontSize: 12, fontWeight: 700,
          letterSpacing: "1.8px", textTransform: "uppercase",
          color: T.tealBr, margin: "0 0 14px",
        }}>
          Enterprise
        </p>
        <h3 style={{
          fontFamily: T.fontSans, fontSize: 28, fontWeight: 800,
          color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 10px",
        }}>
          대기업 · 엔터프라이즈 문의
        </h3>
        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.65)",
          margin: "0 0 28px", fontFamily: T.fontSans,
        }}>
          대용량 계약서, 맞춤형 솔루션, 온프레미스 설치 문의
        </p>
        <button
          onClick={() => { window.location.href = "mailto:hello@clauze.io?subject=Enterprise 문의"; }}
          style={{
            padding: "13px 32px", background: "transparent",
            color: "#FFFFFF", border: `1.5px solid ${T.borderDk}`,
            borderRadius: T.btnR, fontSize: 14, fontWeight: 700,
            fontFamily: T.fontSans, cursor: "pointer",
          }}
        >
          엔터프라이즈 문의하기
        </button>
      </div>

      {/* 푸터 */}
      <footer style={{ background: T.bgDark, padding: "64px 40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: T.fontSans, fontSize: 16, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>CLAUZE</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 260, fontFamily: T.fontSans }}>AI-powered Korean contract review for freelancers and businesses.</p>
            </div>
            {[
              { title: "PRODUCT", items: [
                { label: "Dashboard", href: "/dashboard" },
                { label: "Contract Review", href: "/dashboard" },
                { label: "Pricing", href: "/pricing" }
              ]},
              { title: "COMPANY", items: [
                { label: "About", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Contact", href: "#" }
              ]},
              { title: "LEGAL", items: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Refund Policy", href: "/refund" },
              ]},
            ].map(({ title, items }) => (
              <div key={title}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: T.tealBr, marginBottom: 16, textTransform: "uppercase", fontFamily: T.fontSans }}>{title}</div>
                {items.map(({ label, href }) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (href === "#") return;
                      if (href.includes(".pdf")) {
                        window.open(href, "_blank");
                      } else {
                        window.location.href = href;
                      }
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      margin: 0,
                      marginBottom: 10,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      fontFamily: T.fontSans,
                      transition: "color 0.2s",
                      textAlign: "left",
                      display: "block",
                      width: "100%"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                  >{label}</button>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${T.borderDk}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: T.fontSans }}>© 2026 Clauze. All rights reserved.</div>
          </div>
        </div>
        <FooterDisclaimer />
      </footer>
    </div>
  );
}
