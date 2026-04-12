// src/app/api/debug-firebase/route.ts
// Firebase Admin 초기화 상태 진단 엔드포인트
// 배포 후 /api/debug-firebase 접속해서 결과 확인

import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      hasPrivateKey: !!(
        process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
        process.env.FIREBASE_PRIVATE_KEY
      ),
      hasProjectId: !!(
        process.env.FIREBASE_ADMIN_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID
      ),
      hasClientEmail: !!(
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        process.env.FIREBASE_CLIENT_EMAIL
      ),
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      // 키 앞 20자만 노출 (보안)
      privateKeyPreview: (() => {
        const k =
          process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
          process.env.FIREBASE_PRIVATE_KEY ||
          "";
        return k ? `${k.slice(0, 20)}... (len=${k.length})` : "MISSING";
      })(),
    },
    firebaseApps: admin.apps.length,
    firebaseInitialized: admin.apps.length > 0,
  };

  // Firestore 읽기 테스트
  if (admin.apps.length > 0) {
    try {
      const db = admin.firestore();
      // 가벼운 존재 여부 확인 (실제 문서 불필요)
      await db.collection("_ping").doc("_ping").get();
      result.firestoreTest = "OK";
    } catch (err) {
      result.firestoreTest = "FAIL";
      result.firestoreError =
        err instanceof Error ? err.message : String(err);
    }
  } else {
    result.firestoreTest = "SKIPPED (not initialized)";
  }

  return NextResponse.json(result, { status: 200 });
}
