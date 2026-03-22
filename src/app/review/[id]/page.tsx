// src/app/review/[id]/page.tsx
// 검토 결과 상세 페이지

"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, FileSearch } from "lucide-react";
import { ReviewResult } from "@/components/ReviewResult";
import { RiskBadge } from "@/components/RiskBadge";
import { Review } from "@/lib/types";

// 데모용 리뷰 데이터
const DEMO_REVIEW: Review = {
  id: "1",
  uid: "demo",
  fileName: "프리랜서_용역계약서_A사.pdf",
  storageUrl: "",
  processingTime: 28000,
  riskLevel: "high",
  createdAt: new Date().toISOString(),
  result: {
    overallRisk: "high",
    summary_ko:
      "이 계약서에는 일방적으로 수정 가능한 대금 조항과 과도한 지식재산권 양도 조항이 포함되어 있습니다. 서명 전 반드시 해당 조항의 수정을 요청하시기 바랍니다.",
    summary_en:
      "This contract contains unilateral payment modification clauses and broad IP assignment terms that may disadvantage the service provider. Negotiation is strongly recommended before signing.",
    clauses: [
      {
        title: "제7조 – 대금 지급 조건",
        content_ko:
          '"갑의 사정에 따라 대금을 조정할 수 있다"는 조항이 포함되어 있습니다. 구체적 기준 없이 일방적 변경이 가능한 구조입니다.',
        content_en:
          '"Party A may adjust the payment based on circumstances" — no objective criteria defined.',
        risk: "high",
        action: "해당 조항 삭제 또는 구체적 지급 기준 명시 요청",
      },
      {
        title: "제11조 – 지식재산권 귀속",
        content_ko:
          "산출물의 모든 지식재산권이 계약 종료 후에도 영구적으로 갑에게 귀속됩니다. 2차 저작물 사용권도 포함됩니다.",
        content_en:
          "All IP rights permanently assigned to Party A including derivative works — unusually broad scope.",
        risk: "high",
        action: "범위 제한 및 2차 저작물 권리 협상 요청",
      },
      {
        title: "제15조 – 계약 해지 조건",
        content_ko:
          "갑은 7일 사전 통보로 계약을 해지할 수 있으나, 을은 30일 전 통보가 요구됩니다. 비대칭적 조건입니다.",
        content_en:
          "Asymmetric termination: Party A 7-day vs Party B 30-day notice period.",
        risk: "medium",
        action: "조건 대칭 수정 요청 권장",
      },
      {
        title: "제3조 – 계약 기간",
        content_ko: "2026년 4월 1일부터 12월 31일까지 표준 기간으로 설정되어 있습니다.",
        content_en: "Standard contract term April 1 – December 31, 2026. No issues found.",
        risk: "low",
        action: null,
      },
      {
        title: "제5조 – 비밀유지 의무",
        content_ko:
          "계약 종료 후 2년간 비밀유지 의무를 지는 표준 조항입니다. 업계 통상 범위 내입니다.",
        content_en:
          "Standard 2-year NDA post-termination. Within normal industry range.",
        risk: "low",
        action: null,
      },
    ],
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function ReviewPage({ params }: Props) {
  const { id } = use(params);
  // id is used for future Firestore lookup; using demo data for now
  void id;
  const review = DEMO_REVIEW;

  const highCount = review.result.clauses.filter((c) => c.risk === "high").length;
  void highCount;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D0D5E8]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4F8EF7] flex items-center justify-center">
              <FileSearch className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[#1A1A2E] text-sm">ContractAI</span>
          </Link>
          <div className="w-px h-4 bg-[#D0D5E8]" />
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-[#4A4E6A] hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드
          </Link>
          <div className="flex-1" />
          <span className="text-sm font-medium text-[#1A1A2E] truncate max-w-xs">
            {review.fileName}
          </span>
          <span className="text-xs text-[#8A8FAA] font-mono">28s</span>
          <RiskBadge level={review.riskLevel} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ReviewResult review={review} />
      </div>

      {/* Bottom disclaimer */}
      <div className="border-t border-[#D0D5E8] bg-white py-4">
        <p className="text-xs text-[#8A8FAA] text-center max-w-2xl mx-auto">
          ※ 본 서비스는 법적 조언을 제공하지 않습니다. AI의 검토 결과는 참고용이며, 중요한 계약은 반드시 법률 전문가와 상담하시기 바랍니다. This service does not provide legal advice.
        </p>
      </div>
    </div>
  );
}
