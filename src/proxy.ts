// src/proxy.ts
// 라우트 보호 미들웨어

import { NextRequest, NextResponse } from "next/server";

// 인증 필요한 라우트
const protectedRoutes = ["/dashboard", "/review"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 보호된 라우트 확인
  const isProtected = protectedRoutes.some(route => path.startsWith(route));

  if (isProtected) {
    // Firebase Auth 토큰 확인
    // 클라이언트 사이드 Auth에서는 미들웨어 단계에서 검증 불가능
    // 따라서 클라이언트 훅(useAuth)에서 처리
    // 서버 사이드 검증이 필요하면 추후 추가
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/review/:path*"],
};
