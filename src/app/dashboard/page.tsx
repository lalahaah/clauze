// src/app/dashboard/page.tsx
// 대시보드 - 업로드 + 이력 확인

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileSearch, FileText, Clock, BarChart2, LogOut, Crown } from "lucide-react";
import { ContractUploader } from "@/components/ContractUploader";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskLevel } from "@/lib/types";

// 데모용 검토 이력 데이터
const DEMO_HISTORY = [
  { id: "1", name: "프리랜서_용역계약서_A사.pdf", time: "3시간 전", risk: "high" as RiskLevel },
  { id: "2", name: "NDA_startup_B.pdf", time: "어제", risk: "medium" as RiskLevel },
  { id: "3", name: "임대차계약서_2026.pdf", time: "3일 전", risk: "low" as RiskLevel },
  { id: "4", name: "광고대행_계약서.pdf", time: "1주 전", risk: "medium" as RiskLevel },
];

export default function DashboardPage() {
  const router = useRouter();
  const [uploadError, setUploadError] = useState("");

  const handleUploadComplete = (reviewId: string) => {
    router.push(`/review/${reviewId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-[#D0D5E8] flex flex-col py-5 px-4 fixed h-full">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-6 h-6 rounded-md bg-[#4F8EF7] flex items-center justify-center">
            <FileSearch className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[#1A1A2E] text-sm">ContractAI</span>
        </Link>

        <nav className="flex-1 flex flex-col gap-1">
          {[
            { icon: <BarChart2 className="w-4 h-4" />, label: "대시보드", href: "/dashboard", active: true },
            { icon: <FileText className="w-4 h-4" />, label: "검토 이력", href: "/dashboard", active: false },
            { icon: <Crown className="w-4 h-4" />, label: "요금제", href: "/pricing", active: false },
          ].map(({ icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-50 text-[#4F8EF7] font-semibold"
                  : "text-[#4A4E6A] hover:bg-gray-50"
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* Plan status */}
        <div className="mb-4">
          <div className="bg-[#F5F6FA] rounded-xl p-3">
            <p className="text-xs font-semibold text-[#4A4E6A] mb-2">무료 플랜</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div className="bg-[#4F8EF7] h-1.5 rounded-full" style={{ width: "50%" }} />
            </div>
            <p className="text-[10px] text-[#8A8FAA]">1 / 2건 사용</p>
            <Link
              href="/pricing"
              className="mt-2 block text-center w-full py-1.5 bg-[#4F8EF7] text-white text-xs font-semibold rounded-lg"
            >
              업그레이드
            </Link>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#8A8FAA] hover:text-[#4A4E6A] transition-colors">
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-52 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            대시보드
          </h1>
          <p className="text-sm text-[#8A8FAA]">
            계약서를 업로드하고 AI 분석 결과를 확인하세요.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "총 검토 건수", value: "47", sub: "이번 달 +7", valueColor: "text-[#1A1A2E]" },
            { label: "고위험 발견", value: "12", sub: "3건 미확인", valueColor: "text-[#E24B4A]" },
            { label: "평균 검토 시간", value: "28s", sub: "업계 평균 3일", valueColor: "text-[#00C896]" },
          ].map(({ label, value, sub, valueColor }) => (
            <div
              key={label}
              className="bg-white border border-[#D0D5E8] rounded-xl p-4"
            >
              <p className="text-xs text-[#8A8FAA] font-medium mb-2">{label}</p>
              <p className={`text-3xl font-extrabold font-mono tracking-tight ${valueColor}`}>
                {value}
              </p>
              <p className="text-xs text-[#8A8FAA] mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#1A1A2E] mb-3">새 계약서 검토</h2>
          <ContractUploader
            onUploadComplete={handleUploadComplete}
            onError={setUploadError}
            userId={null}
          />
          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
        </div>

        {/* Recent reviews */}
        <div>
          <h2 className="text-sm font-bold text-[#1A1A2E] mb-3">최근 검토 이력</h2>
          <div className="bg-white border border-[#D0D5E8] rounded-xl overflow-hidden">
            {DEMO_HISTORY.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="w-10 h-10 text-[#D0D5E8] mx-auto mb-3" />
                <p className="text-sm text-[#8A8FAA]">아직 검토된 계약서가 없습니다</p>
                <p className="text-xs text-[#8A8FAA] mt-1">위에서 PDF를 업로드해보세요</p>
              </div>
            ) : (
              DEMO_HISTORY.map(({ id, name, time, risk }, i) => (
                <Link
                  key={id}
                  href={`/review/${id}`}
                  className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors ${
                    i < DEMO_HISTORY.length - 1 ? "border-b border-[#F0F1F7]" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-[#D0D5E8] flex items-center justify-center text-[10px] font-mono font-bold text-[#8A8FAA]">
                    PDF
                  </div>
                  <span className="flex-1 text-sm text-[#1A1A2E] truncate">{name}</span>
                  <span className="text-xs text-[#8A8FAA] flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {time}
                  </span>
                  <RiskBadge level={risk} />
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
