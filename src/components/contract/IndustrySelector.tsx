// src/components/contract/IndustrySelector.tsx
// 업종 선택 UI — PDF 업로드 전 업종을 선택해 Claude 분석을 최적화

"use client";

import { useState } from "react";
import { INDUSTRY_PROFILES, IndustryKey } from "@/lib/industry-profiles";

const R = {
  bgWhite: "#FFFFFF",
  bgLight: "#F6F7FB",
  tealBright: "#00C2B5",
  tealMid: "#00A599",
  tealDark: "#00857C",
  textDark: "#042228",
  textMid: "#3D5A5E",
  textLight: "#7A9A9E",
  borderLight: "rgba(4,34,40,0.1)",
  success: "#1A9E6A",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  cardRadius: "4px",
  btnRadius: "28px",
};

// 업종 순서 고정
const INDUSTRY_KEYS = Object.keys(INDUSTRY_PROFILES) as IndustryKey[];

interface IndustrySelectorProps {
  selected: IndustryKey;
  onChange: (key: IndustryKey) => void;
  lang?: "ko" | "en";
}

export function IndustrySelector({ selected, onChange, lang = "ko" }: IndustrySelectorProps) {
  const [hoveredKey, setHoveredKey] = useState<IndustryKey | null>(null);

  const profile = INDUSTRY_PROFILES[selected];
  const isNonGeneral = selected !== "general";

  return (
    <div style={{
      background: R.bgWhite,
      border: `1px solid ${R.borderLight}`,
      borderRadius: R.cardRadius,
      padding: "20px 24px",
      marginBottom: 16,
    }}>
      {/* ── 섹션 제목 ── */}
      <div style={{ marginBottom: 14 }}>
        <p style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: R.tealMid,
          fontFamily: R.fontSans,
          marginBottom: 4,
        }}>
          {lang === "ko" ? "계약서 유형" : "Contract Type"}
        </p>
        <p style={{
          margin: 0,
          fontSize: 13,
          color: R.textLight,
          fontFamily: R.fontSans,
        }}>
          {lang === "ko"
            ? "선택하면 해당 업종에 최적화된 분석이 적용됩니다"
            : "Select to apply industry-specific analysis"}
        </p>
      </div>

      {/* ── 업종 버튼 그리드 ── */}
      <div style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: isNonGeneral ? 16 : 0,
      }}>
        {INDUSTRY_KEYS.map(key => {
          const p = INDUSTRY_PROFILES[key];
          const isSelected = selected === key;
          const isHovered = hoveredKey === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 16px",
                background: isSelected
                  ? "rgba(0,165,153,0.08)"
                  : isHovered
                    ? R.bgLight
                    : R.bgWhite,
                border: `1.5px solid ${isSelected ? R.tealMid : R.borderLight}`,
                borderRadius: R.btnRadius,
                cursor: "pointer",
                transition: "all 0.15s",
                outline: "none",
              }}
            >
              {/* 이모지 아이콘 */}
              <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden="true">
                {p.icon}
              </span>
              {/* 레이블 */}
              <span style={{
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? R.tealDark : R.textMid,
                fontFamily: R.fontSans,
                whiteSpace: "nowrap",
              }}>
                {lang === "ko" ? p.label : p.labelEn}
              </span>
              {/* 선택 체크 */}
              {isSelected && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="6" fill={R.tealMid} />
                  <path d="M3.5 6.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 선택된 업종 확인 메시지 + 중점 항목 (general 제외) ── */}
      {isNonGeneral && (
        <div style={{
          background: "rgba(0,165,153,0.05)",
          border: `1px solid rgba(0,165,153,0.18)`,
          borderRadius: R.cardRadius,
          padding: "12px 16px",
        }}>
          {/* 확인 메시지 */}
          <p style={{
            margin: "0 0 10px",
            fontSize: 12,
            fontWeight: 700,
            color: R.tealDark,
            fontFamily: R.fontSans,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6.25" stroke={R.tealMid} strokeWidth="1.5" />
              <path d="M4.5 7l2 2 3.5-3.5" stroke={R.tealMid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {lang === "ko"
              ? `${profile.label} 계약서에 최적화된 분석이 적용됩니다`
              : `Analysis optimized for ${profile.labelEn} contracts`}
          </p>

          {/* 중점 검토 항목 태그 */}
          {profile.priorityClauses.length > 0 && (
            <div>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: R.textLight,
                fontFamily: R.fontSans,
                letterSpacing: "0.5px",
                marginRight: 8,
              }}>
                {lang === "ko" ? "중점 검토:" : "Focus areas:"}
              </span>
              <span style={{
                fontSize: 12,
                color: R.textMid,
                fontFamily: R.fontSans,
                lineHeight: 1.8,
              }}>
                {profile.priorityClauses
                  .map(c => c.split(" — ")[0]) // "조항명 — 설명" 중 앞부분만 추출
                  .join(" · ")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
