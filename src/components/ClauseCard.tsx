// src/components/ClauseCard.tsx
"use client";

import { useState } from "react";
import { ClauseResult } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";

interface ClauseCardProps {
  clause: ClauseResult;
  index: number;
}

const borderColors = {
  high:   "#D94F3D",
  medium: "#E59A1A",
  low:    "#1A9E6A",
};

export function ClauseCard({ clause, index }: ClauseCardProps) {
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
            marginBottom: 8,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {clause.content_ko}
          </p>
          <p style={{
            fontSize: 12,
            color: "#7A9A9E",
            lineHeight: 1.6,
            fontStyle: "italic",
            marginBottom: clause.action ? 12 : 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {clause.content_en}
          </p>
          {clause.action && (
            <span style={{
              display: "inline-block",
              padding: "5px 14px",
              background: "rgba(0,133,124,0.08)",
              border: "1px solid rgba(0,133,124,0.2)",
              borderRadius: 28,
              fontSize: 12,
              fontWeight: 700,
              color: "#00857C",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {clause.action}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
