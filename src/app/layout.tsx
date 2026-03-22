// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ContractAI — 한국 계약서 검토 AI",
  description:
    "한국어 계약서를 업로드하면 30초 안에 위험 조항을 짚어주고 영어 요약을 제공하는 AI 계약서 검토 서비스",
  keywords: ["계약서 검토", "AI 계약서", "한국 계약법", "contract review", "Korean contract"],
  openGraph: {
    title: "ContractAI — 30초 계약서 검토",
    description: "위험 조항을 즉시 발견. 외국인 프리랜서 & 1인 사업자를 위한 AI 계약서 검토",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
