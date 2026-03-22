// src/components/RiskBadge.tsx
// 위험도 뱃지 컴포넌트 (●●●)

import { RiskLevel } from "@/lib/types";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const config = {
  high: {
    label: "고위험",
    className: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
  medium: {
    label: "주의",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  low: {
    label: "정상",
    className: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
  },
};

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      aria-label={`위험도: ${c.label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${c.className} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotColor}`} />
      {c.label}
    </span>
  );
}
