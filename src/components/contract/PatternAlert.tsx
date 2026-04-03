// src/components/contract/PatternAlert.tsx
// 반복 위험 패턴 경고 띠 - 이전 계약에서도 동일 조항이 문제였을 때 최상단에 표시

import { RepeatPattern } from "@/lib/types";

const R = {
  warning: "#E59A1A",
  warningBg: "#FFF8EC",
  warningBorder: "#F5C97A",
  warningText: "#7A4F00",
  warningSubtext: "#A0700A",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
  cardRadius: "4px",
};

// ISO 날짜 문자열을 "YYYY.MM.DD" 형식으로 포맷
function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

// 반복 순환 아이콘 (SVG)
function RepeatIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 1 }}
    >
      <path
        d="M3 6.5A5.5 5.5 0 0 1 13.5 4.5L15 3"
        stroke={R.warning}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 3v3.5H11.5"
        stroke={R.warning}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 11.5A5.5 5.5 0 0 1 4.5 13.5L3 15"
        stroke={R.warning}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 15v-3.5H6.5"
        stroke={R.warning}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PatternAlertProps {
  patterns: RepeatPattern[];
  lang?: "ko" | "en";
}

export function PatternAlert({ patterns, lang = "ko" }: PatternAlertProps) {
  // 패턴 없으면 렌더링 안 함
  if (!patterns || patterns.length === 0) return null;

  return (
    <div
      role="alert"
      style={{
        background: R.warningBg,
        border: `1px solid ${R.warningBorder}`,
        borderLeft: `4px solid ${R.warning}`,
        borderRadius: R.cardRadius,
        padding: "16px 20px",
        marginBottom: 24,
      }}
    >
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: patterns.length > 1 ? 12 : 0 }}>
        <RepeatIcon />
        <div>
          <p style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: R.warningText,
            fontFamily: R.fontSans,
            letterSpacing: "-0.01em",
          }}>
            {lang === "ko"
              ? `패턴 감지 — ${patterns.length}개 조항에서 반복 위험이 확인되었습니다`
              : `Pattern detected — ${patterns.length} clause${patterns.length > 1 ? "s" : ""} with repeated risk`}
          </p>
          {/* 패턴이 1개면 바로 상세 표시 */}
          {patterns.length === 1 && (
            <PatternRow pattern={patterns[0]} lang={lang} />
          )}
        </div>
      </div>

      {/* 패턴이 2개 이상이면 목록으로 표시 */}
      {patterns.length > 1 && (
        <ul style={{ margin: "0 0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {patterns.map((p, i) => (
            <li key={i}>
              <PatternRow pattern={p} lang={lang} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 패턴 1건 상세 표시 행
function PatternRow({ pattern, lang }: { pattern: RepeatPattern; lang: "ko" | "en" }) {
  const { clauseTitle, pastOccurrences, firstFoundAt, lastReviewFileName } = pattern;

  return (
    <div style={{ marginTop: 4 }}>
      <p style={{ margin: 0, fontSize: 13, color: R.warningText, fontFamily: R.fontSans, lineHeight: 1.55 }}>
        {lang === "ko" ? (
          <>
            <span style={{ fontWeight: 700, fontFamily: R.fontMono }}>&lsquo;{clauseTitle}&rsquo;</span>
            {" 조항이 이전 "}
            <span style={{ fontWeight: 700 }}>{pastOccurrences}건</span>
            {`의 계약에서도 고위험으로 분류되었습니다.`}
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700, fontFamily: R.fontMono }}>&lsquo;{clauseTitle}&rsquo;</span>
            {" appeared as high-risk in "}
            <span style={{ fontWeight: 700 }}>{pastOccurrences} previous review{pastOccurrences > 1 ? "s" : ""}</span>
            {"."}
          </>
        )}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: 12, color: R.warningSubtext, fontFamily: R.fontSans }}>
        {lang === "ko"
          ? `최초 발견: ${formatDate(firstFoundAt)} / ${lastReviewFileName}`
          : `First seen: ${formatDate(firstFoundAt)} / ${lastReviewFileName}`}
      </p>
    </div>
  );
}
