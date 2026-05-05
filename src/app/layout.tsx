// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <meta name="google-site-verification" content="CPysx2ERXBLCxjoV6pZGsa7x2mGZsYrYnFiBQep4Buc" />
      </head>
      <body className="antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NMP101HNKT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NMP101HNKT');
          `}
        </Script>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
