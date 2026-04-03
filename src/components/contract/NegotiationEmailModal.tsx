// src/components/contract/NegotiationEmailModal.tsx
// 협상 이메일 자동 생성 모달 - 조항 클릭 시 AI가 한/영 수정 요청 이메일 작성

"use client";

import { useState, useEffect, useCallback } from "react";
import { ClauseResult } from "@/lib/types";

const R = {
  bgWhite: "#FFFFFF",
  bgLight: "#F6F7FB",
  bgDark: "#093944",
  tealBright: "#00C2B5",
  tealMid: "#00A599",
  tealDark: "#00857C",
  textDark: "#042228",
  textMid: "#3D5A5E",
  textLight: "#7A9A9E",
  borderLight: "rgba(4,34,40,0.1)",
  warning: "#E59A1A",
  danger: "#D94F3D",
  btnRadius: "28px",
  cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

interface NegotiationEmailModalProps {
  clause: ClauseResult;
  contractFileName: string;
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

// 로딩 스피너 (keyframe 애니메이션 포함)
function Spinner() {
  return (
    <>
      <style>{`@keyframes clauze-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: `3px solid rgba(0,165,153,0.2)`,
        borderTopColor: R.tealMid,
        animation: "clauze-spin 0.7s linear infinite",
        flexShrink: 0,
      }} />
    </>
  );
}

// 복사 완료 아이콘
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3 3 6-6" stroke={R.tealMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 클립보드 아이콘
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Gmail 아이콘
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function NegotiationEmailModal({
  clause,
  contractFileName,
  isOpen,
  onClose,
  userId,
}: NegotiationEmailModalProps) {
  const [tab, setTab] = useState<"ko" | "en">("ko");
  const [loading, setLoading] = useState(false);
  const [emailKo, setEmailKo] = useState("");
  const [emailEn, setEmailEn] = useState("");
  const [copied, setCopied] = useState(false);

  // 모달 열릴 때 이메일 생성 API 호출
  const fetchEmail = useCallback(async () => {
    setLoading(true);
    setEmailKo("");
    setEmailEn("");

    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clause, contractFileName, userId }),
      });

      if (!res.ok) throw new Error("API 오류");

      const data = await res.json() as { email_ko: string; email_en: string };
      setEmailKo(data.email_ko ?? "");
      setEmailEn(data.email_en ?? "");
    } catch {
      // API 실패 시 클라이언트 폴백 템플릿 표시 (에러 노출 없음)
      setEmailKo(
        `안녕하세요.\n\n계약서 검토 중 ${clause.title} 조항에 대해 수정을 요청드리고자 합니다.\n\n${clause.content_ko}\n\n${clause.action ? `요청사항: ${clause.action}` : "해당 조항의 수정안을 제안해 주시기 바랍니다."}\n\n이 점 검토하여 수정안을 보내주시면 감사하겠습니다.\n\n감사합니다.`
      );
      setEmailEn(
        `Dear [Name],\n\nI am writing regarding ${clause.title} in our contract.\n\n${clause.content_en}\n\n${clause.action_en ?? clause.action ?? "I would like to request a revision to this clause."}\n\nPlease review and send a revised version at your earliest convenience.\n\nBest regards,\n[Your Name]`
      );
    } finally {
      setLoading(false);
    }
  }, [clause, contractFileName, userId]);

  useEffect(() => {
    if (isOpen) {
      setTab("ko");
      setCopied(false);
      fetchEmail();
    }
  }, [isOpen, fetchEmail]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentEmail = tab === "ko" ? emailKo : emailEn;
  const setCurrentEmail = tab === "ko" ? setEmailKo : setEmailEn;

  // 클립보드 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 환경 무시
    }
  };

  // Gmail mailto 링크로 열기
  const handleGmail = () => {
    const subject = encodeURIComponent(`계약서 조항 수정 요청 — ${clause.title}`);
    const body = encodeURIComponent(currentEmail);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  // 위험도에 따른 강조 색상
  const accentColor = clause.risk === "high" ? R.danger : R.warning;

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(4,34,40,0.55)",
          backdropFilter: "blur(2px)",
          zIndex: 900,
        }}
        aria-hidden="true"
      />

      {/* 모달 컨테이너 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`협상 이메일 생성 — ${clause.title}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 901,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          pointerEvents: "none",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: R.bgWhite,
            borderRadius: 8,
            width: "100%",
            maxWidth: 560,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 24px 64px rgba(4,34,40,0.22)",
            pointerEvents: "auto",
            overflow: "hidden",
          }}
        >
          {/* ── 헤더 ── */}
          <div style={{
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${R.borderLight}`,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}>
            {/* 위험도 색상 인디케이터 */}
            <div style={{
              width: 4,
              height: 40,
              borderRadius: 2,
              background: accentColor,
              flexShrink: 0,
              marginTop: 2,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: R.textLight,
                fontFamily: R.fontSans,
                marginBottom: 4,
              }}>
                협상 이메일 생성
              </p>
              <h2 style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: R.textDark,
                fontFamily: R.fontSans,
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {clause.title}
              </h2>
            </div>
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              aria-label="모달 닫기"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: R.textLight,
                padding: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = R.textDark)}
              onMouseLeave={e => (e.currentTarget.style.color = R.textLight)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ── 탭 ── */}
          <div style={{
            display: "flex",
            gap: 0,
            borderBottom: `1px solid ${R.borderLight}`,
            padding: "0 24px",
          }}>
            {(["ko", "en"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: tab === t ? `2px solid ${R.tealMid}` : "2px solid transparent",
                  cursor: "pointer",
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? R.textDark : R.textLight,
                  fontFamily: R.fontSans,
                  transition: "all 0.15s",
                  marginBottom: -1, // 탭과 border 겹침 제거
                }}
              >
                {t === "ko" ? "한국어" : "English"}
              </button>
            ))}
          </div>

          {/* ── 본문 ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {loading ? (
              // 로딩 상태
              <div style={{
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}>
                <Spinner />
                <p style={{
                  fontSize: 13,
                  color: R.textLight,
                  fontFamily: R.fontSans,
                  margin: 0,
                }}>
                  AI가 이메일을 작성중입니다...
                </p>
              </div>
            ) : (
              // 이메일 텍스트 편집 영역
              <textarea
                value={currentEmail}
                onChange={e => setCurrentEmail(e.target.value)}
                spellCheck={false}
                style={{
                  width: "100%",
                  minHeight: 260,
                  resize: "vertical",
                  border: `1px solid ${R.borderLight}`,
                  borderRadius: R.cardRadius,
                  padding: "14px 16px",
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: R.textMid,
                  fontFamily: R.fontSans,
                  background: R.bgLight,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = R.tealMid)}
                onBlur={e => (e.currentTarget.style.borderColor = R.borderLight)}
              />
            )}
          </div>

          {/* ── 하단 버튼 ── */}
          <div style={{
            padding: "16px 24px",
            borderTop: `1px solid ${R.borderLight}`,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}>
            {/* 클립보드 복사 */}
            <button
              onClick={handleCopy}
              disabled={loading || !currentEmail}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: copied ? "rgba(0,165,153,0.08)" : R.bgLight,
                border: `1px solid ${copied ? R.tealMid : R.borderLight}`,
                borderRadius: R.btnRadius,
                fontSize: 13,
                fontWeight: 600,
                color: copied ? R.tealMid : R.textMid,
                fontFamily: R.fontSans,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "복사됨" : "클립보드 복사"}
            </button>

            {/* Gmail로 열기 */}
            <button
              onClick={handleGmail}
              disabled={loading || !currentEmail}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: R.bgDark,
                border: `1px solid ${R.bgDark}`,
                borderRadius: R.btnRadius,
                fontSize: 13,
                fontWeight: 600,
                color: R.tealBright,
                fontFamily: R.fontSans,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
            >
              <MailIcon />
              Gmail로 열기
            </button>

            <div style={{ flex: 1 }} />

            {/* 닫기 */}
            <button
              onClick={onClose}
              style={{
                padding: "9px 18px",
                background: "none",
                border: `1px solid ${R.borderLight}`,
                borderRadius: R.btnRadius,
                fontSize: 13,
                fontWeight: 600,
                color: R.textLight,
                fontFamily: R.fontSans,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = R.textLight;
                e.currentTarget.style.color = R.textMid;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = R.borderLight;
                e.currentTarget.style.color = R.textLight;
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
