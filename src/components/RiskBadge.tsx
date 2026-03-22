// src/components/RiskBadge.tsx
import { RiskLevel } from "@/lib/types";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const config = {
  high:   { label: "고위험", color: "#D94F3D", bg: "rgba(217,79,61,0.1)",   border: "rgba(217,79,61,0.25)" },
  medium: { label: "주의",   color: "#E59A1A", bg: "rgba(229,154,26,0.1)", border: "rgba(229,154,26,0.25)" },
  low:    { label: "정상",   color: "#1A9E6A", bg: "rgba(26,158,106,0.1)",  border: "rgba(26,158,106,0.25)" },
};

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      aria-label={`위험도: ${c.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        background: c.bg,
        color: c.color,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.04em",
        border: `1px solid ${c.border}`,
      }}
      className={className}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, display: "inline-block" }} />
      {c.label}
    </span>
  );
}
