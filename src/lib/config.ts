// src/lib/config.ts
// 서비스 설정 상수 — 도메인 변경 시 한 곳만 수정하면 전체 적용

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://clauze-ai.vercel.app';
export const SITE_NAME = 'Clauze';
export const COMPANY_NAME = '(주)루시퍼';

// 지원 이메일 — 도메인 이메일 구매 후 이 한 줄만 수정하면 전체 적용
// 추후 변경 예정: 'support@clauze.io' 또는 'hello@clauze.io'
export const SUPPORT_EMAIL = 'nextidealab.ai@gmail.com';
