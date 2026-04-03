// src/lib/types.ts
// 공통 타입 정의

export type RiskLevel = "high" | "medium" | "low";

export type UserPlan = "free" | "pro" | "business";

export interface ClauseResult {
  title: string;
  content_ko: string;
  content_en: string;
  risk: RiskLevel;
  action: string | null;
  action_en?: string | null;
}

export interface ReviewResult {
  overallRisk: RiskLevel;
  summary_ko: string;
  summary_en: string;
  clauses: ClauseResult[];
}

export interface RepeatPattern {
  clauseTitle: string;         // 현재 조항명 (키워드)
  pastOccurrences: number;     // 과거 동일 위험 조항 발견 횟수
  firstFoundAt: string;        // 최초 발견일 (ISO 문자열)
  lastReviewFileName: string;  // 마지막 발견된 계약서명
}

export interface Review {
  id: string;
  uid: string;
  fileName: string;
  storageUrl: string;
  result: ReviewResult;
  riskLevel: RiskLevel;
  createdAt: string;
  processingTime?: number;
  repeatedPatterns?: RepeatPattern[];
  industry?: string; // 분석 시 선택된 업종 키
}

export interface User {
  uid: string;
  email: string;
  plan: UserPlan;
  reviewCount: number;
  createdAt: string;
}
