// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  const rawKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY || ''

  // 앞뒤 따옴표 제거 (dotenv가 따옴표를 값으로 포함시키는 경우)
  const stripped = rawKey.replace(/^["']|["']$/g, '')

  // Vercel: 실제 줄바꿈으로 저장 → 그대로 사용
  // .env.local: \n 이스케이프로 저장 → 변환 필요
  const privateKey = stripped.includes('\\n')
    ? stripped.replace(/\\n/g, '\n')
    : stripped

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
