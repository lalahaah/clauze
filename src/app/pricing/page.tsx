// src/app/pricing/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PricingCard } from "@/components/PricingCard";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", textOffWhite: "rgba(255,255,255,0.85)",
  borderLight: "rgba(4,34,40,0.1)", borderDark: "rgba(255,255,255,0.15)",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

const FAQ = [
  { q: "무료 플랜에서 유료 플랜으로 언제든지 업그레이드할 수 있나요?", a: "네, 언제든지 업그레이드 가능합니다. 업그레이드 시 즉시 모든 기능이 활성화됩니다." },
  { q: "계약서 원본은 저장되나요?", a: "업로드된 PDF는 분석 후 자동 삭제됩니다. 검토 결과 텍스트만 저장됩니다." },
  { q: "스캔된 이미지 PDF도 분석 가능한가요?", a: "텍스트 기반 PDF만 지원됩니다. 이미지 스캔 PDF는 OCR 처리 후 다시 업로드해주세요." },
  { q: "법적 효력이 있나요?", a: "본 서비스는 참고용 분석을 제공하며 법적 조언이 아닙니다. 중요한 계약은 법률 전문가와 상담하세요." },
  { q: "환불 정책은 어떻게 되나요?", a: "결제일로부터 7일 이내 환불 가능합니다." },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleSelectPlan = async (plan: "free" | "pro" | "business") => {
    if (plan === "free") {
      router.push(user ? "/dashboard" : "/login?signup=true");
      return;
    }

    if (!user) {
      router.push(`/login?signup=true&plan=${plan}`);
      return;
    }

    // 이미 동일 플랜이면 포털로
    if (userData?.plan === plan) {
      await openBillingPortal();
      return;
    }

    setCheckoutLoading(plan);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("결제 페이지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const openBillingPortal = async () => {
    if (!user) return;
    setCheckoutLoading("portal");
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("구독 관리 페이지를 불러오지 못했습니다.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const currentPlan = userData?.plan ?? "free";

  const plans = [
    {
      plan: "free" as const,
      name: "Free",
      price: "₩0",
      period: "/월",
      description: "부담 없이 체험해보세요",
      features: ["월 2건 검토", "한국어 요약", "검토 이력 7일"],
      lockedFeatures: ["영문 번역", "위험 조항 하이라이트"],
      cta: currentPlan === "free" ? "현재 플랜" : "무료 시작",
      featured: false,
    },
    {
      plan: "pro" as const,
      name: "Pro",
      price: "₩19,000",
      period: "/월",
      description: "외국인 프리랜서 · 1인 사업자",
      features: ["무제한 검토", "한국어 + 영문 번역", "위험 조항 하이라이트", "검토 이력 무제한"],
      lockedFeatures: [],
      cta: currentPlan === "pro"
        ? "구독 관리"
        : (checkoutLoading === "pro" ? "연결 중..." : "Pro 시작하기"),
      featured: true,
    },
    {
      plan: "business" as const,
      name: "Business",
      price: "₩79,000",
      period: "/월",
      description: "법무팀 없는 중소기업",
      features: ["Pro 모든 기능", "팀 5인 공유", "커스텀 체크리스트", "API 연동"],
      lockedFeatures: [],
      cta: currentPlan === "business"
        ? "구독 관리"
        : (checkoutLoading === "business" ? "연결 중..." : "Business 시작"),
      featured: false,
    },
  ];

  return (
    <div style={{ background: R.bgLight, minHeight: "100vh", fontFamily: R.fontSans }}>
      {/* Utility bar */}
      <div style={{ background: R.bgDark, padding: "6px 40px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 24 }}>
        {!loading && user ? (
          <>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: R.fontSans }}>{user.email}</span>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}
            >DASHBOARD</button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}
          >LOGIN</button>
        )}
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}>GET SUPPORT</button>
      </div>

      {/* Nav */}
      <nav style={{ background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 36, height: 68, position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 16, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLAUZE</span>
        </Link>
        {[["dashboard", "Dashboard"], ["pricing", "Pricing"]].map(([href, label]) => (
          <Link key={href} href={`/${href}`} style={{ fontSize: 14, fontFamily: R.fontSans, fontWeight: href === "pricing" ? 700 : 500, color: R.textDark, padding: "4px 0", textDecoration: "none", borderBottom: href === "pricing" ? `2px solid ${R.tealMid}` : "2px solid transparent" }}>{label}</Link>
        ))}
        <div style={{ flex: 1 }} />
        {!loading && user && currentPlan !== "free" && (
          <div style={{
            padding: "4px 12px", borderRadius: 20,
            background: "rgba(0,194,181,0.12)",
            fontSize: 11, fontWeight: 700, color: R.tealMid,
            fontFamily: R.fontSans, textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            {currentPlan} Plan
          </div>
        )}
        <button
          onClick={() => router.push(user ? "/dashboard" : "/login?signup=true")}
          style={{ padding: "13px 28px", background: R.tealBtn, color: R.textWhite, border: `1.5px solid ${R.tealBtn}`, borderRadius: R.btnRadius, fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer" }}
        >
          {user ? "대시보드" : "시작하기"}
        </button>
      </nav>

      {/* Header — dark */}
      <div style={{ background: R.bgDark, padding: "80px 40px 96px", textAlign: "center" }}>
        <p style={{ fontFamily: R.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealBright, margin: "0 0 14px" }}>Pricing</p>
        <h1 style={{ fontFamily: R.fontSans, fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, color: R.textWhite, letterSpacing: "-0.03em", margin: "0 0 16px" }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 17, color: R.textOffWhite, maxWidth: 480, margin: "0 auto", fontFamily: R.fontSans }}>변호사 1회 검토비(30~50만원)의 1/20 비용으로 매월 무제한 검토</p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1000, margin: "-40px auto 0", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
            <PricingCard
              {...plan}
              onSelect={() => handleSelectPlan(plan.plan)}
              disabled={checkoutLoading !== null}
            />
          </motion.div>
        ))}
      </div>

      {/* Billing portal link for paid users */}
      {!loading && user && currentPlan !== "free" && (
        <div style={{ textAlign: "center", marginTop: -48, marginBottom: 48 }}>
          <button
            onClick={openBillingPortal}
            disabled={checkoutLoading === "portal"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: R.textLight, fontFamily: R.fontSans,
              textDecoration: "underline",
            }}
          >
            {checkoutLoading === "portal" ? "연결 중..." : "구독 취소 또는 결제 정보 변경 →"}
          </button>
        </div>
      )}

      {/* FAQ */}
      <div style={{ background: R.bgWhite, borderTop: `1px solid ${R.borderLight}`, padding: "80px 40px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontFamily: R.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: "0 0 14px", textAlign: "center" }}>FAQ</p>
          <h2 style={{ fontFamily: R.fontSans, fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", textAlign: "center", margin: "0 0 40px" }}>자주 묻는 질문</h2>
          <div style={{ borderTop: `1px solid ${R.borderLight}` }}>
            {FAQ.map(({ q, a }) => (
              <details key={q} style={{ borderBottom: `1px solid ${R.borderLight}` }}>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", cursor: "pointer", fontFamily: R.fontSans, fontSize: 17, fontWeight: 700, color: R.textDark, letterSpacing: "-0.01em", listStyle: "none" }}>
                  {q}
                  <span style={{ fontSize: 20, color: R.tealMid, flexShrink: 0, marginLeft: 16 }}>+</span>
                </summary>
                <p style={{ fontSize: 14, color: R.textMid, lineHeight: 1.7, paddingBottom: 20, margin: 0, fontFamily: R.fontSans }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div style={{ background: R.bgDark, padding: "64px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: R.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealBright, margin: "0 0 14px" }}>Enterprise</p>
        <h3 style={{ fontFamily: R.fontSans, fontSize: 32, fontWeight: 800, color: R.textWhite, letterSpacing: "-0.03em", margin: "0 0 12px" }}>대기업 · 엔터프라이즈 문의</h3>
        <p style={{ fontSize: 16, color: R.textOffWhite, margin: "0 0 32px", fontFamily: R.fontSans }}>대용량 계약서, 맞춤형 솔루션, 온프레미스 설치 문의</p>
        <button
          onClick={() => window.location.href = "mailto:hello@clauze.io?subject=Enterprise 문의"}
          style={{ padding: "13px 32px", background: "transparent", color: R.textWhite, border: `1.5px solid ${R.borderDark}`, borderRadius: R.btnRadius, fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer" }}
        >
          엔터프라이즈 문의하기
        </button>
      </div>

      <footer style={{ background: R.bgDark, borderTop: `1px solid ${R.borderDark}`, padding: "24px 40px" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", fontFamily: R.fontSans }}>
          © 2026 Clauze. All rights reserved. · 본 서비스는 법적 조언을 제공하지 않습니다.
        </p>
      </footer>
    </div>
  );
}
