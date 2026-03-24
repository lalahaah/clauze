// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  // 이미 로그인되어 있으면 대시보드로 리다이렉트
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google 인증 실패");
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "로그인 실패";
      if (errMsg.includes("user-not-found")) {
        setError("계정을 찾을 수 없습니다.");
      } else if (errMsg.includes("wrong-password")) {
        setError("비밀번호가 잘못되었습니다.");
      } else {
        setError(errMsg);
      }
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "가입 실패";
      if (errMsg.includes("email-already-in-use")) {
        setError("이미 사용 중인 이메일입니다.");
      } else if (errMsg.includes("invalid-email")) {
        setError("유효하지 않은 이메일 형식입니다.");
      } else {
        setError(errMsg);
      }
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: R.bgLight, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: R.fontSans }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: R.tealMid }}>로딩 중...</div>
        </div>
      </div>
    );
  }

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
          <div style={{ opacity: isSignUp ? 0.4 : 1, transition: "opacity 0.3s", pointerEvents: isSignUp ? "none" : "auto" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: "0 0 14px" }}>Account</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
              Sign in
            </h2>
            <p style={{ fontSize: 14, color: R.textMid, margin: "0 0 32px" }}>
              이미 계정이 있으신가요?
            </p>

            <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, padding: "32px", border: `2px solid ${!isSignUp ? R.tealMid : "transparent"}`, transition: "all 0.3s" }}>
              <form onSubmit={handleEmailSignIn} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <input
                  type="email" placeholder="이메일"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${R.borderLight}`, borderRadius: 4, fontSize: 13, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                  disabled={isLoading}
                />
                <input
                  type="password" placeholder="비밀번호"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${R.borderLight}`, borderRadius: 4, fontSize: 13, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%", padding: "10px 14px", background: isLoading ? "rgba(0,165,153,0.5)" : R.tealBtn, color: R.textWhite,
                    border: "none", borderRadius: R.btnRadius, fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: R.borderLight }} />
                <span style={{ fontSize: 12, color: R.textLight }}>또는</span>
                <div style={{ flex: 1, height: 1, background: R.borderLight }} />
              </div>

              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "10px 14px", background: "transparent", color: R.textDark,
                  border: `1px solid ${R.borderLight}`, borderRadius: R.btnRadius,
                  fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.15s", opacity: isLoading ? 0.6 : 1,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google으로 로그인
              </button>

              {error && !isSignUp && (
                <div style={{ background: "rgba(217,79,61,0.1)", border: `1px solid ${R.danger}`, borderRadius: R.btnRadius, padding: "10px 14px", marginTop: 16 }}>
                  <p style={{ fontSize: 12, color: R.danger, margin: 0, fontFamily: R.fontSans }}>{error}</p>
                </div>
              )}

              <button
                onClick={() => { setIsSignUp(true); setError(""); setEmail(""); setPassword(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: R.tealMid, fontFamily: R.fontSans, marginTop: 14, fontWeight: 600 }}
              >
                계정이 없으신가요? <u>가입하기</u>
              </button>
            </div>
          </div>

          {/* Get started (오른쪽) */}
          <div style={{ opacity: !isSignUp ? 0.4 : 1, transition: "opacity 0.3s", pointerEvents: !isSignUp ? "none" : "auto" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: R.tealMid, margin: "0 0 14px" }}>Account</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: R.textDark, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
              Get started
            </h2>
            <p style={{ fontSize: 14, color: R.textMid, margin: "0 0 32px" }}>
              무료로 시작해보세요.
            </p>

            <div style={{ background: R.bgWhite, borderRadius: R.cardRadius, padding: "32px", border: `2px solid ${isSignUp ? R.tealMid : "transparent"}`, transition: "all 0.3s" }}>
              <form onSubmit={handleEmailSignUp} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <input
                  type="email" placeholder="이메일"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${R.borderLight}`, borderRadius: 4, fontSize: 13, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                  disabled={isLoading}
                />
                <input
                  type="password" placeholder="비밀번호 (6자 이상)"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${R.borderLight}`, borderRadius: 4, fontSize: 13, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%", padding: "10px 14px", background: isLoading ? "rgba(0,165,153,0.5)" : R.tealBtn, color: R.textWhite,
                    border: "none", borderRadius: R.btnRadius, fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {isLoading ? "가입 중..." : "이메일로 가입"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: R.borderLight }} />
                <span style={{ fontSize: 12, color: R.textLight }}>또는</span>
                <div style={{ flex: 1, height: 1, background: R.borderLight }} />
              </div>

              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "10px 14px", background: R.tealBtn, color: R.textWhite,
                  border: `1px solid ${R.tealBtn}`, borderRadius: R.btnRadius,
                  fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.15s", opacity: isLoading ? 0.6 : 1,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.p 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google으로 가입
              </button>

              {error && isSignUp && (
                <div style={{ background: "rgba(217,79,61,0.1)", border: `1px solid ${R.danger}`, borderRadius: R.btnRadius, padding: "10px 14px", marginTop: 16 }}>
                  <p style={{ fontSize: 12, color: R.danger, margin: 0, fontFamily: R.fontSans }}>{error}</p>
                </div>
              )}

              <button
                onClick={() => { setIsSignUp(false); setError(""); setEmail(""); setPassword(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: R.tealMid, fontFamily: R.fontSans, marginTop: 14, fontWeight: 600 }}
              >
                이미 계정이 있으신가요? <u>로그인하기</u>
              </button>
            </div>
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
