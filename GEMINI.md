# Clauze 프로젝트 완전 인수인계 문서
> **대상:** Gemini CLI (Antigravity IDE)
> **작성일:** 2026-04-28
> **작성자:** Claude (이전 세션 인수인계)

---

## 1. 프로젝트 기본 정보

| 항목 | 값 |
|---|---|
| 서비스명 | Clauze — 한국어 AI 계약서 검토 SaaS |
| 라이브 URL | https://clauze-ai.vercel.app |
| GitHub | main 브랜치 (로컬 폴더: `clauze`) |
| 운영사 | (주)루시퍼 / nextidealab.ai |
| 대표 | 박원영 (nextidealab.ai@gmail.com) |
| 배포 | Vercel (Hobby 플랜) |
| Firebase 프로젝트 | clauze-prod |

---

## 2. 기술 스택

```
Frontend  : Next.js 14 App Router / TypeScript / Tailwind CSS / shadcn/ui
Auth/DB   : Firebase Auth + Firestore (프로젝트: clauze-prod)
AI        : Anthropic Claude API (claude-haiku-4-5-20251001)
결제       : Dodo Payments (MoR, 라이브 모드 전환 완료)
배포       : Vercel (Hobby)
애니메이션 : framer-motion
```

---

## 3. 디자인 시스템 (Rubicon)

```typescript
const T = {
  bgDark:   '#093944',   // 다크 배경 (네비바, 히어로 등)
  bgLight:  '#F6F7FB',   // 라이트 배경
  bgCard:   '#FFFFFF',   // 카드 배경
  teal:     '#00A599',   // 브랜드 틸
  tealBr:   '#00C2B5',   // 브라이트 틸 (강조)
  text:     '#042228',   // 본문 텍스트
  textMid:  '#3D5A5E',   // 보조 텍스트
  textLt:   '#7A9A9E',   // 연한 텍스트
  border:   'rgba(4,34,40,0.08)',
  borderDk: 'rgba(255,255,255,0.10)',
}

// 버튼: border-radius 28px (pill 형태)
// 카드: border-radius 4px
// 폰트: DM Sans (헤드라인 800) + DM Mono (숫자/레이블)
// Eyebrow: 12px / font-weight 700 / letter-spacing 1.8px / uppercase / teal
```

---

## 4. 현재 환경변수 (.env.local 및 Vercel)

```bash
# ===== Dodo Payments (라이브 모드 — 전환 완료) =====
DODO_PAYMENTS_API_KEY=sk_live_T8dmO42fBAZdmWwh.sVqjfaAcwTQ0hZWRBwahmnAjh9XvR8JAuppq1Fo_7T8EnPQE
DODO_PAYMENTS_WEBHOOK_KEY=whsec_/+ikpng+n/ndVpvGGCrrNNe/6Wyi/R4c
DODO_PAYMENTS_ENVIRONMENT=live_mode
DODO_PAYMENTS_RETURN_URL=https://clauze-ai.vercel.app/payment/success
DODO_PRODUCT_SINGLE=pdt_0NcRAvf2yGVbOSQOYUDGq
DODO_PRODUCT_PRO=pdt_0NcRC6xd9eGOgFDHjNBVy
DODO_PRODUCT_BUSINESS=pdt_0NcRCVmPmMtkuzN8xoj8q

# ===== Firebase Admin =====
FIREBASE_ADMIN_PROJECT_ID=clauze-prod
FIREBASE_ADMIN_CLIENT_EMAIL=[서비스 계정 이메일]
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n"

# ===== Anthropic =====
ANTHROPIC_API_KEY=sk-ant-[키값]

# ===== App URL =====
NEXT_PUBLIC_APP_URL=https://clauze-ai.vercel.app

# ===== Firebase 클라이언트 (NEXT_PUBLIC) =====
NEXT_PUBLIC_FIREBASE_API_KEY=[값]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[값]
NEXT_PUBLIC_FIREBASE_PROJECT_ID=clauze-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[값]
```

### ⚠️ Firebase Private Key 주의사항

```bash
# Vercel에서 저장 시: 실제 줄바꿈(\n)으로 저장됨 → 코드에서 그대로 사용
# .env.local에서 저장 시: \n 이스케이프 문자로 저장됨 → 코드에서 변환 필요

# firebase-admin.ts에서 두 경우 모두 처리:
const privateKey = rawKey.includes('\\n')
  ? rawKey.replace(/\\n/g, '\n')  // .env.local 방식
  : rawKey                         // Vercel 방식 (이미 실제 줄바꿈)
```

