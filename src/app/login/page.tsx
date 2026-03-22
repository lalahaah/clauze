// src/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", borderLight: "rgba(4,34,40,0.1)",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: R.bgLight, display: "flex", flexDirection: "column", fontFamily: R.fontSans }}>
      {/* Utility bar */}
      <div style={{ background: R.bgDark, padding: "6px 40px", display: "flex", justifyContent: "flex-end", gap: 24 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "rgba(255,255,255,0.7)", fontFamily: R.fontSans, textTransform: "uppercase" }}>GET SUPPORT</button>
      </div>

      {/* Nav */}
      <nav style={{ background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`, padding: "0 40px", display: "flex", alignItems: "center", height: 68 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLAUZE</span>
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: "0 0 14px" }}>Account</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
            {isSignup ? "Create account" : "Sign in"}
          </h1>
          <p style={{ fontSize: 15, color: R.textMid, margin: "0 0 36px" }}>
            {isSignup ? "Start reviewing contracts for free." : "Welcome back."}
          </p>

          <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, padding: "36px" }}>
            {/* Google */}
            <button style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "13px 28px", background: "transparent", color: R.textDark,
              border: `1.5px solid ${R.borderLight}`, borderRadius: R.btnRadius,
              fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer",
              marginBottom: 24, transition: "all 0.15s",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: R.borderLight }} />
              <span style={{ fontSize: 12, color: R.textLight }}>or</span>
              <div style={{ flex: 1, height: 1, background: R.borderLight }} />
            </div>

            <form onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email" placeholder="Email address"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${R.borderLight}`, borderRadius: 4, fontSize: 14, color: R.textDark, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                required
              />
              <input
                type="password" placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${R.borderLight}`, borderRadius: 4, fontSize: 14, color: R.textDark, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                required
              />
              <button
                type="submit"
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{ width: "100%", padding: "13px 28px", background: hov ? R.tealDark : R.tealBtn, color: R.textWhite, border: "none", borderRadius: R.btnRadius, fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer", transition: "all 0.2s", marginTop: 4 }}
              >
                {isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <p style={{ fontSize: 13, textAlign: "center", color: R.textLight, margin: "20px 0 0" }}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignup(!isSignup)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: R.tealDark, fontFamily: R.fontSans, padding: 0 }}>
                {isSignup ? "Sign in" : "Sign up free"}
              </button>
            </p>
          </div>

          <p style={{ fontSize: 11, color: R.textLight, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            By continuing, you agree to our <Link href="#" style={{ color: R.textLight }}>Terms</Link> and <Link href="#" style={{ color: R.textLight }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
