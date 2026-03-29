// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ContractUploader } from "@/components/ContractUploader";
import { RiskBadge } from "@/components/RiskBadge";
import { db } from "@/lib/firebase";
import { Review, RiskLevel } from "@/lib/types";

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

function relativeTime(isoDate: string, lang: "ko" | "en"): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (lang === "en") {
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return new Date(isoDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

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
          id="gp-dash"
          width="40" height="40"
          patternUnits="userSpaceOnUse"
          x={gridOffX} y={gridOffY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gp-dash)" />
    </svg>
  );
}

const PillBtn = ({
  children, onClick, variant = "outline", dark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "filled";
  dark?: boolean;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 24px",
        background: variant === "filled"
          ? (hov ? R.tealDark : R.tealBtn)
          : (hov ? (dark ? "rgba(255,255,255,0.1)" : "rgba(4,34,40,0.06)") : "transparent"),
        color: variant === "filled" ? R.textWhite : (dark ? R.textWhite : R.textDark),
        border: variant === "filled" ? `1.5px solid ${R.tealBtn}` : `1.5px solid ${dark ? "rgba(255,255,255,0.4)" : R.borderLight}`,
        borderRadius: R.btnRadius,
        fontSize: 13, fontWeight: 700,
        fontFamily: R.fontSans, cursor: "pointer",
        letterSpacing: "-0.01em", transition: "all 0.2s",
        whiteSpace: "nowrap" as const,
      }}
    >{children}</button>
  );
};

// 리스트 로딩 스켈레톤
function ReviewSkeleton() {
  return (
    <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, overflow: "hidden", border: `1px solid ${R.borderLight}` }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < 3 ? `1px solid ${R.borderLight}` : "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 4, background: R.bgLight }} />
          <div style={{ flex: 1, height: 14, borderRadius: 4, background: R.bgLight, maxWidth: 280 }} />
          <div style={{ width: 60, height: 12, borderRadius: 4, background: R.bgLight }} />
          <div style={{ width: 56, height: 22, borderRadius: 28, background: R.bgLight }} />
        </div>
      ))}
    </div>
  );
}

