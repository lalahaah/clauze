// src/app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame, AnimatePresence } from "framer-motion";

const R = {
  bgWhite: "#FFFFFF",
  bgLight: "#F6F7FB",
  bgDark: "#093944",
  tealBright: "#00C2B5",
  tealMid: "#00A599",
  tealDark: "#00857C",
  tealBtn: "#00C2B5",
  textDark: "#042228",
  textMid: "#3D5A5E",
  textLight: "#7A9A9E",
  textWhite: "#FFFFFF",
  textOffWhite: "rgba(255,255,255,0.85)",
  borderLight: "rgba(4,34,40,0.1)",
  borderDark: "rgba(255,255,255,0.15)",
  danger: "#D94F3D",
  warning: "#E59A1A",
  success: "#1A9E6A",
  btnRadius: "28px",
  cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

const Eyebrow = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <p style={{
    fontFamily: R.fontSans, fontSize: 12, fontWeight: 700,
    letterSpacing: "1.8px", textTransform: "uppercase" as const,
    color: dark ? R.tealBright : R.tealMid, margin: "0 0 14px",
  }}>{children}</p>
);

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
        padding: "13px 28px",
        background: variant === "filled"
          ? (hov ? R.tealDark : R.tealBtn)
          : (hov ? (dark ? "rgba(255,255,255,0.1)" : "rgba(4,34,40,0.06)") : "transparent"),
        color: variant === "filled" ? R.textWhite : (dark ? R.textWhite : R.textDark),
        border: variant === "filled" ? `1.5px solid ${R.tealBtn}` : `1.5px solid ${dark ? R.textWhite : R.textDark}`,
        borderRadius: R.btnRadius,
        fontSize: 14, fontWeight: 700,
        fontFamily: R.fontSans, cursor: "pointer",
        letterSpacing: "-0.01em", transition: "all 0.2s",
        whiteSpace: "nowrap" as const,
      }}
    >{children}</button>
  );
};

