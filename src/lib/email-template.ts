// src/lib/email-template.ts
// Claude API 호출로 협상 이메일 생성, 실패 시 폴백 템플릿 반환

import Anthropic from "@anthropic-ai/sdk";
import { ClauseResult } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// API 호출 실패 시 사용할 기본 이메일 템플릿
function fallbackTemplate(clause: ClauseResult): { email_ko: string; email_en: string } {
  return {
    email_ko: `안녕하세요.

계약서 검토 중 ${clause.title} 조항에 대해 수정을 요청드리고자 합니다.

${clause.content_ko}

${clause.action ? `요청사항: ${clause.action}` : "해당 조항의 수정안을 제안해 주시기 바랍니다."}

이 점 검토하여 수정안을 보내주시면 감사하겠습니다.

감사합니다.`,
    email_en: `Dear [Name],

I am writing regarding ${clause.title} in our contract.

${clause.content_en}

${clause.action_en ?? clause.action ?? "I would like to request a revision to this clause."}

Please review and send a revised version at your earliest convenience.

Best regards,
[Your Name]`,
  };
}

export async function generateNegotiationEmail(
  clause: ClauseResult,
  contractFileName: string
): Promise<{ email_ko: string; email_en: string }> {
  // API 키 없으면 바로 폴백
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackTemplate(clause);
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system:
        '당신은 계약서 협상 전문가입니다. 불리한 조항에 대해 정중하고 전문적인 수정 요청 이메일을 작성합니다. 반드시 JSON만 출력하세요: { "email_ko": "...", "email_en": "..." }',
      messages: [
        {
          role: "user",
          content: `계약서: ${contractFileName}
조항: ${clause.title}
문제점: ${clause.content_ko}
권고 액션: ${clause.action ?? "수정 요청"}

위 조항에 대한 수정 요청 이메일을 작성해주세요.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") return fallbackTemplate(clause);

    // 마크다운 코드 블록 제거 후 JSON 파싱
    const jsonText = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(jsonText) as { email_ko: string; email_en: string };

    // 필수 필드 누락 시 폴백
    if (!parsed.email_ko || !parsed.email_en) return fallbackTemplate(clause);

    return parsed;
  } catch {
    // API 호출 실패 시 에러 노출 없이 폴백 반환
    return fallbackTemplate(clause);
  }
}
