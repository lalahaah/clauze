// src/app/review/[id]/page.tsx
"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";
import { ReviewResult } from "@/components/ReviewResult";
import { Review } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { ResultDisclaimer, FooterDisclaimer } from "@/components/legal/Disclaimer";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", textOffWhite: "rgba(255,255,255,0.85)",
  borderLight: "rgba(4,34,40,0.1)", borderDark: "rgba(255,255,255,0.15)",
  danger: "#D94F3D", warning: "#E59A1A", success: "#1A9E6A",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

function GridSVG({
  gridOffX, gridOffY,
}: {
  gridOffX: ReturnType<typeof useMotionValue<number>>;
  gridOffY: ReturnType<typeof useMotionValue<number>>;
}) {
  return (
    <svg style={{ width: "100%", height: "100%" }}>
      <defs>
        <motion.pattern
          id="gp-review"
          width="40" height="40"
          patternUnits="userSpaceOnUse"
          x={gridOffX} y={gridOffY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gp-review)" />
    </svg>
  );
}

const DEMO_REVIEW: Review = {
  id: "1",
  uid: "demo",
  fileName: "프리랜서_용역계약서_A사.pdf",
  storageUrl: "",
  processingTime: 28000,
  riskLevel: "high",
  createdAt: new Date().toISOString(),
  result: {
    overallRisk: "high",
    summary_ko: "이 계약서에는 일방적으로 수정 가능한 대금 조항과 과도한 지식재산권 양도 조항이 포함되어 있습니다. 서명 전 반드시 해당 조항의 수정을 요청하시기 바랍니다.",
    summary_en: "This contract contains unilateral payment modification clauses and broad IP assignment terms that may disadvantage the service provider. Negotiation is strongly recommended before signing.",
    clauses: [
      { title: "제7조 – 대금 지급 조건", content_ko: '"갑의 사정에 따라 대금을 조정할 수 있다" — 구체적 기준 없이 일방적 변경이 가능한 구조입니다.', content_en: '"Party A may adjust the payment based on circumstances" — no objective criteria defined.', risk: "high", action: "해당 조항 삭제 또는 구체적 지급 기준 명시 요청" },
      { title: "제11조 – 지식재산권 귀속", content_ko: "산출물의 모든 지식재산권이 계약 종료 후에도 영구적으로 갑에게 귀속됩니다.", content_en: "All IP rights permanently assigned to Party A including derivative works — unusually broad scope.", risk: "high", action: "범위 제한 및 2차 저작물 권리 협상 요청" },
      { title: "제15조 – 계약 해지 조건", content_ko: "갑은 7일, 을은 30일 사전 통보 요건 — 비대칭적 조건입니다.", content_en: "Asymmetric termination: Party A 7-day vs Party B 30-day notice period.", risk: "medium", action: "조건 대칭 수정 요청 권장" },
      { title: "제3조 – 계약 기간", content_ko: "2026년 4월 1일부터 12월 31일까지 표준 기간으로 설정되어 있습니다.", content_en: "Standard contract term April 1 – December 31, 2026. No issues found.", risk: "low", action: null },
      { title: "제5조 – 비밀유지 의무", content_ko: "계약 종료 후 2년간 비밀유지 의무를 지는 표준 조항입니다.", content_en: "Standard 2-year NDA post-termination. Within normal industry range.", risk: "low", action: null },
    ],
  },
};

interface Props { params: Promise<{ id: string }> }

