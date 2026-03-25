// src/components/ReviewResult.tsx
"use client";

import { Review } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { ClauseCard } from "./ClauseCard";

interface ReviewResultProps {
  review: Review;
  lang?: "ko" | "en";
}

export function ReviewResult({ review, lang = "ko" }: ReviewResultProps) {
  const highCount = review.result.clauses.filter(c => c.risk === "high").length;
  const mediumCount = review.result.clauses.filter(c => c.risk === "medium").length;
  const lowCount = review.result.clauses.filter(c => c.risk === "low").length;
  const time = review.processingTime ? `${Math.round(review.processingTime / 1000)}s` : "-";

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Left panel */}
      <aside style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Risk summary */}
        <div style={{
          background: "#FFFFFF", padding: "24px", borderRadius: 4,
          borderTop: "3px solid #D94F3D",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
            color: "#7A9A9E", marginBottom: 14, textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}>{lang === "ko" ? "위험 요약" : "Risk Summary"}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { n: highCount,   l: "고위험", c: "#D94F3D", bg: "rgba(217,79,61,0.08)" },
              { n: mediumCount, l: "주의",   c: "#E59A1A", bg: "rgba(229,154,26,0.08)" },
              { n: lowCount,    l: "정상",   c: "#1A9E6A", bg: "rgba(26,158,106,0.08)" },
            ].map(({ n, l, c, bg }) => (
              <div key={l} style={{ flex: 1, background: bg, borderRadius: 4, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: c, letterSpacing: "-0.04em", fontFamily: "'DM Mono', monospace" }}>{n}</div>
                <div style={{ fontSize: 10, color: c, fontWeight: 700, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* File info */}
        <div style={{ background: "#FFFFFF", padding: "20px 24px", borderRadius: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#7A9A9E", marginBottom: 8, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
            {lang === "ko" ? "파일" : "File"}
          </div>
          <p style={{ fontSize: 13, color: "#3D5A5E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }} title={review.fileName}>{review.fileName}</p>
          <p style={{ fontSize: 12, color: "#7A9A9E", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
            {lang === "ko" ? "분석 완료" : "Analyzed"} {time}
          </p>
        </div>

        {/* Bilingual summary */}
        <div style={{ background: "#FFFFFF", padding: "20px 24px", borderRadius: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#00A599", marginBottom: 12, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Summary</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7A9A9E", marginBottom: 6, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>한국어</div>
            <p style={{ fontSize: 12, color: "#3D5A5E", lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{review.result.summary_ko}</p>
          </div>

          <div style={{ borderTop: "1px solid rgba(4,34,40,0.08)", paddingTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7A9A9E", marginBottom: 6, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>English</div>
            <p style={{ fontSize: 12, color: "#3D5A5E", lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{review.result.summary_en}</p>
          </div>
        </div>

        {/* Lawyer CTA */}
        {highCount > 0 && (
          <button style={{
            width: "100%", padding: "14px",
            background: "#00A599", color: "#FFFFFF",
            border: "none", borderRadius: 28,
            fontSize: 14, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
          }}>
            변호사 연결 상담 →
          </button>
        )}

        <p style={{
          fontSize: 11, color: "#7A9A9E",
          textAlign: "center", lineHeight: 1.6,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ※ 본 검토는 참고용이며 법적 효력이 없습니다.
        </p>
      </aside>

      {/* Clause list */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {review.result.clauses.map((clause, i) => (
          <ClauseCard key={i} clause={clause} index={i} lang={lang} />
        ))}
      </main>
    </div>
  );
}