---

## 5. 주요 파일 구조

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts        ← Dodo 결제 세션 생성
│   │   ├── webhook/route.ts         ← Dodo 웹훅 처리 (Svix 헤더 지원)
│   │   ├── review/route.ts          ← AI 계약서 분석 (Anthropic)
│   │   └── cancel-subscription/     ← 구독 취소 API
│   ├── (app)/dashboard/page.tsx     ← 대시보드
│   ├── payment/success/page.tsx     ← 결제 완료 페이지
│   ├── pricing/page.tsx             ← 가격 페이지
│   └── (legal)/
│       ├── terms/page.tsx           ← 이용약관 (KO/EN 토글)
│       ├── privacy/page.tsx         ← 개인정보처리방침 (KO/EN 토글)
│       └── refund/page.tsx          ← 환불정책 (KO/EN 토글, Dodo 심사용)
├── lib/
│   ├── firebase-admin.ts            ← Firebase Admin 초기화 (핵심)
│   ├── dodo.ts                      ← Dodo SDK 클라이언트 초기화
│   ├── plan-guard.ts                ← 플랜별 권한 관리
│   └── config.ts                    ← APP_URL 등 중앙 설정
├── hooks/
│   └── useAuth.ts                   ← Firebase Auth + 유저 문서 생성
├── components/
│   ├── pricing/CheckoutButton.tsx   ← 결제 버튼 컴포넌트
│   └── dashboard/SubscriptionManager.tsx ← 구독 관리 컴포넌트
└── public/
    └── clauzeintro.webm             ← GET SUPPORT 버튼 영상
```

---

## 6. Pricing 플랜 구조 (확정)

| 플랜 | 가격 | 핵심 기능 |
|---|---|---|
| Free | ₩0/월 | 월 **1건** 검토 |
| Single Review | ₩9,900/**건** | 단건, 크레딧 방식 |
| Pro | ₩17,000/월 | 무제한 검토 (MOST POPULAR) |
| Business | ₩79,000/월 | 팀 기능 (현재 준비 중) |

---

## 7. Firestore users 문서 구조

```typescript
interface UserDocument {
  email: string
  plan: 'free' | 'single' | 'pro' | 'business'
  monthlyReviewCount: number       // 이번 달 사용 건수
  singleReviewCredits: number      // 단건 크레딧 잔여
  subscriptionId: string           // Dodo subscription_id
  subscriptionStatus: 'active' | 'cancelled' | null
  currentPeriodEnd: string | null  // 구독 만료일
  lastReviewMonth: string          // 'YYYY-M' 형식, 월 리셋용
  createdAt: Date
  updatedAt: Date
}
```

### Firebase 현재 상태 (2026-04-28 기준)

| 이메일 | 플랜 | 비고 |
|---|---|---|
| postaiji9@naver.com | pro | 대표 계정 (테스트용) |
| postaiji9@gmail.com | free | 대표 Google 계정 |

---

## 8. 결제 플로우 (완전 구현 완료)

```
[유저] "Pro 시작하기" 클릭
      ↓
CheckoutButton.tsx
→ Firebase getIdToken(true)
→ POST /api/checkout { planType, userEmail, userName }
      ↓
/api/checkout/route.ts
→ Firebase Admin으로 토큰 검증 (uid 추출)
→ planType에 따라 분기:
  - single: dodo.payments.create({ payment_link: true, ... })
  - pro/business: dodo.subscriptions.create({ payment_link: true, ... })
→ { checkoutUrl } 반환
      ↓
[유저] Dodo 결제 페이지에서 카드 입력
      ↓
결제 완료 → /payment/success?type=pro 리다이렉트
      ↓
[비동기] Dodo Webhook → /api/webhook
→ Svix 헤더 검증 (svix-id, svix-signature, svix-timestamp)
→ email로 Firestore users 조회
→ 이벤트 처리:
  - payment.succeeded  → singleReviewCredits +1
  - subscription.active / subscription.renewed → plan: 'pro'/'business'
  - subscription.cancelled / subscription.failed → plan: 'free'
```

---

## 9. 핵심 파일 구현 내용

### 9-1. src/lib/firebase-admin.ts

```typescript
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  const rawKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY || ''

  // Vercel: 실제 줄바꿈으로 저장 / .env.local: \n 이스케이프로 저장
  const privateKey = rawKey.includes('\\n')
    ? rawKey.replace(/\\n/g, '\n')
    : rawKey

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:
        process.env.FIREBASE_ADMIN_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID,
      clientEmail:
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    } as admin.ServiceAccount),
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
```

### 9-2. src/lib/dodo.ts

```typescript
// src/lib/dodo.ts
import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode'
    ? 'live_mode'
    : 'test_mode',
})

