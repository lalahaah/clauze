// src/app/page.tsx
// 랜딩 페이지 - Hero 섹션, 기능 소개, 사회적 증거, CTA

import Link from "next/link";
import { FileSearch, Shield, Globe, Zap, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#D0D5E8]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4F8EF7] flex items-center justify-center">
              <FileSearch className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[#1A1A2E] text-sm tracking-tight">
              ContractAI
            </span>
          </Link>
          <div className="flex-1" />
          <Link href="/pricing" className="text-sm text-[#4A4E6A] hover:text-[#1A1A2E] transition-colors">
            요금제
          </Link>
          <Link href="/login" className="text-sm text-[#4A4E6A] hover:text-[#1A1A2E] transition-colors">
            로그인
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[#4F8EF7] text-white rounded-lg text-sm font-semibold hover:bg-[#3D7DE8] transition-colors"
          >
            무료로 시작하기
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-[#4F8EF7] rounded-full text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
          AI 계약서 검토 서비스
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] tracking-tight leading-[1.15] mb-6">
          한국 계약서,{" "}
          <span className="text-[#4F8EF7]">30초</span>면 충분합니다
        </h1>
        <p className="text-lg text-[#4A4E6A] max-w-xl mx-auto leading-[1.8] mb-10">
          PDF를 올리면 위험 조항을 즉시 찾아드립니다.
          <br />
          한/영 요약 제공. 외국인 프리랜서 OK.
        </p>
        <div className="flex items-center justify-center gap-3 mb-16">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 bg-[#4F8EF7] text-white rounded-xl font-bold text-base hover:bg-[#3D7DE8] transition-colors shadow-lg shadow-blue-200"
          >
            무료로 시작하기 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-white border border-[#D0D5E8] text-[#1A1A2E] rounded-xl font-semibold text-base hover:border-[#4F8EF7] transition-colors"
          >
            데모 보기
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12">
          {[
            { n: "1,200+", l: "검토된 계약서" },
            { n: "28s", l: "평균 검토 시간" },
            { n: "98%", l: "위험 조항 탐지율" },
          ].map(({ n, l }) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-extrabold font-mono text-[#1A1A2E] tracking-tight">
                {n}
              </div>
              <div className="text-xs text-[#8A8FAA] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-[#D0D5E8] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1A1A2E] text-center mb-14 tracking-tight">
            3단계로 끝나는 계약서 검토
          </h2>
          <div className="grid grid-cols-3 gap-10">
            {[
              {
                icon: <FileSearch className="w-6 h-6 text-[#4F8EF7]" />,
                step: "01",
                title: "PDF 업로드",
                desc: "계약서 PDF를 드래그하거나 클릭해서 업로드하세요. 최대 10MB.",
              },
              {
                icon: <Zap className="w-6 h-6 text-[#4F8EF7]" />,
                step: "02",
                title: "AI 분석",
                desc: "Claude AI가 30초 이내에 전체 계약서의 위험 조항을 식별합니다.",
              },
              {
                icon: <Shield className="w-6 h-6 text-[#4F8EF7]" />,
                step: "03",
                title: "결과 확인",
                desc: "위험도별로 분류된 조항과 한/영 요약을 즉시 확인하세요.",
              },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <div className="text-xs font-mono text-[#4F8EF7] font-semibold mb-2">
                  STEP {step}
                </div>
                <h3 className="text-base font-bold text-[#1A1A2E] mb-2">{title}</h3>
                <p className="text-sm text-[#4A4E6A] leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-[#1A1A2E] text-center mb-12 tracking-tight">
          핵심 기능
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5 text-[#4F8EF7]" />,
              title: "30초 즉시 분석",
              desc: "PDF 업로드 즉시 Claude AI가 전체 계약서를 분석합니다.",
            },
            {
              icon: <Shield className="w-5 h-5 text-[#E24B4A]" />,
              title: "위험 조항 하이라이트",
              desc: "불리한 조항을 3단계 위험도로 즉각 시각화합니다.",
            },
            {
              icon: <Globe className="w-5 h-5 text-[#00C896]" />,
              title: "한/영 동시 요약",
              desc: "외국인 프리랜서를 위한 영문 번역 요약 자동 제공.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-[#D0D5E8] rounded-xl p-6 hover:border-[#4F8EF7] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">{title}</h3>
              <p className="text-sm text-[#4A4E6A] leading-[1.7]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-white border-y border-[#D0D5E8] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1A1A2E] text-center mb-12 tracking-tight">
            이런 분들에게 필요합니다
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "한국 거주 외국인 프리랜서",
                pain: "한국어 계약서를 이해 못한 채 사인 → 분쟁 발생 시 속수무책",
                solution: "영문 번역 요약으로 계약 내용을 정확히 파악",
                color: "border-l-[#4F8EF7]",
              },
              {
                title: "국내 1인 프리랜서 / 소규모 사업자",
                pain: "변호사 비용(30~50만원)은 부담, 그냥 사인하기엔 불안",
                solution: "변호사 비용의 1/20로 핵심 위험 조항 즉시 파악",
                color: "border-l-[#00C896]",
              },
            ].map(({ title, pain, solution, color }) => (
              <div
                key={title}
                className={`bg-[#F5F6FA] border border-[#D0D5E8] border-l-4 ${color} rounded-xl p-6`}
              >
                <h3 className="text-base font-bold text-[#1A1A2E] mb-3">{title}</h3>
                <p className="text-sm text-[#E24B4A] mb-3 font-medium">
                  문제: {pain}
                </p>
                <p className="text-sm text-[#00C896] font-medium">
                  해결: {solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-[#1A1A2E] text-center mb-12 tracking-tight">
          사용자 후기
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              name: "Sarah M.",
              role: "영어강사 (캐나다 출신)",
              review:
                "I had no idea what I was signing before. This tool explained every clause in English and flagged 2 dangerous ones. Lifesaver!",
              stars: 5,
            },
            {
              name: "김지현",
              role: "프리랜서 디자이너",
              review:
                "변호사한테 맡기기엔 금액이 작은 프로젝트도 이제는 안심하고 진행할 수 있어요. 고위험 조항을 바로 알려줘서 협상에 도움이 됐습니다.",
              stars: 5,
            },
            {
              name: "Park S.",
              role: "중소기업 계약 담당자",
              review:
                "법무팀 없이도 계약서를 검토할 수 있게 됐습니다. 특히 IP 조항 분석이 정확해서 여러 번 유용하게 쓰고 있어요.",
              stars: 5,
            },
          ].map(({ name, role, review, stars }) => (
            <div
              key={name}
              className="bg-white border border-[#D0D5E8] rounded-xl p-5"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {Array(stars)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
              </div>
              <p className="text-sm text-[#4A4E6A] leading-[1.7] mb-4 italic">
                &ldquo;{review}&rdquo;
              </p>
              <div>
                <p className="text-sm font-bold text-[#1A1A2E]">{name}</p>
                <p className="text-xs text-[#8A8FAA]">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white border-t border-[#D0D5E8] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4 tracking-tight">
            단순하고 투명한 가격
          </h2>
          <p className="text-[#4A4E6A] mb-10">
            변호사 1회 검토비(30~50만원)의 1/20 비용으로
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { name: "Free", price: "₩0", desc: "월 2건 무료" },
              { name: "Pro", price: "₩19,000", desc: "무제한 + 영문 번역", featured: true },
              { name: "Business", price: "₩79,000", desc: "팀 5인 + 커스텀" },
            ].map(({ name, price, desc, featured }) => (
              <div
                key={name}
                className={`rounded-xl p-5 ${
                  featured
                    ? "bg-[#4F8EF7] text-white shadow-lg shadow-blue-200"
                    : "bg-[#F5F6FA] border border-[#D0D5E8]"
                }`}
              >
                <p
                  className={`text-sm font-bold mb-1 ${
                    featured ? "text-white" : "text-[#1A1A2E]"
                  }`}
                >
                  {name}
                </p>
                <p
                  className={`text-xl font-extrabold font-mono mb-1 ${
                    featured ? "text-white" : "text-[#1A1A2E]"
                  }`}
                >
                  {price}
                </p>
                <p
                  className={`text-xs ${
                    featured ? "text-blue-100" : "text-[#8A8FAA]"
                  }`}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="text-sm text-[#4F8EF7] font-semibold hover:underline"
          >
            자세한 요금제 보기 →
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#1A1A2E] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            지금 바로 계약서를 검토해보세요
          </h2>
          <p className="text-[#8A8FAA] mb-8">무료로 시작, 신용카드 불필요</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F8EF7] text-white rounded-xl font-bold text-base hover:bg-[#3D7DE8] transition-colors"
          >
            무료로 시작하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F6FA] border-t border-[#D0D5E8] py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-[#8A8FAA] leading-[1.8] max-w-2xl mx-auto mb-4">
            ※ 본 서비스는 법적 조언을 제공하지 않습니다. AI의 검토 결과는 참고용이며, 중요한 계약은 반드시 법률 전문가와 상담하시기 바랍니다.
            <br />
            This service does not provide legal advice.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link href="#" className="text-xs text-[#8A8FAA] hover:text-[#4A4E6A]">이용약관</Link>
            <Link href="#" className="text-xs text-[#8A8FAA] hover:text-[#4A4E6A]">개인정보처리방침</Link>
            <Link href="/pricing" className="text-xs text-[#8A8FAA] hover:text-[#4A4E6A]">요금제</Link>
          </div>
          <p className="text-xs text-[#8A8FAA] mt-4">© 2026 ContractAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
