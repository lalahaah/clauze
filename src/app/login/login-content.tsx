// src/app/login/login-content.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", borderLight: "rgba(4,34,40,0.1)", danger: "#D94F3D",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

export default function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [isKorean, setIsKorean] = useState(true);
  const [linkSent, setLinkSent] = useState(false);

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
      let errorMsg = "Google 인증 실패";
      if (err instanceof Error) {
        if (err.message.includes("popup-closed")) {
          errorMsg = "팝업이 닫혔습니다. 다시 시도해주세요.";
        } else if (err.message.includes("cancelled")) {
          errorMsg = "인증이 취소되었습니다.";
        } else if (err.message.includes("auth/popup-blocked")) {
          errorMsg = "팝업이 차단되었습니다. 팝업 차단을 해제해주세요.";
        } else if (err.message.includes("auth/operation-not-supported")) {
          errorMsg = "이 브라우저에서는 Google 로그인이 지원되지 않습니다.";
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleSendEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(isKorean ? "이메일을 입력해주세요." : "Please enter your email.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login/verify`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // 이메일 링크 확인 페이지에서 사용하기 위해 저장
      window.localStorage.setItem("emailForSignIn", email);
      setLinkSent(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "링크 전송 실패";
      if (errMsg.includes("invalid-email")) {
        setError(isKorean ? "유효하지 않은 이메일 형식입니다." : "Invalid email format.");
      } else if (errMsg.includes("operation-not-allowed")) {
        setError(isKorean ? "이메일 링크 로그인이 활성화되지 않았습니다." : "Email link sign-in is not enabled.");
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
      {/* Main nav */}
      <nav style={{
        position: "static", zIndex: 100,
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
        {/* Language Toggle */}
        <div style={{ display: "flex", gap: 4, padding: "4px 8px", background: R.bgLight, borderRadius: "20px", marginRight: 20 }}>
          {(["ko", "en"] as const).map(l => (
            <button
              key={l}
              onClick={() => setIsKorean(l === "ko")}
              style={{
                padding: "6px 12px", borderRadius: "16px",
                background: (isKorean && l === "ko") || (!isKorean && l === "en") ? R.bgWhite : "transparent",
                border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 700, color: (isKorean && l === "ko") || (!isKorean && l === "en") ? R.textDark : R.textLight,
                fontFamily: R.fontSans, transition: "all 0.2s"
              }}
            >{l.toUpperCase()}</button>
          ))}
        </div>
        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "13px 28px",
            background: "transparent",
            color: R.textDark,
            border: `1.5px solid ${R.textDark}`,
            borderRadius: R.btnRadius,
            fontSize: 14, fontWeight: 700,
            fontFamily: R.fontSans, cursor: "pointer",
            letterSpacing: "-0.01em", transition: "all 0.2s",
            whiteSpace: "nowrap" as const,
          }}
        >Get support</button>
      </nav>

      {/* Main content - 40:60 layout */}
      <div style={{ display: "grid", gridTemplateColumns: "40% 60%", minHeight: "calc(100vh - 68px)" }}>
        {/* 좌측: 로그인 폼 (40%) */}
        <div style={{ background: R.bgLight, padding: "60px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: 350 }}>

            {linkSent ? (
              /* 링크 전송 완료 화면 */
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: R.textDark, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
                  {isKorean ? "이메일을 확인하세요" : "Check your email"}
                </h1>
                <p style={{ fontSize: 14, color: R.textMid, margin: "0 0 8px", lineHeight: 1.6 }}>
                  {isKorean
                    ? <><strong style={{ color: R.textDark }}>{email}</strong>로 로그인 링크를 전송했습니다.</>
                    : <>We sent a sign-in link to <strong style={{ color: R.textDark }}>{email}</strong>.</>
                  }
                </p>
                <p style={{ fontSize: 13, color: R.textLight, margin: "0 0 32px", lineHeight: 1.6 }}>
                  {isKorean
                    ? "이메일의 링크를 클릭하면 자동으로 로그인됩니다. 스팸함도 확인해보세요."
                    : "Click the link in the email to sign in. Check your spam folder if you don't see it."
                  }
                </p>
                <button
                  onClick={() => { setLinkSent(false); setEmail(""); setError(""); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: R.tealBtn, fontWeight: 700, fontFamily: R.fontSans,
                    textDecoration: "underline",
                  }}
                >
                  {isKorean ? "다른 이메일로 다시 시도" : "Try a different email"}
                </button>
              </div>
            ) : (
              <>
                {/* 헤더 */}
                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: R.textDark, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
                    {isKorean ? "로그인 / 가입" : "Sign in / Sign up"}
                  </h1>
                  <p style={{ fontSize: 14, color: R.textMid, margin: 0 }}>
                    {isKorean
                      ? "이메일을 입력하면 바로 로그인 링크를 보내드립니다."
                      : "Enter your email and we'll send you a sign-in link."
                    }
                  </p>
                </div>

                {/* 이메일 링크 폼 */}
                <form onSubmit={handleSendEmailLink} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: R.textDark, marginBottom: 6, letterSpacing: "0.5px" }}>
                      {isKorean ? "이메일" : "Email"}
                    </label>
                    <input
                      type="email" placeholder="example@email.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", border: `1px solid ${R.borderLight}`, borderRadius: 4, fontSize: 13, fontFamily: R.fontSans, outline: "none", boxSizing: "border-box" }}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%", padding: "11px 14px", background: isLoading ? "rgba(0,165,153,0.5)" : R.tealBtn, color: R.textWhite,
                      border: "none", borderRadius: R.btnRadius, fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoading ? "not-allowed" : "pointer",
                      transition: "all 0.2s", marginTop: 8
                    }}
                  >
                    {isLoading
                      ? (isKorean ? "전송 중..." : "Sending...")
                      : (isKorean ? "로그인 링크 받기" : "Send sign-in link")
                    }
                  </button>
                </form>

                {/* 또는 구분선 */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: R.borderLight }} />
                  <span style={{ fontSize: 12, color: R.textLight }}>{isKorean ? "또는" : "Or"}</span>
                  <div style={{ flex: 1, height: 1, background: R.borderLight }} />
                </div>

                {/* Google 버튼 */}
                <button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    padding: "11px 14px", background: "transparent", color: R.textDark,
                    border: `1px solid ${R.borderLight}`, borderRadius: R.btnRadius,
                    fontSize: 13, fontWeight: 700, fontFamily: R.fontSans, cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.15s", opacity: isLoading ? 0.6 : 1, marginBottom: 20
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.07 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isKorean ? "Google로 로그인" : "Sign in with Google"}
                </button>

                {/* 오류 메시지 */}
                {error && (
                  <div style={{ background: "rgba(217,79,61,0.1)", border: `1px solid ${R.danger}`, borderRadius: R.btnRadius, padding: "10px 14px" }}>
                    <p style={{ fontSize: 12, color: R.danger, margin: 0, fontFamily: R.fontSans }}>{error}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 우측: 서비스 소개 (60%) */}
        <div style={{ background: R.bgDark, padding: "60px 50px", display: "flex", flexDirection: "column", justifyContent: "center", color: R.textWhite }}>
          {/* 헤더 */}
          <div style={{ marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: R.tealBright, marginBottom: 12 }}>Clauze</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {isKorean
                ? "한국 계약서를 안심하고 이해하세요"
                : "Understand Korean Contracts with Confidence"
              }
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>
              {isKorean
                ? "AI가 위험한 조항을 식별하고, 한국어와 영어 동시 분석으로 모두를 보호합니다."
                : "AI identifies risky clauses and protects everyone with dual Korean-English analysis."
              }
            </p>
          </div>

          {/* What we do */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: R.tealBright, marginBottom: 8, letterSpacing: "1px", textTransform: "uppercase" }}>What we do</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.7 }}>
              {isKorean
                ? "복잡한 한국 계약서를 분석하고, 위험한 조항을 즉시 식별합니다. 30초 내에 법률 검토를 마칠 수 있습니다."
                : "We analyze complex Korean contracts and identify risky clauses instantly. Complete legal review in under 30 seconds."
              }
            </p>
          </div>

          {/* Who it's for */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: R.tealBright, marginBottom: 14, letterSpacing: "1px", textTransform: "uppercase" }}>Who it's for</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  icon: "🌍",
                  title: isKorean ? "해외 프리랜서" : "Foreign Freelancers",
                  desc: isKorean ? "한국 클라이언트의 계약서를 이해하세요" : "Understand Korean client contracts with confidence"
                },
                {
                  icon: "💼",
                  title: isKorean ? "소상공인" : "Small Businesses",
                  desc: isKorean ? "전문가 없이도 계약서를 검토하세요" : "Review contracts without expensive lawyers"
                },
                {
                  icon: "📋",
                  title: isKorean ? "용역 계약자" : "Contractors",
                  desc: isKorean ? "위험한 조항을 미리 파악하세요" : "Identify risky clauses before signing"
                },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <div style={{ fontSize: 18, minWidth: 24 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: R.textWhite }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: R.tealBright, marginBottom: 14, letterSpacing: "1px", textTransform: "uppercase" }}>Key Benefits</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(isKorean
                ? [
                    "⚡ 30초 분석 — 전문가처럼 빠르게",
                    "🌐 한/영 동시 제공 — 모두가 이해할 수 있게",
                    "🎯 즉시 대응 — 협상 포인트를 즉시 파악",
                  ]
                : [
                    "⚡ 30-second analysis — Review like an expert",
                    "🌐 Bilingual output — Everyone understands",
                    "🎯 Instant action — Know negotiation points immediately",
                  ]
              ).map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: R.bgWhite, padding: "16px 40px", textAlign: "center", borderTop: `1px solid ${R.borderLight}` }}>
        <p style={{ fontSize: 11, color: R.textLight, margin: 0, lineHeight: 1.5 }}>
          {isKorean
            ? <>계속 진행함으로써 <Link href="#" style={{ color: R.textLight }}>이용약관</Link>과 <Link href="#" style={{ color: R.textLight }}>개인정보처리방침</Link>에 동의합니다.</>
            : <>By continuing, you agree to our <Link href="#" style={{ color: R.textLight }}>Terms</Link> and <Link href="#" style={{ color: R.textLight }}>Privacy Policy</Link>.</>
          }
        </p>
      </footer>
    </div>
  );
}
