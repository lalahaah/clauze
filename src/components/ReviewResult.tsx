// src/components/ReviewResult.tsx
// 검토 결과 렌더링 컴포넌트

"use client";

import { Review } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { ClauseCard } from "./ClauseCard";
import { FileText, Clock, AlertTriangle } from "lucide-react";

interface ReviewResultProps {
  review: Review;
  onUpgrade?: () => void;
}

const riskCount = (review: Review, level: string) =>
  review.result.clauses.filter((c) => c.risk === level).length;

export function ReviewResult({ review, onUpgrade }: ReviewResultProps) {
  const highCount = riskCount(review, "high");
  const mediumCount = riskCount(review, "medium");
  const lowCount = riskCount(review, "low");
  const time = review.processingTime
    ? `${Math.round(review.processingTime / 1000)}s`
    : "-";

  return (
    <div className="flex gap-6">
      {/* 왼쪽 요약 패널 */}
      <aside className="w-56 flex-shrink-0 flex flex-col gap-4">
        {/* 위험도 집계 */}
        <div className="bg-white border border-[#D0D5E8] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#8A8FAA] uppercase tracking-wider mb-3">
            위험도 요약
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { n: highCount, l: "고위험", bg: "bg-red-50", text: "text-red-600" },
              { n: mediumCount, l: "주의", bg: "bg-amber-50", text: "text-amber-600" },
              { n: lowCount, l: "정상", bg: "bg-green-50", text: "text-green-600" },
            ].map(({ n, l, bg, text }) => (
              <div key={l} className={`${bg} rounded-lg p-2 text-center`}>
                <div className={`text-xl font-bold font-mono ${text}`}>{n}</div>
                <div className={`text-[10px] ${text} mt-0.5`}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 파일 정보 */}
        <div className="bg-white border border-[#D0D5E8] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-3.5 h-3.5 text-[#8A8FAA]" />
            <span className="text-xs font-semibold text-[#8A8FAA] uppercase tracking-wider">파일</span>
          </div>
          <p className="text-xs text-[#4A4E6A] truncate" title={review.fileName}>
            {review.fileName}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-3 h-3 text-[#8A8FAA]" />
            <span className="text-xs text-[#8A8FAA]">{time}</span>
          </div>
        </div>

        {/* 한국어 요약 */}
        <div className="bg-white border border-[#D0D5E8] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#8A8FAA] uppercase tracking-wider mb-2">
            한국어 요약
          </p>
          <p className="text-xs text-[#4A4E6A] leading-[1.7]">
            {review.result.summary_ko}
          </p>
        </div>

        {/* 영문 요약 */}
        <div className="bg-white border border-[#D0D5E8] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#8A8FAA] uppercase tracking-wider mb-2">
            English Summary
          </p>
          <p className="text-xs text-[#8A8FAA] leading-[1.6] italic">
            {review.result.summary_en}
          </p>
        </div>

        {/* 변호사 연결 CTA */}
        {highCount > 0 && (
          <button className="w-full py-3 bg-[#E24B4A] text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            변호사 연결 상담 →
          </button>
        )}

        {/* 면책 조항 */}
        <p className="text-[10px] text-[#8A8FAA] leading-[1.6] text-center">
          ※ 본 검토는 참고용이며 법적 효력이 없습니다. 중요한 계약은 법률 전문가와 상담하세요.
        </p>
      </aside>

      {/* 오른쪽 조항 목록 */}
      <main className="flex-1 flex flex-col gap-3">
        {review.result.clauses.map((clause, i) => (
          <ClauseCard key={i} clause={clause} index={i} />
        ))}
      </main>
    </div>
  );
}
