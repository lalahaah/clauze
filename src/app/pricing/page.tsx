// src/app/pricing/page.tsx
// 요금제 페이지 - 3티어 카드

"use client";

import Link from "next/link";
import { FileSearch, HelpCircle } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";

const FAQ = [
  {
    q: "무료 플랜에서 유료 플랜으로 언제든지 업그레이드할 수 있나요?",
    a: "네, 언제든지 업그레이드 가능합니다. 업그레이드 시 즉시 모든 기능이 활성화됩니다.",
  },
  {
    q: "계약서 원본은 저장되나요?",
    a: "업로드된 PDF는 분석 후 자동 삭제됩니다. 검토 결과 텍스트만 저장됩니다.",
  },
  {
    q: "스캔된 이미지 PDF도 분석 가능한가요?",
    a: "텍스트 기반 PDF만 지원됩니다. 이미지 스캔 PDF는 OCR 처리 후 다시 업로드해주세요.",
  },
  {
    q: "법적 효력이 있나요?",
    a: "본 서비스는 참고용 분석을 제공하며 법적 조언이 아닙니다. 중요한 계약은 법률 전문가와 상담하세요.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "결제일로부터 7일 이내 환불 가능합니다. 이미 사용한 검토 건수에 따라 부분 환불될 수 있습니다.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#D0D5E8]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4F8EF7] flex items-center justify-center">
              <FileSearch className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[#1A1A2E] text-sm">ContractAI</span>
          </Link>
          <div className="flex-1" />
          <Link href="/login" className="text-sm text-[#4A4E6A] hover:text-[#1A1A2E]">
            로그인
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-[#4F8EF7] text-white rounded-lg text-sm font-semibold hover:bg-[#3D7DE8] transition-colors">
            무료로 시작하기
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-[#4F8EF7] rounded-full text-xs font-semibold mb-6">
          PRICING
        </div>
        <h1 className="text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-4">
          단순하고 투명한 가격
        </h1>
        <p className="text-[#4A4E6A]">
          변호사 1회 검토비(30~50만원)의 1/20 비용으로 매월 무제한 검토
        </p>
      </section>

      {/* Pricing grid */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 gap-5 items-stretch">
          <PricingCard
            plan="free"
            name="Free"
            price="₩0"
            period="/ 월"
            description="부담 없이 체험해보세요"
            features={["월 2건 검토", "한국어 요약", "검토 이력 7일"]}
            lockedFeatures={["영문 번역", "위험 조항 하이라이트", "무제한 검토"]}
            cta="무료 시작"
            onSelect={() => {}}
          />
          <PricingCard
            plan="pro"
            name="Pro"
            price="₩19,000"
            period="/ 월"
            description="외국인 프리랜서 · 1인 사업자"
            features={[
              "무제한 검토",
              "한국어 + 영문 번역",
              "위험 조항 하이라이트",
              "검토 이력 무제한",
              "우선 처리",
            ]}
            cta="Pro 시작하기"
            featured
            onSelect={() => {}}
          />
          <PricingCard
            plan="business"
            name="Business"
            price="₩79,000"
            period="/ 월"
            description="법무팀 없는 중소기업"
            features={[
              "Pro 모든 기능",
              "팀 5인 공유",
              "커스텀 체크리스트",
              "API 연동",
              "전담 지원",
            ]}
            cta="Business 시작"
            onSelect={() => {}}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-[#D0D5E8] py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1A1A2E] text-center mb-10 tracking-tight">
            자주 묻는 질문
          </h2>
          <div className="flex flex-col gap-4">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="bg-[#F5F6FA] border border-[#D0D5E8] rounded-xl px-5 py-4 group"
              >
                <summary className="flex items-start justify-between cursor-pointer text-sm font-semibold text-[#1A1A2E] list-none">
                  <span>{q}</span>
                  <HelpCircle className="w-4 h-4 text-[#8A8FAA] flex-shrink-0 mt-0.5 ml-3" />
                </summary>
                <p className="mt-3 text-sm text-[#4A4E6A] leading-[1.7]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-[#1A1A2E] rounded-2xl px-10 py-10">
          <h3 className="text-xl font-bold text-white mb-3">
            대기업 · 엔터프라이즈 문의
          </h3>
          <p className="text-[#8A8FAA] text-sm mb-6">
            대용량 계약서, 맞춤형 솔루션, 온프레미스 설치 문의
          </p>
          <a
            href="mailto:enterprise@contractai.kr"
            className="inline-block px-6 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            엔터프라이즈 문의하기
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D0D5E8] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-[#8A8FAA]">
            ※ 본 서비스는 법적 조언을 제공하지 않습니다.
          </p>
          <p className="text-xs text-[#8A8FAA] mt-2">© 2026 ContractAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
