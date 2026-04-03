// src/lib/pattern-analyzer.ts
// 반복 계약 패턴 분석 - 과거 이력과 현재 검토 결과를 비교해 위험 조항 패턴 감지

import { adminDb } from "@/lib/firebase-admin";
import { ClauseResult, RepeatPattern, Review } from "@/lib/types";

/**
 * 조항 제목에서 키워드 부분만 추출
 * "제7조 – 대금 지급 조건" → "대금 지급 조건"
 */
function extractClauseKeyword(title: string): string {
  return title.replace(/^제\d+조\s*[–\-]\s*/, "").trim();
}

/**
 * 두 키워드가 유사한지 확인 (단방향 includes 체크)
 */
function isSimilarKeyword(a: string, b: string): boolean {
  const lower_a = a.toLowerCase();
  const lower_b = b.toLowerCase();
  return lower_a.includes(lower_b) || lower_b.includes(lower_a);
}

/**
 * Firestore에서 해당 uid의 과거 검토 이력을 조회
 * currentReviewId: 방금 저장된 현재 리뷰는 제외
 */
export async function findPastReviews(
  uid: string,
  currentReviewId: string
): Promise<Review[]> {
  const snapshot = await adminDb
    .collection("reviews")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(50) // 최근 50건만 조회 (성능 상한)
    .get();

  return snapshot.docs
    .map(doc => doc.data() as Review)
    .filter(r => r.id !== currentReviewId); // 현재 리뷰 제외
}

/**
 * 현재 검토 결과의 조항들과 과거 이력을 비교해 반복 패턴 반환
 * high/medium 위험 조항만 비교 대상
 */
export function detectRepeatedClauses(
  currentClauses: ClauseResult[],
  pastReviews: Review[]
): RepeatPattern[] {
  // 현재 high/medium 조항만 대상
  const riskyClauses = currentClauses.filter(
    c => c.risk === "high" || c.risk === "medium"
  );

  const patterns: RepeatPattern[] = [];

  for (const clause of riskyClauses) {
    const currentKeyword = extractClauseKeyword(clause.title);
    if (!currentKeyword) continue;

    // 과거 리뷰 중 동일 키워드가 high/medium이었던 것 수집
    const matchingReviews = pastReviews.filter(past =>
      past.result?.clauses?.some(
        pc =>
          (pc.risk === "high" || pc.risk === "medium") &&
          isSimilarKeyword(extractClauseKeyword(pc.title), currentKeyword)
      )
    );

    if (matchingReviews.length === 0) continue;

    // 날짜 순 정렬 (오름차순)
    const sorted = [...matchingReviews].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    patterns.push({
      clauseTitle: currentKeyword,
      pastOccurrences: matchingReviews.length,
      firstFoundAt: sorted[0].createdAt,
      lastReviewFileName: sorted[sorted.length - 1].fileName,
    });
  }

  return patterns;
}