// 빈 상태
function EmptyState({ lang, onScroll }: { lang: "ko" | "en"; onScroll: () => void }) {
  return (
    <div style={{
      background: R.bgWhite, borderRadius: R.cardRadius,
      border: `1px solid ${R.borderLight}`,
      padding: "56px 32px", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "rgba(0,165,153,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 17V10M11 13l3-3 3 3" stroke={R.tealMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="4" width="20" height="20" rx="3" stroke={R.tealMid} strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: R.textDark, margin: "0 0 8px", fontFamily: R.fontSans }}>
        {lang === "ko" ? "아직 검토 이력이 없어요" : "No reviews yet"}
      </p>
      <p style={{ fontSize: 14, color: R.textLight, margin: "0 0 24px", fontFamily: R.fontSans }}>
        {lang === "ko"
          ? "위 업로드 영역에 계약서 PDF를 드래그하거나 클릭하여 첫 번째 분석을 시작하세요."
          : "Drag & drop or click the upload area above to start your first analysis."}
      </p>
      <button
        onClick={onScroll}
        style={{
          padding: "10px 24px", borderRadius: R.btnRadius,
          background: R.bgDark, border: "none",
          fontSize: 13, fontWeight: 700, color: R.tealBright,
          fontFamily: R.fontSans, cursor: "pointer",
        }}
      >
        {lang === "ko" ? "계약서 업로드하기 →" : "Upload Contract →"}
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [uploadError, setUploadError] = useState("");
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffX = useMotionValue(0);
  const gridOffY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffX.set((gridOffX.get() + 0.5) % 40);
    gridOffY.set((gridOffY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  // 인증 확인 및 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Firestore에서 검토 이력 로드
  useEffect(() => {
    if (!user) return;

    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("uid", "==", user.uid),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Review))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(data);
      } catch (err) {
        console.error("Reviews fetch error:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  // 동적 메트릭
  const totalReviews = reviews.length;
  const highRiskCount = reviews.filter(r => r.riskLevel === "high").length;
  const avgTimeSec = reviews.length > 0
    ? Math.round(reviews.reduce((sum, r) => sum + (r.processingTime ?? 0), 0) / reviews.length / 1000)
    : 0;

  const scrollToUpload = () => {
    document.getElementById("upload-zone")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: R.bgLight, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: R.fontSans }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: R.tealMid }}>로딩 중...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
    <div style={{ background: R.bgLight, minHeight: "100vh", fontFamily: R.fontSans }}>

      {/* ── Top utility bar ── */}
      <div style={{ background: R.bgDark, padding: "6px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: R.fontSans }}>
            {user?.email}
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}>GET SUPPORT</button>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          >LOGOUT</button>
        </div>
      </div>

      {/* ── Sticky nav ── */}
      <nav style={{ background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 36, height: 68, position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 16, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLAUZE</span>
        </Link>
        {[["dashboard", "Dashboard"], ["pricing", "Pricing"]] .map(([href, label]) => (
          <Link key={href} href={`/${href}`} style={{
            fontSize: 14, fontFamily: R.fontSans,
            fontWeight: href === "dashboard" ? 700 : 500, color: R.textDark,
            padding: "4px 0", textDecoration: "none",
            borderBottom: href === "dashboard" ? `2px solid ${R.tealMid}` : "2px solid transparent",
          }}>{label}</Link>
        ))}
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
        <PillBtn onClick={() => router.push("/pricing")} variant="filled">Upgrade</PillBtn>
      </nav>

      {/* ── Dark hero header ── */}
      <div
        onMouseMove={e => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
        style={{ position: "relative", background: R.bgDark, padding: "72px 40px 112px", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, zIndex: 0 }}>
          <GridSVG gridOffX={gridOffX} gridOffY={gridOffY} />
        </div>
        <motion.div style={{ position: "absolute", inset: 0, opacity: 0.35, maskImage, WebkitMaskImage: maskImage, zIndex: 0 }}>
          <GridSVG gridOffX={gridOffX} gridOffY={gridOffY} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", right: "-5%", top: "-30%", width: "35%", height: "80%", borderRadius: "50%", background: "rgba(0,194,181,0.09)", filter: "blur(90px)" }} />
          <div style={{ position: "absolute", left: "-5%", bottom: "-20%", width: "25%", height: "60%", borderRadius: "50%", background: "rgba(0,133,124,0.12)", filter: "blur(100px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p style={{ fontFamily: R.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealBright, margin: "0 0 14px" }}>My Dashboard</p>
            <h1 style={{ fontFamily: R.fontSans, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: R.textWhite, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 14px" }}>
              {lang === "ko" ? "계약서 검토" : "Contract Reviews"}
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontFamily: R.fontSans, margin: 0, maxWidth: 420 }}>
              {lang === "ko"
                ? "계약서를 업로드하고 30초 이내에 위험 분석을 받으세요."
                : "Upload a contract for AI-powered risk analysis in under 30 seconds."
              }
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div style={{ maxWidth: 1100, margin: "-56px auto 0", padding: "0 40px", position: "relative", zIndex: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {[
            {
              label: lang === "ko" ? "전체 검토" : "TOTAL REVIEWS",
              value: reviewsLoading ? "—" : String(totalReviews),
              sub: reviewsLoading ? "" : (lang === "ko" ? `누적 ${totalReviews}건` : `${totalReviews} total`),
              accent: R.tealMid,
            },
            {
              label: lang === "ko" ? "고위험 발견" : "HIGH RISK FOUND",
              value: reviewsLoading ? "—" : String(highRiskCount),
              sub: reviewsLoading ? "" : (lang === "ko"
                ? (highRiskCount > 0 ? `전체의 ${Math.round(highRiskCount / Math.max(totalReviews, 1) * 100)}%` : "고위험 없음")
                : (highRiskCount > 0 ? `${Math.round(highRiskCount / Math.max(totalReviews, 1) * 100)}% of total` : "None found")),
              accent: R.danger,
            },
            {
              label: lang === "ko" ? "평균 검토 시간" : "AVG REVIEW TIME",
              value: reviewsLoading ? "—" : (avgTimeSec > 0 ? `${avgTimeSec}s` : "—"),
              sub: lang === "ko" ? "업계 평균 3일 대비" : "vs. 3 days industry avg",
              accent: R.success,
            },
          ].map(({ label, value, sub, accent }) => (
            <div key={label} style={{
              background: R.bgWhite, padding: "24px 28px",
              borderRadius: R.cardRadius, borderTop: `3px solid ${accent}`,
              boxShadow: "0 4px 28px rgba(4,34,40,0.09)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: R.textLight, marginBottom: 8, fontFamily: R.fontSans }}>{label}</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: R.textDark, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6, fontFamily: R.fontMono }}>{value}</div>
              <div style={{ fontSize: 13, color: R.textLight, fontFamily: R.fontSans }}>{sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Upload */}
        <motion.div id="upload-zone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 36 }}>
          <ContractUploader
            onUploadComplete={(id, result, fileName) => {
              const createdAt = new Date().toISOString();
              sessionStorage.setItem(`review_${id}`, JSON.stringify({ id, result, fileName, createdAt }));
              // 목록에 즉시 추가 (낙관적 업데이트)
              setReviews(prev => [{
                id, uid: user.uid, fileName, storageUrl: "",
                result, riskLevel: result.overallRisk as RiskLevel,
                createdAt, processingTime: 0,
              }, ...prev]);
              router.push(`/review/${id}`);
            }}
            onError={setUploadError}
            userId={user?.uid}
          />
          {uploadError && (
            <p style={{ fontSize: 12, color: R.danger, marginTop: 8, fontFamily: R.fontSans }}>{uploadError}</p>
          )}
        </motion.div>

        {/* Recent reviews */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontFamily: R.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: 0 }}>
              {lang === "ko" ? "최근 검토" : "Recent Reviews"}
            </p>
            {reviews.length > 0 && (
              <span style={{ fontSize: 12, color: R.textLight, fontFamily: R.fontSans }}>
                {lang === "ko" ? `총 ${totalReviews}건` : `${totalReviews} total`}
              </span>
            )}
          </div>

          {reviewsLoading ? (
            <ReviewSkeleton />
          ) : reviews.length === 0 ? (
            <EmptyState lang={lang} onScroll={scrollToUpload} />
          ) : (
            <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, overflow: "hidden", border: `1px solid ${R.borderLight}` }}>
              {reviews.map(({ id, fileName, createdAt, riskLevel }, i) => (
                <div
                  key={id}
                  onClick={() => {
                    // sessionStorage에 데이터가 있으면 그대로, 없으면 review 페이지에서 처리
                    router.push(`/review/${id}`);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "16px 24px",
                    borderBottom: i < reviews.length - 1 ? `1px solid ${R.borderLight}` : "none",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = R.bgLight)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: R.bgLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: R.textLight, flexShrink: 0, fontFamily: R.fontMono }}>PDF</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: R.textDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: R.fontSans }}>{fileName}</div>
                  <div style={{ fontSize: 13, color: R.textLight, flexShrink: 0, fontFamily: R.fontSans }}>{relativeTime(createdAt, lang)}</div>
                  <RiskBadge level={riskLevel} />
                  <div style={{ fontSize: 12, color: R.textLight, fontFamily: R.fontSans }}>→</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
