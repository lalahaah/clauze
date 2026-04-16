// src/app/login/verify/page.tsx
// 이메일 링크 클릭 후 자동으로 리다이렉트되는 페이지
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const R = {
  bgLight: "#F6F7FB",
  tealMid: "#00A599",
  tealBtn: "#00C2B5",
  tealDark: "#00857C",
  textDark: "#042228",
  textMid: "#3D5A5E",
  danger: "#D94F3D",
  borderLight: "rgba(4,34,40,0.1)",
  btnRadius: "28px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
};

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "need_email" | "success" | "error">("verifying");
  const [manualEmail, setManualEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      // 이메일 링크가 아닌 경우 로그인 페이지로
      router.replace("/login");
      return;
    }

    const savedEmail = window.localStorage.getItem("emailForSignIn");
    if (savedEmail) {
      completeSignIn(savedEmail);
    } else {
      // 다른 기기에서 열었을 때 이메일을 다시 입력받아야 함
      setStatus("need_email");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeSignIn = async (emailToUse: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailLink(auth, emailToUse, window.location.href);
      window.localStorage.removeItem("emailForSignIn");
      setStatus("success");
      setTimeout(() => router.replace("/dashboard"), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "로그인 실패";
      if (msg.includes("invalid-action-code") || msg.includes("expired-action-code")) {
        setError("링크가 만료되었거나 이미 사용되었습니다. 다시 로그인 링크를 요청해주세요.");
      } else if (msg.includes("invalid-email")) {
        setError("이메일이 일치하지 않습니다. 올바른 이메일을 입력해주세요.");
      } else {
        setError(msg);
      }
      setStatus("error");
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) return;
    completeSignIn(manualEmail);
  };

  return (
    <div style={{
      minHeight: "100vh", background: R.bgLight,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: R.fontSans, padding: 24,
    }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>

        {status === "verifying" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: R.textDark, margin: "0 0 8px" }}>로그인 확인 중...</h1>
            <p style={{ fontSize: 14, color: R.textMid }}>잠시만 기다려주세요.</p>
          </>
        )}

        {status === "need_email" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: R.textDark, margin: "0 0 8px" }}>이메일 확인 필요</h1>
            <p style={{ fontSize: 14, color: R.textMid, marginBottom: 28 }}>
              보안을 위해 로그인에 사용한 이메일 주소를 입력해주세요.
            </p>
            <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email"
                placeholder="example@email.com"
                value={manualEmail}
                onChange={e => setManualEmail(e.target.value)}
                style={{
                  padding: "11px 14px", border: `1px solid ${R.borderLight}`,
                  borderRadius: 4, fontSize: 13, fontFamily: R.fontSans,
                  outline: "none", width: "100%", boxSizing: "border-box" as const,
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !manualEmail}
                style={{
                  padding: "11px 14px",
                  background: isLoading ? "rgba(0,165,153,0.5)" : R.tealBtn,
                  color: "#fff", border: "none", borderRadius: R.btnRadius,
                  fontSize: 14, fontWeight: 700, fontFamily: R.fontSans,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "확인 중..." : "로그인 완료"}
              </button>
            </form>
            {error && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(217,79,61,0.1)", borderRadius: 8 }}>
                <p style={{ fontSize: 13, color: R.danger, margin: 0 }}>{error}</p>
              </div>
            )}
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: R.textDark, margin: "0 0 8px" }}>로그인 완료!</h1>
            <p style={{ fontSize: 14, color: R.textMid }}>대시보드로 이동합니다...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: R.textDark, margin: "0 0 8px" }}>링크 오류</h1>
            <p style={{ fontSize: 14, color: R.textMid, marginBottom: 8 }}>{error}</p>
            <button
              onClick={() => router.push("/login")}
              style={{
                marginTop: 16, padding: "11px 28px",
                background: R.tealBtn, color: "#fff",
                border: "none", borderRadius: R.btnRadius,
                fontSize: 14, fontWeight: 700, fontFamily: R.fontSans, cursor: "pointer",
              }}
            >
              다시 로그인하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
