// src/lib/claude.ts
// Claude API 래퍼 + 시스템 프롬프트 (Prompt Caching 포함)

import Anthropic from "@anthropic-ai/sdk";
import { ReviewResult } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 시스템 프롬프트 - 한국 계약법 전문 리뷰어 역할 정의
const SYSTEM_PROMPT = `당신은 한국 계약법 전문 리뷰어입니다. 업로드된 계약서를 분석하여 위험 조항을 식별하고 구조화된 JSON으로 결과를 반환합니다.

[면책 조항] 본 서비스는 법적 조언을 제공하지 않습니다. AI의 검토 결과는 참고용이며, 중요한 계약은 반드시 법률 전문가와 상담하시기 바랍니다. This service does not provide legal advice.

[출력 규칙]
- 반드시 아래 JSON 스키마 형식으로만 응답하세요
- 계약서 원문에 없는 내용을 추가하거나 추측하지 마세요
- 모든 content_ko는 한국어로, content_en은 영어로 작성하세요
- 위험도(risk)는 반드시 "high", "medium", "low" 중 하나여야 합니다
- action은 구체적인 협상/수정 권고사항이며, 문제없는 조항은 null로 설정하세요

[JSON 스키마]
{
  "overallRisk": "high|medium|low",
  "summary_ko": "전체 계약서 위험도 요약 (한국어, 2-3문장)",
  "summary_en": "Overall contract risk summary in English (2-3 sentences)",
  "clauses": [
    {
      "title": "조항 제목 (예: 제7조 – 대금 지급 조건)",
      "content_ko": "해당 조항의 한국어 설명 및 위험 요소",
      "content_en": "English explanation of the clause and risk factors",
      "risk": "high|medium|low",
      "action": "협상 권고사항 (한국어) 또는 null",
      "action_en": "Negotiation recommendation in English, or null"
    }
  ]
}

위험도 판단 기준:
- high: 일방적 계약 변경, 과도한 IP 양도, 불합리한 위약금, 불법적 조항
- medium: 비대칭적 조건, 모호한 조항, 불리한 해지 조건
- low: 표준적이고 합리적인 조항

고위험 조항을 clauses 배열의 앞쪽에 배치하세요.

[출력 형식 엄수]
반드시 순수 JSON만 출력하세요. 설명, 마크다운, 코드블록 없이 JSON 객체만 반환하세요.
Output ONLY valid JSON. No explanation, no markdown, no code blocks. Start with { and end with }.`;

function safeParseJSON(text: string): unknown {
  // 1. 순수 JSON 파싱 시도
  try { return JSON.parse(text) } catch {}

  // 2. ```json ... ``` 블록 추출
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonBlock) {
    try { return JSON.parse(jsonBlock[1]) } catch {}
  }

  // 3. { } 범위 추출
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(text.substring(start, end + 1)) } catch {}
  }

  // 4. 모두 실패
  throw new Error(`JSON 파싱 실패. 응답 앞 200자: ${text.substring(0, 200)}`)
}

export async function reviewContract(
  pdfBase64: string,
  industryAddition?: string  // 업종별 추가 시스템 프롬프트
): Promise<ReviewResult> {
  // API 키 검증
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.");
  }

  // 업종 프롬프트가 있으면 기본 프롬프트에 append
  const effectivePrompt = industryAddition
    ? `${SYSTEM_PROMPT}\n${industryAddition}`
    : SYSTEM_PROMPT;

  try {
    // Claude API로 PDF 분석 (Prompt Caching으로 비용 90% 절감)
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      system: effectivePrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            {
              type: "text",
              text: "위 계약서를 분석하여 지정된 JSON 스키마 형식으로 위험 조항을 식별하고 결과를 반환해주세요. JSON 외의 텍스트는 포함하지 마세요.",
            },
          ],
        },
      ],
    });

    // JSON 응답 파싱
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Claude API가 예상하지 못한 형식으로 응답했습니다.");
    }

    const rawText = content.text.trim();
    if (!rawText) {
      throw new Error("Claude API에서 빈 응답을 받았습니다.");
    }

    let result: ReviewResult;
    try {
      result = safeParseJSON(rawText) as ReviewResult;
    } catch (parseErr) {
      console.error("JSON parsing failed. Response text:", rawText);
      throw new Error("AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.");
    }

    // 응답 스키마 검증
    if (!result.overallRisk || !result.summary_ko || !result.summary_en || !Array.isArray(result.clauses)) {
      throw new Error("AI 응답 형식이 올바르지 않습니다.");
    }

    return result;
  } catch (error) {
    // Anthropic SDK 에러 처리
    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("authentication")) {
        throw new Error("API 인증 실패. API 키를 확인해주세요.");
      }
      if (error.message.includes("429")) {
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
      if (error.message.includes("timeout")) {
        throw new Error("요청 시간 초과. 파일 크기를 줄여주세요.");
      }
      throw error;
    }
    throw new Error("계약서 검토 중 예상 못한 오류가 발생했습니다.");
  }
}