export const PRODUCTS = {
  single: process.env.DODO_PRODUCT_SINGLE!,
  pro: process.env.DODO_PRODUCT_PRO!,
  business: process.env.DODO_PRODUCT_BUSINESS!,
} as const
```

### 9-3. src/app/api/webhook/route.ts (핵심 — Svix 헤더 지원)

```typescript
// Dodo는 Svix 형식 헤더 사용 (svix-id, svix-signature, svix-timestamp)
// standardwebhooks는 webhook-id 형식 요구
// → Svix 헤더를 standardwebhooks 형식으로 매핑

const webhookId =
  headersList.get('webhook-id') ||
  headersList.get('svix-id') || ''

const webhookSignature =
  headersList.get('webhook-signature') ||
  headersList.get('svix-signature') || ''

const webhookTimestamp =
  headersList.get('webhook-timestamp') ||
  headersList.get('svix-timestamp') || ''
```

### 9-4. src/lib/plan-guard.ts

```typescript
export async function checkReviewPermission(uid: string) {
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const userData = userDoc.exists ? userDoc.data() || {} : {}

    const plan = userData.plan || 'free'
    const singleReviewCredits = userData.singleReviewCredits || 0
    const monthlyReviewCount = userData.monthlyReviewCount || 0

    // 이번 달 체크 (월이 바뀌면 카운트 리셋)
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`
    const lastReviewMonth = userData.lastReviewMonth || ''
    const effectiveCount = lastReviewMonth === currentMonth ? monthlyReviewCount : 0

    if (plan === 'pro' || plan === 'business') return { allowed: true }
    if (singleReviewCredits > 0) return { allowed: true, consumeCredit: true }
    if (plan === 'free' && effectiveCount < 1) return { allowed: true }

    return { allowed: false, reason: 'limit_exceeded' }
  } catch (error) {
    // Firestore 오류 시 신규 유저 보호 (허용)
    return { allowed: true }
  }
}
```

---

## 10. Dodo Payments 설정

### 계정 상태
- 계정 이메일: nextidealab.ai@gmail.com
- Verification 완료: Product ✅ / Identity ✅ / Business ✅ / Bank ✅
- **LIVE PAYMENTS ACTIVE** ✅
- 라이브 모드 전환 완료 (2026-04-28)

### Webhook 설정
```
URL: https://clauze-ai.vercel.app/api/webhook
이벤트: payment.succeeded
        subscription.active
        subscription.renewed
        subscription.cancelled
        subscription.failed
```

### API 키 형식
```bash
# 라이브 키: sk_live_T8dmO42f... (sk_live_ 접두사 있음)
# 테스트 키: 1U4AaegKI6z1... (접두사 없음)
# SDK에 그대로 전달 (접두사 제거 불필요)
```

---

## 11. 법적 문서 (이용약관/개인정보처리방침/환불정책)

| 경로 | 상태 | 비고 |
|---|---|---|
| /terms | 완료 ✅ | KO/EN 토글, 환불정책 포함 |
| /privacy | 완료 ✅ | KO/EN 토글, Dodo Payments 명시 |
| /refund | 완료 ✅ | Dodo 심사용 독립 페이지 |

**Dodo 심사 시 제출할 URL:**
- Policy URL: `https://clauze-ai.vercel.app/refund`
- Terms URL: `https://clauze-ai.vercel.app/terms`

---

## 12. 남은 작업 목록 (우선순위순)

### 🟡 UI/UX 수정

#### 1. GET SUPPORT 버튼 영상 모달 전체 통일
```
현재: 랜딩 페이지에서만 동작
목표: pricing, dashboard, 비로그인 페이지 모두 적용
방법: VideoSupportModal 공통 컴포넌트 생성 후 모든 GET SUPPORT 버튼에 연결
영상: public/clauzeintro.webm
```

#### 2. 랜딩 페이지 topbar LOGIN 버튼 숨김
```
문제: 로그인 후에도 상단 어두운 바에 LOGIN 버튼이 표시됨
수정: useAuth()로 user 상태 확인 후 로그인 시 숨기기
파일: 랜딩 페이지 Topbar 컴포넌트
```

#### 3. Pricing 페이지 topbar 수정
```
현재: 이메일 | DASHBOARD | GET SUPPORT
변경: 이메일 | GET SUPPORT | LOGOUT
```

#### 4. Business 플랜 버튼 비활성화
```
파일: src/app/pricing/page.tsx
- "Business 시작" 버튼 → disabled 처리
- 버튼 위 문구: "🛠️ 팀 기능 및 API는 현재 준비 중입니다."
               "Team & API features coming soon."
```

---

## 13. 개발 명령어

```bash
# 로컬 개발
npm run dev           # http://localhost:3000

# 빌드 검증
npx tsc --noEmit      # TypeScript 에러 확인
npm run build         # 프로덕션 빌드

# 배포 (Vercel 자동 배포)
git add -A
git commit -m "feat: 기능 설명"
git push              # → Vercel 자동 배포
```

---

## 14. 트러블슈팅 & 알려진 이슈

### Firebase Admin Private Key
```
증상: error:1E08010C:DECODER routines::unsupported
원인: Vercel이 \n을 실제 줄바꿈으로 저장
해결: rawKey.includes('\\n') ? replace : rawKey 로 두 경우 모두 처리
```

### Webhook 401 에러
```
증상: Missing required headers
원인: Dodo가 Svix 형식(svix-id)으로 전송, 코드가 webhook-id 기대
해결: svix-* 헤더와 webhook-* 헤더 둘 다 지원하도록 구현됨 (현재 완료)
```

### Dodo API 401
```
증상: POST test.dodopayments.com → Unauthorized
원인: API 키와 ENVIRONMENT 불일치 (live 키인데 test_mode, 또는 반대)
해결: DODO_PAYMENTS_API_KEY와 DODO_PAYMENTS_ENVIRONMENT 쌍을 반드시 맞춤
```

### Anthropic API 크레딧 부족
```
증상: Your credit balance is too low to access the Anthropic API
해결: console.anthropic.com → Plans & Billing → Add Credits
```

### 결제 후 플랜 미반영
```
원인: Webhook 헤더 불일치 또는 Firebase Admin 초기화 실패
확인: Vercel 로그에서 [Webhook] ✅ 플랜 업데이트 완료 로그 확인
해결: firebase-admin.ts의 \n 처리 및 webhook/route.ts Svix 헤더 지원
```

---

## 15. Vercel 로그에서 정상 동작 확인 방법

```
✅ 정상 결제 + 플랜 반영 시 로그:
[Firebase Admin] 초기화 성공
[Webhook] 헤더 수신: hasId: true, hasSignature: true
[Webhook] 이벤트: payment.succeeded / 이메일@주소.com
[Webhook] ✅ 단건 크레딧 +1 완료: 이메일@주소.com

또는

[Webhook] ✅ 플랜 업데이트 완료: 이메일@주소.com -> pro
```

---

## 16. 테스트 계정 정보

```
postaiji9@naver.com
- Firestore plan: "pro" (수동 설정)
- 이 계정으로 모든 기능 테스트 가능

postaiji9@gmail.com
- Firestore plan: "free"
- Google 로그인 테스트용
```

---

## 17. Dodo 테스트 카드 (테스트 모드에서만)

```
카드 번호: 4242 4242 4242 4242
만료일: 12/26 (미래 날짜 아무거나)
CVC: 123
이름: Test User
```

---

## 18. 주요 외부 서비스 대시보드 URL

```
Firebase Console: console.firebase.google.com/project/clauze-prod
Vercel 대시보드:  vercel.com/lalahahas-projects/clauze-ai
Dodo 대시보드:    app.dodopayments.com
Anthropic Console: console.anthropic.com
```

---

## 19. 코딩 컨벤션

```typescript
// 1. 파일 최상단에 경로 주석
// src/app/api/checkout/route.ts

// 2. 비즈니스 로직에 한국어 인라인 주석
// 단건 결제 — 크레딧 방식으로 처리
const payment = await dodo.payments.create({ ... })

// 3. TypeScript strict 준수 (any 타입 금지)
// 4. Rubicon 디자인 시스템 유지
// 5. try-catch 에러 처리 필수
// 6. 모든 API route는 Firebase Auth 토큰 검증 필수
```

---

## 20. 긴급 연락처 / 지원

```
Dodo Payments 지원: 대시보드 우측 하단 채팅 아이콘
Anthropic 지원: console.anthropic.com
Firebase 지원: console.firebase.google.com/support
운영자 이메일: nextidealab.ai@gmail.com
```

---

*이 문서는 2026-04-28 세션에서 작성된 인수인계 문서입니다.*
*Clauze는 현재 라이브 모드로 실제 결제가 가능한 상태입니다.*