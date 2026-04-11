// src/components/pricing/CheckoutButton.tsx
// 결제 버튼 컴포넌트

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { PlanType } from "@/lib/dodo";

interface CheckoutButtonProps {
  planType: PlanType;
  label: string;
  className?: string;
  disabled?: boolean;
}

export function CheckoutButton({
  planType,
  label,
  className,
  disabled = false,
}: CheckoutButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // 1. 비로그인 확인
    if (!user) {
      router.push(`/login?redirect=/pricing&plan=${planType}`);
      return;
    }

    setIsLoading(true);

    try {
      // 2. Firebase ID 토큰 가져오기
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        alert("인증 토큰을 가져올 수 없습니다. 다시 로그인해주세요.");
        setIsLoading(false);
        return;
      }

      // 3. 결제 요청 API 호출
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          planType,
          userName: user.displayName || user.email,
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        // 이미 같은 플랜 구독 중인 경우
        if (data.code === "ALREADY_SUBSCRIBED") {
          alert(data.error);
          setIsLoading(false);
          return;
        }

        throw new Error(data.error || "결제 요청 실패");
      }

      if (!data.checkoutUrl) {
        throw new Error("결제 페이지를 열 수 없습니다");
      }

      // 4. Dodo 결제 페이지로 이동
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      alert(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      style={{
        width: "100%",
        padding: "12px 24px",
        borderRadius: "28px",
        border: "1.5px solid #042228",
        background: isLoading || disabled ? "rgba(4, 34, 40, 0.6)" : "#042228",
        color: "white",
        fontSize: "14px",
        fontWeight: 600,
        cursor: isLoading || disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        letterSpacing: "0.5px",
        opacity: isLoading || disabled ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(4, 34, 40, 0.85)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = "#042228";
        }
      }}
      className={className}
    >
      {isLoading ? "처리 중..." : label}
    </button>
  );
}
