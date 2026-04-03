// src/components/ClauseCard.tsx
"use client";

import { useState } from "react";
import { ClauseResult } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { NegotiationEmailModal } from "@/components/contract/NegotiationEmailModal";

interface ClauseCardProps {
  clause: ClauseResult;
  index: number;
  lang?: "ko" | "en";
  contractFileName?: string; // 이메일 생성에 필요한 계약서 파일명
  userId?: string;           // 이메일 생성 API 인증에 필요
}

const borderColors = {
  high:   "#D94F3D",
  medium: "#E59A1A",
  low:    "#1A9E6A",
};

export function ClauseCard({ clause, index, lang = "ko", contractFileName = "", userId }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(clause.risk === "high");
  const [hovered, setHovered] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // 고위험/주의 조항만 이메일 생성 버튼 표시
  const showEmailBtn = clause.risk === "high" || clause.risk === "medium";

  return (
    <>
      <div
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#FFFFFF",
          borderLeft: `3px solid ${borderColors[clause.risk]}`,
          borderRadius: "0 4px 4px 0",
          padding: "16px 20px",
          cursor: "pointer",
          transition: "box-shadow 0.15s",
          boxShadow: hovered ? "0 2px 12px rgba(4,34,40,0.08)" : "none",
          animationDelay: `${index * 70}ms`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: expanded ? 12 : 0 }}>
          <span style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 700,
            color: "#042228",
            letterSpacing: "-0.01em",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {clause.title}
          </span>
          <RiskBadge level={clause.risk} />
          <span style={{ fontSize: 12, color: "#7A9A9E", marginLeft: 4 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>

        {expanded && (
          <div style={{ overflow: "hidden" }}>
            <p style={{
              fontSize: 13,
              color: "#3D5A5E",
              lineHeight: 1.7,
              marginBottom: clause.action ? 12 : 0,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {lang === "ko" ? clause.content_ko : clause.content_en}
            </p>
            {(lang === "ko" ? clause.action : (clause.action_en ?? clause.action)) && (
              <div style={{
                padding: "10px 16px",
                background: "rgba(0,133,124,0.06)",
                border: "1px solid rgba(0,133,124,0.2)",
                borderRadius: 4,
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: showEmailBtn ? 12 : 0,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#00857C", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
                  {lang === "ko" ? "권고사항" : "Recommendation"}
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#00857C", margin: 0, lineHeight: 1.6 }}>
                  {lang === "ko" ? clause.action : (clause.action_en ?? clause.action)}
                </p>
              </div>
            )}

            {/* 협상 이메일 생성 버튼 (고위험/주의 조항만 표시) */}
            {showEmailBtn && (
              <div
                onClick={e => e.stopPropagation()} // 카드 토글 이벤트 차단
                style={{ display: "flex", justifyContent: "flex-end", marginTop: clause.action ? 0 : 12 }}
              >
                <button
                  onClick={() => setEmailModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: "none",
                    border: `1px solid ${clause.risk === "high" ? "rgba(217,79,61,0.3)" : "rgba(229,154,26,0.3)"}`,
                    borderRadius: "28px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: clause.risk === "high" ? "#D94F3D" : "#C07800",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = clause.risk === "high"
                      ? "rgba(217,79,61,0.06)"
                      : "rgba(229,154,26,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  {/* 이메일 아이콘 */}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <rect x="0.75" y="2.75" width="11.5" height="7.5" rx="1.25" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M0.75 4.5L6.5 7.5l5.75-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {lang === "ko" ? "협상 이메일 생성 →" : "Generate Email →"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 협상 이메일 모달 */}
      <NegotiationEmailModal
        clause={clause}
        contractFileName={contractFileName}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        userId={userId}
      />
    </>
  );
}
