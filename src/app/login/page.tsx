// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", borderLight: "rgba(4,34,40,0.1)", danger: "#D94F3D",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
};

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, signInWithGoogle, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 이미 로그인되어 있으면 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleGoogleAuth = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setIsLoggingIn(false);
    }
  };

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
        <div style={{ width: "100%", maxWidth: 920, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          {/* Sign in (왼쪽) */}
          <div style={{ opacity: isSignUp ? 0.5 : 1, transition: "opacity 0.3s", pointerEvents: isSignUp ? "none" : "auto" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: "0 0 14px" }}>Account</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
              Sign in
            </h2>
            <p style={{ fontSize: 14, color: R.textMid, margin: "0 0 32px" }}>
              이미 계정이 있으신가요?
            </p>

            <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, padding: "32px", border: `2px solid ${isSignUp ? "transparent" : R.tealMid}`, transition: "all 0.3s" }}>
              <button
                onClick={handleGoogleAuth}
                disabled={isLoggingIn || loading}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "12px 24px", background: "transparent", color: R.textDark,
                  border: `1.5px solid ${R.borderLight}`, borderRadius: R.btnRadius,
                  fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoggingIn || loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s", opacity: isLoggingIn || loading ? 0.6 : 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoggingIn ? "로그인 중..." : "Continue with Google"}
              </button>

              {error && !isSignUp && (
                <div style={{ background: "rgba(217,79,61,0.1)", border: `1px solid ${R.danger}`, borderRadius: R.btnRadius, padding: "12px 16px", marginTop: 16 }}>
                  <p style={{ fontSize: 13, color: R.danger, margin: 0, fontFamily: R.fontSans }}>{error}</p>
                </div>
              )}

              <p style={{ fontSize: 12, textAlign: "center", color: R.textLight, margin: "16px 0 0", fontFamily: R.fontSans }}>
                Google 계정으로 로그인하세요.
              </p>
            </div>
          </div>

          {/* Get started (오른쪽) */}
          <div style={{ opacity: !isSignUp ? 0.5 : 1, transition: "opacity 0.3s", pointerEvents: !isSignUp ? "none" : "auto" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: "0 0 14px" }}>Account</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
              Get started
            </h2>
            <p style={{ fontSize: 14, color: R.textMid, margin: "0 0 32px" }}>
              무료로 시작해보세요.
            </p>

            <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, padding: "32px", border: `2px solid ${isSignUp ? R.tealMid : "transparent"}`, transition: "all 0.3s" }}>
              <button
                onClick={handleGoogleAuth}
                disabled={isLoggingIn || loading}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "12px 24px", background: isSignUp ? R.tealBtn : "transparent", color: isSignUp ? R.textWhite : R.textDark,
                  border: `1.5px solid ${isSignUp ? R.tealBtn : R.borderLight}`, borderRadius: R.btnRadius,
                  fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoggingIn || loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s", opacity: isLoggingIn || loading ? 0.6 : 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoggingIn ? "계정 생성 중..." : "Sign up with Google"}
              </button>

              {error && isSignUp && (
                <div style={{ background: "rgba(217,79,61,0.1)", border: `1px solid ${R.danger}`, borderRadius: R.btnRadius, padding: "12px 16px", marginTop: 16 }}>
                  <p style={{ fontSize: 13, color: R.danger, margin: 0, fontFamily: R.fontSans }}>{error}</p>
                </div>
              )}

              <p style={{ fontSize: 12, textAlign: "center", color: R.textLight, margin: "16px 0 0", fontFamily: R.fontSans }}>
                한번의 클릭으로 계정을 만들세요.
              </p>
            </div>
          </div>
        </div>

        {/* Tab toggle for mobile */}
        <div style={{ display: "none", position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ display: "flex", gap: 8, padding: "8px", background: R.bgWhite, borderRadius: "24px", border: `1px solid ${R.borderLight}` }}>
            <button
              onClick={() => setIsSignUp(false)}
              style={{
                padding: "8px 20px", background: !isSignUp ? R.tealBtn : "transparent", color: !isSignUp ? R.textWhite : R.textDark,
                border: "none", borderRadius: "20px", fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              style={{
                padding: "8px 20px", background: isSignUp ? R.tealBtn : "transparent", color: isSignUp ? R.textWhite : R.textDark,
                border: "none", borderRadius: "20px", fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Get started
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{ fontSize: 11, color: R.textLight, textAlign: "center", padding: "24px", lineHeight: 1.6, fontFamily: R.fontSans }}>
        By continuing, you agree to our <Link href="#" style={{ color: R.textLight }}>Terms</Link> and <Link href="#" style={{ color: R.textLight }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}
