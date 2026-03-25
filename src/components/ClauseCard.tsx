// src/components/ClauseCard.tsx
"use client";

import { useState } from "react";
import { ClauseResult } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";

interface ClauseCardProps {
  clause: ClauseResult;
  index: number;
  lang?: "ko" | "en";
}

const borderColors = {
  high:   "#D94F3D",
  medium: "#E59A1A",
  low:    "#1A9E6A",
};

export function ClauseCard({ clause, index, lang = "ko" }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(clause.risk === "high");
  const [hovered, setHovered] = useState(false);

  return (
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
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#00857C", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
                {lang === "ko" ? "권고사항" : "Recommendation"}
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#00857C", margin: 0, lineHeight: 1.6 }}>
                {lang === "ko" ? clause.action : (clause.action_en ?? clause.action)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
