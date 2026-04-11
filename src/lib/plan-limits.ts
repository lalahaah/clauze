// src/lib/plan-limits.ts
// 플랜별 기능 제한 및 검증

import { adminDb } from "@/lib/firebase-admin";
import { PLANS, type PlanKey } from "@/lib/payment";

export interface PlanLimits {
  reviewsPerMonth: number | null; // null = unlimited
  canUseTranslation: boolean;
  canSaveHistory: boolean;
  canDetectPatterns: boolean;
  canGenerateEmail: boolean;
  canUseApi: boolean;
  teamSize: number;
}

export function getPlanLimits(plan: PlanKey): PlanLimits {
  const planInfo = PLANS[plan];

  return {
    reviewsPerMonth: planInfo.features.reviews === -1 ? null : planInfo.features.reviews,
    canUseTranslation: planInfo.features.translation,
    canSaveHistory: planInfo.features.history,
    canDetectPatterns: planInfo.features.pattern,
    canGenerateEmail: planInfo.features.email,
    canUseApi: (planInfo.features as Record<string, unknown>).api === true,
    teamSize: (planInfo.features as Record<string, unknown>).teamSize ?? 1,
  };
}

export async function checkReviewLimit(userId: string, plan: PlanKey): Promise<{
  allowed: boolean;
  reason?: string;
  remaining?: number;
}> {
  const limits = getPlanLimits(plan);

  // unlimited 플랜은 항상 허용
  if (limits.reviewsPerMonth === null) {
    return { allowed: true };
  }

  // 월간 리뷰 제한 확인
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const reviewsThisMonth = await adminDb
    .collection("reviews")
    .where("uid", "==", userId)
    .where("createdAt", ">=", monthStart)
    .where("createdAt", "<=", monthEnd)
    .count()
    .get();

  const count = reviewsThisMonth.data().count;

  if (count >= limits.reviewsPerMonth) {
    return {
      allowed: false,
      reason: `월간 리뷰 제한(${limits.reviewsPerMonth}건)을 초과했습니다.`,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: limits.reviewsPerMonth - count,
  };
}

export async function getUserPlanAndLimits(userId: string) {
  const userDoc = await adminDb.collection("users").doc(userId).get();
  const userData = userDoc.data();
  const plan = (userData?.plan ?? "free") as PlanKey;
  const limits = getPlanLimits(plan);

  return { plan, limits, userData };
}
