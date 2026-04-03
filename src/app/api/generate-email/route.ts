// src/app/api/generate-email/route.ts
// 협상 이메일 생성 엔드포인트 - 로그인 유저만 접근 가능

import { NextRequest, NextResponse } from "next/server";
import { generateNegotiationEmail } from "@/lib/email-template";
import { ClauseResult } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      clause: ClauseResult;
      contractFileName: string;
      userId?: string;
    };

    // 인증 확인 - userId 없으면 401 반환
    if (!body.userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { clause, contractFileName } = body;

    // 필수 파라미터 검증
    if (!clause?.title || !contractFileName) {
      return NextResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 이메일 생성 (실패 시 내부에서 폴백 처리)
    const result = await generateNegotiationEmail(clause, contractFileName);

    return NextResponse.json(result);
  } catch (error) {
    console.error("generate-email API error:", error);
    return NextResponse.json(
      { error: "이메일 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
