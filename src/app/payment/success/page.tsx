// src/app/payment/success/page.tsx
// 결제 성공 페이지

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

// 디자인 토큰
const T = {
  bgLight: "#F6F7FB",
  bgCard: "#FFFFFF",
  bgDark: "#093944",
  teal: "#00A599",
  text: "#042228",
  textMid: "#3D5A5E",
} as const;

// 플랜별 성공 메시지
const PLAN_MESSAGES = {
  single: {
    title: "검토 크레딧 획득 완료!",
    description: "계약서 1건을 검토할 수 있습니다.",
    highlight: "Single Review",
  },
  pro: {
    title: "Pro 플랜 구독 시작!",
    description: "이제 무제한으로 계약서를 검토할 수 있습니다.",
    highlight: "Pro",
  },
  business: {
    title: "Business 플랜 구독 시작!",
    description: "팀 5명이 무제한 검토와 API 사용을 할 수 있습니다.",
    highlight: "Business",
  },
} as const;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 플랜 타입 추출
  const planType = (searchParams.get("type") ?? "pro") as
    | "single"
    | "pro"
    | "business";

  const message = PLAN_MESSAGES[planType];

  // 3초 후 대시보드로 자동 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        background: T.bgLight,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}
    >
      {/* 카드 컨테이너 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: T.bgCard,
          borderRadius: "16px",
          padding: "60px 40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 24px rgba(4, 34, 40, 0.08)",
        }}
      >
        {/* 체크 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: T.teal,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check
              size={48}
              color="white"
              strokeWidth={2.5}
            />
          </div>
        </motion.div>

        {/* 제목 */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: T.text,
            textAlign: "center",
            margin: "0 0 12px 0",
            letterSpacing: "-0.01em",
          }}
        >
          {message.title}
        </h1>

        {/* 설명 */}
        <p
          style={{
            fontSize: "16px",
            color: T.textMid,
            textAlign: "center",
            margin: "0 0 32px 0",
            lineHeight: 1.6,
          }}
        >
          {message.description}
        </p>

        {/* 하이라이트 배지 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: `rgba(0, 165, 153, 0.1)`,
              border: `1px solid ${T.teal}`,
              borderRadius: "24px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: T.teal,
            }}
          >
            ✓ {message.highlight}
          </div>
        </div>

        {/* 로딩 인디케이터 */}
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: T.textMid,
            marginBottom: "24px",
          }}
        >
          <span>대시보드로 이동 중...</span>
        </div>

        {/* 진행 바 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3, ease: "linear" }}
          style={{
            height: "3px",
            background: T.teal,
            borderRadius: "2px",
            transformOrigin: "left",
          }}
        />
      </motion.div>
    </div>
  );
}
