// src/components/ClauseCard.tsx
// 조항별 카드 UI - 위험도에 따라 left border 색상 변경

"use client";

import { useState } from "react";
import { ClauseResult } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ClauseCardProps {
  clause: ClauseResult;
  index: number;
}

const clauseClass = {
  high: "clause-high",
  medium: "clause-medium",
  low: "clause-low",
};

export function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(clause.risk === "high");

  return (
    <div
      className={`bg-white border border-[#D0D5E8] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#B0B7D0] ${clauseClass[clause.risk]}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
      >
        <RiskBadge level={clause.risk} />
        <h3 className="flex-1 text-sm font-semibold text-[#1A1A2E] leading-snug">
          {clause.title}
        </h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#8A8FAA] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#8A8FAA] flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#F0F1F7]">
          <p className="text-sm text-[#4A4E6A] leading-[1.7] mt-3 mb-2">
            {clause.content_ko}
          </p>
          <p className="text-xs text-[#8A8FAA] leading-[1.6] italic mb-3">
            {clause.content_en}
          </p>
          {clause.action && (
            <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-[#4F8EF7]">
              {clause.action}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
