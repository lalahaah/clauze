// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://clauze-ai.vercel.app"),
  title: "Clauze — Korean Contract Review AI",
  description: "Upload your Korean contract and get risk analysis in 30 seconds — in Korean and English.",
  keywords: ["계약서 검토", "AI 계약서", "Korean contract review", "contract AI"],
  openGraph: {
    url: "https://clauze-ai.vercel.app",
    title: "Clauze — One Review. Total Confidence.",
    description: "AI-powered Korean contract review for freelancers and businesses.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