const AccordionItem = ({ title, desc, dark = false }: { title: string; desc: string; dark?: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom: `1px solid ${dark ? R.borderDark : R.borderLight}`, cursor: "pointer" }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0" }}>
        <span style={{ fontFamily: R.fontSans, fontSize: 17, fontWeight: 700, color: dark ? R.textWhite : R.textDark, letterSpacing: "-0.01em" }}>{title}</span>
        <span style={{ fontSize: 20, color: dark ? R.tealBright : R.tealMid, fontWeight: 300, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontSize: 14, color: dark ? "rgba(255,255,255,0.65)" : R.textMid, lineHeight: 1.7, paddingBottom: 20, margin: 0, fontFamily: R.fontSans }}>{desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function GridSVG({ gridOffX, gridOffY, color = "rgba(255,255,255,0.35)" }: {
  gridOffX: ReturnType<typeof useMotionValue<number>>;
  gridOffY: ReturnType<typeof useMotionValue<number>>;
  color?: string;
}) {
  return (
    <svg style={{ width: "100%", height: "100%" }}>
      <defs>
        <motion.pattern
          id={`gp-${color.replace(/[^a-z0-9]/gi, "")}`}
          width="40" height="40"
          patternUnits="userSpaceOnUse"
          x={gridOffX} y={gridOffY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.8" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gp-${color.replace(/[^a-z0-9]/gi, "")})`} />
    </svg>
  );
}

export default function LandingPage() {
  const router = useRouter();
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
    <div style={{ background: R.bgWhite, fontFamily: R.fontSans }}>
      {/* Top utility bar */}
      <div style={{ background: R.bgDark, padding: "6px 40px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 24 }}>
        {["LOGIN", "GET SUPPORT"].map(label => (
          <button key={label} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
            color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase",
          }}
          onClick={() => label === "LOGIN" && router.push("/login")}
          >{label}</button>
        ))}
      </div>

      {/* Main nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`,
        padding: "0 40px", display: "flex", alignItems: "center", gap: 36, height: 68,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 16, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLAUZE</span>
        </Link>
        {[["dashboard", "Dashboard"], ["pricing", "Pricing"]].map(([href, label]) => (
          <Link key={href} href={`/${href}`} style={{
            fontSize: 14, fontFamily: R.fontSans, fontWeight: 500, color: R.textDark,
            padding: "4px 0", textDecoration: "none", borderBottom: "2px solid transparent",
          }}>{label}</Link>
        ))}
        <div style={{ flex: 1 }} />
        <PillBtn onClick={() => router.push("/dashboard")} variant="filled">Get started</PillBtn>
      </nav>

      {/* Hero */}
      <div
        onMouseMove={e => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
        style={{
          position: "relative", minHeight: "90vh", background: R.bgDark,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", overflow: "hidden", textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, zIndex: 0 }}>
          <GridSVG gridOffX={gridOffX} gridOffY={gridOffY} color="rgba(255,255,255,0.6)" />
        </div>
        <motion.div style={{ position: "absolute", inset: 0, opacity: 0.35, maskImage, WebkitMaskImage: maskImage, zIndex: 0 }}>
          <GridSVG gridOffX={gridOffX} gridOffY={gridOffY} color="rgba(255,255,255,0.6)" />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", right: "-10%", top: "-10%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(0,194,181,0.12)", filter: "blur(100px)" }} />
          <div style={{ position: "absolute", left: "-10%", bottom: "-10%", width: "35%", height: "35%", borderRadius: "50%", background: "rgba(0,133,124,0.15)", filter: "blur(120px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, maxWidth: 760, padding: "80px 32px" }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Eyebrow dark>AI CONTRACT REVIEW</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: R.fontSans, fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: R.textWhite, margin: "0 0 20px" }}
          >
            One Review.<br />
            <span style={{ color: R.tealBright }}>Total Confidence.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 18, color: R.textOffWhite, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px", fontFamily: R.fontSans }}
          >
            Upload your Korean contract. Get risk analysis in 30 seconds — in Korean and English.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <PillBtn onClick={() => router.push("/dashboard")} variant="filled" dark>Get started</PillBtn>
            <PillBtn onClick={() => router.push("/review/demo")} variant="outline" dark>See a demo</PillBtn>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 64 }}
          >
            {[{ n: "1,200+", l: "Contracts Reviewed" }, { n: "28s", l: "Average Review Time" }, { n: "98%", l: "Risk Detection Rate" }].map(({ n, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: R.textWhite, fontFamily: R.fontMono, letterSpacing: "-0.04em" }}>{n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, fontFamily: R.fontSans }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* What we do */}
      <div style={{ background: R.bgWhite, padding: "96px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 style={{ fontFamily: R.fontSans, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0 }}>
              Comprehensive contract review for freelancers and businesses
            </h2>
          </div>
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 16, color: R.textMid, lineHeight: 1.8, marginBottom: 20, fontFamily: R.fontSans }}>
              Clauze provides AI-powered Korean contract analysis for anyone who needs to understand what they&apos;re signing — from foreign freelancers to small business owners without a legal team.
            </p>
            <p style={{ fontSize: 16, color: R.textMid, lineHeight: 1.8, fontFamily: R.fontSans }}>
              Our AI identifies risky clauses, provides Korean and English summaries, and gives you actionable guidance — all in under 30 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* How it works — dark */}
      <div style={{ background: R.bgDark, padding: "96px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <Eyebrow dark>How it works</Eyebrow>
            <h2 style={{ fontFamily: R.fontSans, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800, color: R.textWhite, letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 32px" }}>
              Sign smarter, one clause at a time
            </h2>
            <PillBtn onClick={() => router.push("/dashboard")} variant="outline" dark>Get started</PillBtn>
          </div>
          <div style={{ borderTop: `1px solid ${R.borderDark}` }}>
            {[
              { title: "Upload your PDF", desc: "Drag and drop any Korean contract. Up to 10MB. No account needed to try." },
              { title: "AI analysis in 30 seconds", desc: "Claude AI reads every clause, identifies risks, and classifies them by severity." },
              { title: "Review in Korean & English", desc: "Each risky clause is explained in both languages with a recommended action." },
            ].map(({ title, desc }) => (
              <AccordionItem key={title} title={title} desc={desc} dark />
            ))}
          </div>
        </div>
      </div>

      {/* Who we serve */}
      <div style={{ background: R.bgWhite, padding: "96px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Eyebrow>Who we serve</Eyebrow>
            <h2 style={{ fontFamily: R.fontSans, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", lineHeight: 1.2, maxWidth: 540, margin: "0 auto" }}>
              Contract clarity for everyone in Korea
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { title: "Foreign freelancers", desc: "Navigate Korean contracts with confidence, even without Korean language skills.", link: "Freelancer solutions" },
              { title: "Small businesses", desc: "Protect your business from unfair clauses without the cost of a legal retainer.", link: "Business solutions" },
              { title: "Contractors & doers", desc: "Quick on-demand contract review before you sign any service agreement.", link: "Quick review" },
            ].map(({ title, desc, link }) => (
              <div key={title} style={{ background: R.bgLight, padding: "36px 28px", borderRadius: R.cardRadius, display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ fontFamily: R.fontSans, fontSize: 20, fontWeight: 800, color: R.textDark, letterSpacing: "-0.02em", margin: 0 }}>{title}</h3>
                <p style={{ fontSize: 14, color: R.textMid, lineHeight: 1.7, margin: 0, flex: 1, fontFamily: R.fontSans }}>{desc}</p>
                <button
                  onClick={() => router.push("/dashboard")}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontFamily: R.fontSans, fontSize: 14, fontWeight: 600, color: R.textDark,
                    borderBottom: `1.5px solid ${R.textDark}`, paddingBottom: 2, width: "fit-content",
                    transition: "opacity 0.15s",
                  }}
                >{link}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert guidance split */}
      <div style={{ background: R.bgLight, overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 480 }}>
          <div style={{ background: R.bgDark, display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: R.fontMono, fontSize: 13, color: R.tealBright, letterSpacing: "0.1em", marginBottom: 8 }}>CONTRACT ANALYSIS</div>
              <div style={{ fontFamily: R.fontMono, fontSize: 72, fontWeight: 800, color: R.textWhite, letterSpacing: "-0.04em", lineHeight: 1 }}>30s</div>
            </div>
          </div>
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Eyebrow>Expert guidance</Eyebrow>
            <h2 style={{ fontFamily: R.fontSans, fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 20px" }}>
              Meet your AI contract advisor
            </h2>
            <p style={{ fontSize: 15, color: R.textMid, lineHeight: 1.8, margin: "0 0 28px", fontFamily: R.fontSans }}>
              Powered by Claude AI, Clauze understands Korean legal language and identifies the clauses that put you at risk.
            </p>
            <button
              onClick={() => router.push("/review/demo")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: R.fontSans, fontSize: 14, fontWeight: 600, color: R.textDark, borderBottom: `1.5px solid ${R.textDark}`, paddingBottom: 2, width: "fit-content" }}
            >See a sample review</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: R.bgDark, padding: "64px 40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textWhite, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>CLAUZE</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 260, fontFamily: R.fontSans }}>AI-powered Korean contract review for freelancers and businesses.</p>
            </div>
            {[
              { title: "PRODUCT", items: ["Dashboard", "Contract Review", "Pricing"] },
              { title: "COMPANY", items: ["About", "Blog", "Contact"] },
              { title: "LEGAL", items: ["Privacy Policy", "Terms of Service", "Disclaimer"] },
            ].map(({ title, items }) => (
              <div key={title}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: R.tealBright, marginBottom: 16, textTransform: "uppercase", fontFamily: R.fontSans }}>{title}</div>
                {items.map(item => (
                  <div key={item} style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 10, cursor: "pointer", fontFamily: R.fontSans }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${R.borderDark}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: R.fontSans }}>© 2026 Clauze. All rights reserved.</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", maxWidth: 480, textAlign: "right", fontFamily: R.fontSans }}>
              본 서비스는 법적 조언을 제공하지 않습니다. AI 분석 결과는 참고용이며 중요한 계약은 법률 전문가와 상담하세요.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
