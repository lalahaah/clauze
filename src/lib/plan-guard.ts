// src/lib/plan-guard.ts
// 플랜별 검토 권한 확인 및 크레딧 관리

import { adminDb } from "@/lib/firebase-admin";

type PermissionResult =
  | { allowed: true }
  | { allowed: false; reason: "free_limit" | "no_credits" | "subscription_cancelled" };

// 검토 권한 확인
export async function checkReviewPermission(uid: string): Promise<PermissionResult> {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const plan = (userData?.plan ?? "free") as string;

    // Pro/Business 구독: 무제한 허용
    if (plan === "pro" || plan === "business") {
      // 구독 활성 상태 확인
      if (userData?.subscriptionStatus !== "active") {
        return { allowed: false, reason: "subscription_cancelled" };
      }
      return { allowed: true };
    }

    // Single Review: 크레딧 확인
    if (plan === "single") {
      const credits = userData?.singleReviewCredits ?? 0;
      if (credits > 0) {
        return { allowed: true };
      }
      return { allowed: false, reason: "no_credits" };
    }

    // Free: 월 1건 제한
    if (plan === "free") {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const reviewsThisMonth = await adminDb
        .collection("reviews")
        .where("uid", "==", uid)
        .where("createdAt", ">=", monthStart)
        .where("createdAt", "<=", monthEnd)
        .count()
        .get();

      const count = reviewsThisMonth.data().count;

      if (count >= 1) {
        return { allowed: false, reason: "free_limit" };
      }

      return { allowed: true };
    }

    return { allowed: false, reason: "free_limit" };
  } catch (err) {
    console.error("Permission check error:", err);
    // Firestore 조회 실패 시 free 플랜 기본 허용 (신규 유저 보호)
    return { allowed: true };
  }
}

// Single Review 크레딧 차감
export async function consumeCredit(uid: string): Promise<boolean> {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData) return false;

    const currentCredits = userData.singleReviewCredits ?? 0;

    if (currentCredits <= 0) {
      return false;
    }

    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        singleReviewCredits: currentCredits - 1,
        lastCreditUsedAt: new Date().toISOString(),
      });

    return true;
  } catch (err) {
    console.error("Credit consumption error:", err);
    return false;
  }
}

// Free 플랜 월간 검토 수 증가
export async function incrementFreePlanReviewCount(uid: string): Promise<void> {
  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();
    const currentCount = userData?.monthlyReviewCount ?? 0;

    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        monthlyReviewCount: currentCount + 1,
      });
  } catch (err) {
    console.error("Review count increment error:", err);
    // 비치명적 에러 — 무시
  }
}