export default function ReviewPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [review, setReview] = useState<Review>(DEMO_REVIEW);
  const [lang, setLang] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const stored = sessionStorage.getItem(`review_${id}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setReview({ id: data.id, uid: "", fileName: data.fileName, storageUrl: "", processingTime: 0, riskLevel: data.result.overallRisk, createdAt: data.createdAt, result: data.result });
      } catch {
        // sessionStorage 파싱 실패 시 DEMO_REVIEW 유지
      }
    }
  }, [id]);

  const highCount = review.result.clauses.filter(c => c.risk === "high").length;
  const mediumCount = review.result.clauses.filter(c => c.risk === "medium").length;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffX = useMotionValue(0);
  const gridOffY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffX.set((gridOffX.get() + 0.5) % 40);
    gridOffY.set((gridOffY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div style={{ background: R.bgLight, minHeight: "100vh", fontFamily: R.fontSans }}>

      {/* ── Top utility bar ── */}
      <div style={{ background: R.bgDark, padding: "6px 40px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 24 }}>
        {user && !loading && (
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans }}>
            {user.email}
          </div>
        )}
        <button
          onClick={() => user ? logout() : router.push("/login")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}
        >{user ? "LOGOUT" : "LOGIN"}</button>
        <button
          onClick={() => {}}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}
        >GET SUPPORT</button>
      </div>

      {/* ── Sticky nav ── */}
      <nav style={{ background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 24, height: 68, position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLAUZE</span>
        </Link>

        {/* Breadcrumb */}
        <span style={{ fontSize: 13, color: R.textLight, fontFamily: R.fontSans }}>
          <span
            onClick={() => router.push("/dashboard")}
            style={{ cursor: "pointer", color: R.textMid }}
          >Dashboard</span>
          {" / "}
          <span style={{ color: R.textDark, fontWeight: 600 }}>Review</span>
        </span>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 4, padding: "4px 8px", background: R.bgLight, borderRadius: "20px" }}>
          {(["ko", "en"] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "6px 12px", borderRadius: "16px",
                background: lang === l ? R.bgWhite : "transparent",
                border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 700, color: lang === l ? R.textDark : R.textLight,
                fontFamily: R.fontSans, transition: "all 0.2s"
              }}
            >{l.toUpperCase()}</button>
          ))}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "none", border: `1px solid ${R.borderLight}`, borderRadius: R.btnRadius, padding: "7px 18px", fontSize: 13, color: R.textMid, fontFamily: R.fontSans, cursor: "pointer", fontWeight: 600 }}
        >← Dashboard</button>
      </nav>

      {/* ── Dark hero header ── */}
      <div
        onMouseMove={e => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
        style={{ position: "relative", background: R.bgDark, padding: "64px 40px 108px", overflow: "hidden" }}
      >
        {/* Subtle static grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, zIndex: 0 }}>
          <GridSVG gridOffX={gridOffX} gridOffY={gridOffY} />
        </div>
        {/* Mouse-reveal grid */}
        <motion.div style={{ position: "absolute", inset: 0, opacity: 0.35, maskImage, WebkitMaskImage: maskImage, zIndex: 0 }}>
          <GridSVG gridOffX={gridOffX} gridOffY={gridOffY} />
        </motion.div>
        {/* Glow orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", right: "-5%", top: "-20%", width: "30%", height: "70%", borderRadius: "50%", background: "rgba(217,79,61,0.08)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", left: "-5%", bottom: "-20%", width: "25%", height: "50%", borderRadius: "50%", background: "rgba(0,133,124,0.10)", filter: "blur(100px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p style={{ fontFamily: R.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealBright, margin: "0 0 14px" }}>
              {lang === "ko" ? "검토 결과" : "Review Result"}
            </p>
            <h1 style={{ fontFamily: R.fontSans, fontSize: "clamp(20px, 3vw, 36px)", fontWeight: 800, color: R.textWhite, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 20px", maxWidth: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {review.fileName}
            </h1>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {/* High risk badge */}
              {highCount > 0 && (
                <div style={{ padding: "5px 14px", background: "rgba(217,79,61,0.15)", border: "1px solid rgba(217,79,61,0.3)", borderRadius: R.btnRadius, fontSize: 12, fontWeight: 700, color: "#E87A6D", fontFamily: R.fontSans }}>
                  {lang === "ko" ? "고위험" : "High Risk"} {highCount}
                </div>
              )}
              {/* Medium badge */}
              {mediumCount > 0 && (
                <div style={{ padding: "5px 14px", background: "rgba(229,154,26,0.15)", border: "1px solid rgba(229,154,26,0.3)", borderRadius: R.btnRadius, fontSize: 12, fontWeight: 700, color: "#F0B84A", fontFamily: R.fontSans }}>
                  {lang === "ko" ? "주의" : "Caution"} {mediumCount}
                </div>
              )}
              <div style={{ width: 1, height: 14, background: R.borderDark }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: R.fontMono }}>
                {lang === "ko" ? "분석 완료" : "Analyzed"} {review.processingTime ? Math.round(review.processingTime / 1000) : "-"}s
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Review result (overlaps hero) ── */}
      <div style={{ maxWidth: 1100, margin: "-48px auto 0", padding: "0 40px 40px", position: "relative", zIndex: 20 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ReviewResult review={review} lang={lang} />
          <ResultDisclaimer />
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: R.bgDark }}>
        <FooterDisclaimer />
      </footer>
    </div>
  );
}
