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
}

export interface ReviewResult {
  overallRisk: RiskLevel;
  summary_ko: string;
  summary_en: string;
  clauses: ClauseResult[];
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
}

export interface User {
  uid: string;
  email: string;
  plan: UserPlan;
  reviewCount: number;
  createdAt: string;
}
