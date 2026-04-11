// src/components/dashboard/SubscriptionManager.tsx
// 구독 관리 및 취소 컴포넌트

"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

interface SubscriptionManagerProps {
  planName: string;
  renewalDate: string;
  onSuccess?: () => void;
  lang?: "ko" | "en";
}

export function SubscriptionManager({
  planName,
  renewalDate,
  onSuccess,
  lang = "ko",
}: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    // 확인 다이얼로그
    const confirmMsg = lang === "ko"
      ? "구독을 취소하시겠습니까?\n현재 결제 기간 만료일까지 서비스를 이용할 수 있습니다."
      : "Cancel subscription?\nYou can use the service until the current billing period ends.";

    if (!confirm(confirmMsg)) {
      return;
    }

    setIsLoading(true);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        alert(lang === "ko" ? "인증 토큰을 가져올 수 없습니다" : "Unable to get auth token");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        success?: boolean;
      };

      if (!response.ok) {
        throw new Error(data.error || "구독 취소 실패");
      }

      // 성공 메시지
      const successMsg = lang === "ko"
        ? "구독이 취소되었습니다."
        : "Subscription cancelled.";

      alert(successMsg);

      // 페이지 새로고침 (Firestore 데이터 동기화)
      window.location.reload();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Cancel error:", err);

      const errorMsg = err instanceof Error
        ? err.message
        : (lang === "ko" ? "구독 취소 중 오류가 발생했습니다" : "An error occurred");

      alert(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      style={{
        padding: "10px 24px",
        background: "transparent",
        color: isLoading ? "rgba(61, 90, 94, 0.5)" : "#3D5A5E",
        border: `1.5px solid ${isLoading ? "rgba(4, 34, 40, 0.2)" : "rgba(4, 34, 40, 0.1)"}`,
        borderRadius: "28px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = "rgba(4, 34, 40, 0.06)";
          e.currentTarget.style.borderColor = "#3D5A5E";
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "rgba(4, 34, 40, 0.1)";
        }
      }}
    >
      {isLoading
        ? (lang === "ko" ? "처리 중..." : "Processing...")
        : (lang === "ko" ? "구독 취소" : "Cancel subscription")}
    </button>
  );
}
