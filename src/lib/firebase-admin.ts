// src/lib/firebase-admin.ts
// Firebase Admin SDK (서버 전용 - 절대 클라이언트에서 import 금지)

import * as admin from "firebase-admin";

// Admin SDK 중복 초기화 방지
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

    // 환경 변수 검증
    if (!projectId || !clientEmail || !privateKey) {
      console.warn(
        "⚠️ Firebase Admin 환경 변수가 완전하지 않습니다. Firestore 저장 기능이 비활성화됩니다.",
        {
          projectId: !!projectId,
          clientEmail: !!clientEmail,
          privateKey: !!privateKey,
        }
      );
      // 더미 앱 초기화 (에러 방지)
      admin.initializeApp({
        projectId: "dummy-project",
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  } catch (err) {
    console.error("Firebase Admin 초기화 실패:", err);
    // 빌드 실패 방지를 위해 더미 초기화
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: "dummy-project",
      });
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
