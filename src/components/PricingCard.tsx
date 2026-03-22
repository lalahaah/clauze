// src/components/PricingCard.tsx
"use client";

import { useState } from "react";
import { UserPlan } from "@/lib/types";

interface PricingCardProps {
  plan: UserPlan | "free";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  lockedFeatures?: string[];
  cta: string;
  featured?: boolean;
  onSelect: () => void;
}

export function PricingCard({
  name, price, period, description, features, lockedFeatures = [], cta, featured = false, onSelect,
}: PricingCardProps) {
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{
        background: featured ? "#093944" : "#FFFFFF",
        borderRadius: 4,
        padding: "36px 28px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        borderTop: `3px solid ${featured ? "#00C2B5" : "rgba(4,34,40,0.1)"}`,
        boxShadow: featured ? "0 8px 40px rgba(9,57,68,0.25)" : "none",
      }}
    >
      {featured && (
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
          color: "#00C2B5", textTransform: "uppercase", marginBottom: 4,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Most Popular
        </div>
      )}

      <div style={{ fontSize: 18, fontWeight: 800, color: featured ? "#FFFFFF" : "#042228", letterSpacing: "-0.02em", fontFamily: "'DM Sans', sans-serif" }}>
        {name}
      </div>
      <div style={{ fontSize: 12, color: featured ? "rgba(255,255,255,0.85)" : "#7A9A9E", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
        {description}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
        <span style={{ fontSize: 38, fontWeight: 800, color: featured ? "#FFFFFF" : "#042228", letterSpacing: "-0.04em", fontFamily: "'DM Mono', monospace" }}>
          {price}
        </span>
        <span style={{ fontSize: 14, color: featured ? "rgba(255,255,255,0.85)" : "#7A9A9E", fontFamily: "'DM Sans', sans-serif" }}>
          {period}
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {features.map(f => (
          <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: featured ? "rgba(255,255,255,0.85)" : "#3D5A5E", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ color: featured ? "#00C2B5" : "#00A599", fontWeight: 700, flexShrink: 0 }}>✓</span>
            {f}
          </div>
        ))}
        {lockedFeatures.map(f => (
          <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: featured ? "rgba(255,255,255,0.3)" : "#7A9A9E", textDecoration: "line-through", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ flexShrink: 0 }}>✕</span>
            {f}
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: "100%", padding: "13px 28px",
          background: featured ? (hov ? "#00857C" : "#00C2B5") : (hov ? "rgba(4,34,40,0.06)" : "transparent"),
          color: featured ? "#FFFFFF" : "#042228",
          border: featured ? "1.5px solid #00C2B5" : "1.5px solid #042228",
          borderRadius: 28,
          fontSize: 14, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {cta}
      </button>
    </div>
  );
}
