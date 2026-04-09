// src/app/refund/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

// 디자인 토큰 (terms/privacy 페이지와 통일)
const R = {
  bgWhite:     "#FFFFFF",
  bgLight:     "#F6F7FB",
  bgDark:      "#093944",
  bgMid:       "#0D4F5C",
  tealBright:  "#00C2B5",
  tealMid:     "#00A599",
  tealDark:    "#00857C",
  tealBtn:     "#00C2B5",
  textDark:    "#042228",
  textMid:     "#3D5A5E",
  textLight:   "#7A9A9E",
  textWhite:   "#FFFFFF",
  borderLight: "rgba(4,34,40,0.1)",
  borderDark:  "rgba(255,255,255,0.15)",
  danger:      "#D94F3D",
  warning:     "#F59E0B",
  btnRadius:   "28px",
  cardRadius:  "4px",
  fontSans:    "'DM Sans', -apple-system, sans-serif",
  fontMono:    "'DM Mono', monospace",
};

type Lang = "ko" | "en";

// ── 공통 컴포넌트 ──────────────────────────────────────────────

// 섹션 카드 — 상단 컬러 보더 방식 (단건/구독 섹션용)
function SectionCard({
  title, accent = R.tealMid, children,
}: {
  title: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: R.bgWhite, borderRadius: R.cardRadius,
      borderTop: `3px solid ${accent}`,
      padding: "28px 32px", marginBottom: 20,
      boxShadow: "0 2px 12px rgba(4,34,40,0.07)",
    }}>
      <h2 style={{
        fontSize: 17, fontWeight: 800, color: R.textDark,
        margin: "0 0 20px", letterSpacing: "-0.02em", fontFamily: R.fontSans,
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: R.textMid, lineHeight: 1.85, fontFamily: R.fontSans }}>
        {children}
      </div>
    </div>
  );
}

// 좌측 teal 보더 카드 (전문 안내박스, 절차 섹션용)
function BorderCard({
  accent = R.tealMid, children, style,
}: {
  accent?: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: R.bgLight, borderRadius: R.cardRadius,
      borderLeft: `4px solid ${accent}`,
      padding: "20px 24px", marginBottom: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

// 번호 단계 행
function StepRow({
  step, title, children,
}: {
  step: number; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: R.bgDark,
        color: R.tealBright, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 800, flexShrink: 0, fontFamily: R.fontMono,
      }}>
        {step}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: R.textDark, marginBottom: 6, fontFamily: R.fontSans }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.8, fontFamily: R.fontSans }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// 체크/엑스 리스트 행
function ConditionRow({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
      <span style={{
        fontSize: 14, fontWeight: 700, flexShrink: 0, lineHeight: 1.6,
        color: ok ? R.tealMid : R.danger,
      }}>
        {ok ? "✓" : "✗"}
      </span>
      <span style={{ fontSize: 13, color: R.textMid, lineHeight: 1.7 }}>{children}</span>
    </div>
  );
}

// 소제목 레이블
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
      textTransform: "uppercase" as const, color: R.tealDark,
      fontFamily: R.fontMono, marginTop: 18, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

// InfoTable 하단 정보 박스
function InfoTable({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <div style={{
      background: R.bgWhite, borderRadius: R.cardRadius,
      border: `1px solid ${R.borderLight}`,
      overflow: "hidden", marginTop: 32,
      boxShadow: "0 2px 12px rgba(4,34,40,0.07)",
    }}>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "160px 1fr",
          borderBottom: i < rows.length - 1 ? `1px solid ${R.borderLight}` : undefined,
        }}>
          <div style={{
            padding: "12px 20px", background: R.bgLight,
            fontSize: 11, fontWeight: 700, color: R.textLight,
            letterSpacing: "1px", textTransform: "uppercase" as const,
            fontFamily: R.fontMono, display: "flex", alignItems: "center",
          }}>
            {row.label}
          </div>
          <div style={{
            padding: "12px 20px", fontSize: 13, color: R.textDark,
            fontFamily: R.fontSans, display: "flex", alignItems: "center",
          }}>
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 페이지 ─────────────────────────────────────────────────────

export default function RefundPage() {
  const [lang, setLang] = useState<Lang>("ko"); // 언어 상태

  return (
    <div style={{ background: R.bgLight, minHeight: "100vh", fontFamily: R.fontSans }}>

      {/* ── Nav ── */}
      <nav style={{
        background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`,
        padding: "0 40px", display: "flex", alignItems: "center", gap: 24, height: 68,
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(4,34,40,0.06)",
      }}>
        {/* 로고 */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2" />
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn} />
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark} />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
            CLAUZE
          </span>
        </Link>

        <div style={{ width: 1, height: 20, background: R.borderLight }} />
        <span style={{ fontSize: 13, color: R.textLight }}>
          {lang === "ko" ? "환불정책" : "Refund Policy"}
        </span>

        <div style={{ flex: 1 }} />

        {/* 이용약관 링크 */}
        <Link href="/terms" style={{ fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 500 }}>
          {lang === "ko" ? "이용약관 →" : "Terms →"}
        </Link>

        {/* KO/EN 토글 */}
        <div style={{ display: "flex", gap: 4, background: "rgba(9,57,68,0.08)", borderRadius: 28, padding: 3 }}>
          {(["ko", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "5px 14px", borderRadius: 24, border: "none",
                background: lang === l ? R.tealMid : "transparent",
                color: lang === l ? "#FFFFFF" : R.textMid,
                fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                fontFamily: R.fontSans,
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 홈 링크 */}
        <Link
          href="/"
          style={{
            background: "none", border: `1px solid ${R.borderLight}`,
            borderRadius: R.btnRadius, padding: "7px 18px",
            fontSize: 13, color: R.textMid, fontWeight: 600, textDecoration: "none",
          }}
        >
          {lang === "ko" ? "← Clauze 홈으로" : "← Home"}
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div style={{ background: R.bgDark, padding: "56px 40px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", right: "-5%", top: "-30%", width: "30%", height: "160%",
          borderRadius: "50%", background: "rgba(0,165,153,0.06)", filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase" as const, color: R.tealBright,
            marginBottom: 14, fontFamily: R.fontMono,
          }}>
            REFUND POLICY
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: R.textWhite, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {lang === "ko" ? "환불정책" : "Refund Policy"}
          </h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
                {lang === "ko" ? "시행일" : "Effective"}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>
                {lang === "ko" ? "2026년 4월 1일" : "April 1, 2026"}
              </span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
                {lang === "ko" ? "결제 수단" : "Payment"}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>
                Dodo Payments
              </span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <span style={{
              fontSize: 11, fontWeight: 700, background: "rgba(0,194,181,0.2)",
              color: R.tealBright, padding: "3px 10px", borderRadius: 12, fontFamily: R.fontMono,
            }}>
              v1.1
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* 섹션 0 — 전문 안내박스 */}
        <BorderCard accent={R.tealMid} style={{ marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 14, color: R.textMid, lineHeight: 1.85, fontFamily: R.fontSans }}>
            {lang === "ko" ? (
              <>
                Clauze는 AI 기반 디지털 계약서 분석 서비스입니다.<br />
                아래 환불정책은 결제 유형(단건/구독)에 따라 다르게 적용됩니다.<br />
                <strong style={{ color: R.textDark }}>결제 전 반드시 전문을 확인해주세요.</strong>
              </>
            ) : (
              <>
                Clauze is an AI-powered digital contract review service.<br />
                The refund policy below varies by payment type (single review vs. subscription).<br />
                <strong style={{ color: R.textDark }}>Please read the full policy before completing your purchase.</strong>
              </>
            )}
          </p>
        </BorderCard>

        {/* 섹션 1 — 단건 결제 환불 */}
        {lang === "ko" ? (
          <SectionCard title="단건 결제 환불 기준" accent={R.warning}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: R.textLight, fontFamily: R.fontMono }}>
              대상: Single Review (₩9,900/건)
            </p>

            <Label>환불 가능 조건 (모두 충족 필요)</Label>
            <ConditionRow ok={true}>결제일로부터 7일 이내</ConditionRow>
            <ConditionRow ok={true}>AI 분석이 한 번도 실행되지 않은 경우</ConditionRow>

            <Label>환불 불가 조건</Label>
            <ConditionRow ok={false}>
              AI 계약서 분석이 1회라도 실행된 경우
              <span style={{ display: "block", fontSize: 12, color: R.textLight, marginTop: 3 }}>
                (검토 버튼 클릭 → AI 호출 시작 시점 = 이용 시작)
              </span>
            </ConditionRow>
            <ConditionRow ok={false}>결제일로부터 7일 초과</ConditionRow>
            <ConditionRow ok={false}>동일 결제건 재요청</ConditionRow>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 12, marginTop: 20,
            }}>
              <div style={{ background: R.bgLight, borderRadius: 4, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: R.textLight, fontFamily: R.fontMono, letterSpacing: "1px", marginBottom: 6 }}>환불 금액</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: R.textDark }}>전액 환불 (수수료 없음)</div>
              </div>
              <div style={{ background: R.bgLight, borderRadius: 4, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: R.textLight, fontFamily: R.fontMono, letterSpacing: "1px", marginBottom: 6 }}>처리 기간</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: R.textDark }}>영업일 기준 5~10일</div>
              </div>
            </div>

            <p style={{ marginTop: 16, marginBottom: 0, fontSize: 12, color: R.textLight, lineHeight: 1.7 }}>
              법적 근거: 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호
            </p>
          </SectionCard>
        ) : (
          <SectionCard title="Single Review Refund Policy" accent={R.warning}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: R.textLight, fontFamily: R.fontMono }}>
              Applicable to: Single Review (₩9,900 per review)
            </p>

            <Label>Eligible for refund (all conditions must be met)</Label>
            <ConditionRow ok={true}>Within 7 days of payment</ConditionRow>
            <ConditionRow ok={true}>AI analysis has not been executed</ConditionRow>

            <Label>Not eligible</Label>
            <ConditionRow ok={false}>
              AI analysis executed even once
              <span style={{ display: "block", fontSize: 12, color: R.textLight, marginTop: 3 }}>
                (Clicking &apos;Review&apos; and initiating AI = service used)
              </span>
            </ConditionRow>
            <ConditionRow ok={false}>More than 7 days since payment</ConditionRow>
            <ConditionRow ok={false}>Same transaction already refunded</ConditionRow>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              <div style={{ background: R.bgLight, borderRadius: 4, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: R.textLight, fontFamily: R.fontMono, letterSpacing: "1px", marginBottom: 6 }}>REFUND AMOUNT</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: R.textDark }}>Full refund, no fees</div>
              </div>
              <div style={{ background: R.bgLight, borderRadius: 4, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: R.textLight, fontFamily: R.fontMono, letterSpacing: "1px", marginBottom: 6 }}>PROCESSING TIME</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: R.textDark }}>5–10 business days</div>
              </div>
            </div>

            <p style={{ marginTop: 16, marginBottom: 0, fontSize: 12, color: R.textLight, lineHeight: 1.7 }}>
              Legal basis: Act on Consumer Protection in Electronic Commerce, Article 17(2)(5)
            </p>
          </SectionCard>
        )}

        {/* 섹션 2 — 구독 결제 환불 */}
        {lang === "ko" ? (
          <SectionCard title="구독 결제 환불 기준" accent={R.tealMid}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: R.textLight, fontFamily: R.fontMono }}>
              대상: Pro (₩17,000/월), Business (₩79,000/월)
            </p>

            <Label>기본 원칙</Label>
            <div style={{
              background: R.bgLight, borderRadius: 4, padding: "14px 18px",
              fontSize: 13, color: R.textMid, lineHeight: 1.8, marginBottom: 16,
            }}>
              구독 해지 시 남은 기간에 대한 요금은 환불되지 않습니다.<br />
              해지 후 현재 결제 기간 만료일까지 서비스를 계속 이용하실 수 있습니다.
            </div>

            <Label>예외적 환불 조건</Label>

            {/* 예외 ① */}
            <div style={{
              border: `1px solid ${R.borderLight}`, borderLeft: `3px solid ${R.tealMid}`,
              borderRadius: 4, padding: "14px 18px", marginBottom: 10,
              background: "rgba(0,165,153,0.03)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 8 }}>① 회사 귀책 서비스 장애</div>
              <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75 }}>
                연속 24시간 이상 서비스 이용 불가 시<br />
                → 이용 불가 기간에 비례한 부분 환불
              </div>
            </div>

            {/* 예외 ② */}
            <div style={{
              border: `1px solid ${R.borderLight}`, borderLeft: `3px solid ${R.tealMid}`,
              borderRadius: 4, padding: "14px 18px", marginBottom: 10,
              background: "rgba(0,165,153,0.03)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 8 }}>② 이중 청구</div>
              <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75 }}>
                동일 기간 중복 결제 확인 시 → 전액 환불
              </div>
            </div>

            {/* 예외 ③ */}
            <div style={{
              border: `1px solid ${R.borderLight}`, borderLeft: `3px solid ${R.tealMid}`,
              borderRadius: 4, padding: "14px 18px", marginBottom: 16,
              background: "rgba(0,165,153,0.03)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 8 }}>③ 시스템 오류로 인한 부정 결제</div>
              <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75 }}>
                → 전액 환불
              </div>
            </div>

            <Label>구독 취소 방법</Label>
            <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.8, marginBottom: 12 }}>
              계정 설정 → 구독 관리 → "구독 취소"<br />
              또는 이메일:{" "}
              <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>
                nextidealab.ai@gmail.com
              </a>
            </div>

            <div style={{ background: R.bgLight, borderRadius: 4, padding: "10px 16px", fontSize: 12, color: R.textLight }}>
              환불 처리 기간: 영업일 기준 5~10일
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="Subscription Refund Policy" accent={R.tealMid}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: R.textLight, fontFamily: R.fontMono }}>
              Applicable to: Pro (₩17,000/month), Business (₩79,000/month)
            </p>

            <Label>General Policy</Label>
            <div style={{
              background: R.bgLight, borderRadius: 4, padding: "14px 18px",
              fontSize: 13, color: R.textMid, lineHeight: 1.8, marginBottom: 16,
            }}>
              No refund for unused days upon cancellation.<br />
              Your plan remains active until the end of the current billing period.
            </div>

            <Label>Exceptional Refund Conditions</Label>

            <div style={{
              border: `1px solid ${R.borderLight}`, borderLeft: `3px solid ${R.tealMid}`,
              borderRadius: 4, padding: "14px 18px", marginBottom: 10,
              background: "rgba(0,165,153,0.03)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 8 }}>① Service Outage (Our Fault)</div>
              <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75 }}>
                Continuous unavailability of 24+ hours<br />
                → Prorated refund for the affected period
              </div>
            </div>

            <div style={{
              border: `1px solid ${R.borderLight}`, borderLeft: `3px solid ${R.tealMid}`,
              borderRadius: 4, padding: "14px 18px", marginBottom: 10,
              background: "rgba(0,165,153,0.03)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 8 }}>② Duplicate Charge</div>
              <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75 }}>
                Confirmed double billing for the same period → Full refund
              </div>
            </div>

            <div style={{
              border: `1px solid ${R.borderLight}`, borderLeft: `3px solid ${R.tealMid}`,
              borderRadius: 4, padding: "14px 18px", marginBottom: 16,
              background: "rgba(0,165,153,0.03)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 8 }}>③ Unauthorized Charge (System Error)</div>
              <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75 }}>
                → Full refund
              </div>
            </div>

            <Label>How to Cancel</Label>
            <div style={{ fontSize: 13, color: R.textMid, lineHeight: 1.8, marginBottom: 12 }}>
              Account Settings → Subscription → &quot;Cancel Subscription&quot;<br />
              Or email:{" "}
              <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>
                nextidealab.ai@gmail.com
              </a>
            </div>

            <div style={{ background: R.bgLight, borderRadius: 4, padding: "10px 16px", fontSize: 12, color: R.textLight }}>
              Processing time: 5–10 business days
            </div>
          </SectionCard>
        )}

        {/* 섹션 3 — 환불 요청 절차 */}
        {lang === "ko" ? (
          <SectionCard title="환불 요청 절차" accent={R.bgDark}>
            <StepRow step={1} title="이메일 발송">
              <div>수신:{" "}
                <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>
                  nextidealab.ai@gmail.com
                </a>
              </div>
              <div>제목: [Clauze 환불요청] 결제 이메일 주소</div>
              <div style={{ marginTop: 8, color: R.textLight, fontSize: 12 }}>
                필수 내용: 결제 이메일 / 결제 일시 / 결제 유형(단건/Pro/Business) / 환불 사유
              </div>
            </StepRow>
            <StepRow step={2} title="접수 확인">
              영업일 기준 1~2일 내 확인 이메일 발송
            </StepRow>
            <StepRow step={3} title="검토 및 처리">
              승인 시 5~10 영업일 내 환불 처리
            </StepRow>
            <StepRow step={4} title="계좌 반영">
              카드사 정책에 따라 추가 소요 가능 (통상 3~5 영업일)
            </StepRow>
            <div style={{
              background: R.bgLight, borderRadius: 4, padding: "10px 16px",
              fontSize: 12, color: R.textLight, marginTop: 4,
            }}>
              문의 가능 시간: 평일 10:00~18:00 KST
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="How to Request a Refund" accent={R.bgDark}>
            <StepRow step={1} title="Send an Email">
              <div>To:{" "}
                <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>
                  nextidealab.ai@gmail.com
                </a>
              </div>
              <div>Subject: [Clauze Refund Request] Your payment email</div>
              <div style={{ marginTop: 8, color: R.textLight, fontSize: 12 }}>
                Include: Payment email / Payment date / Plan type / Reason for refund
              </div>
            </StepRow>
            <StepRow step={2} title="Confirmation">
              We&apos;ll reply within 1–2 business days
            </StepRow>
            <StepRow step={3} title="Review & Processing">
              If approved, processed within 5–10 business days
            </StepRow>
            <StepRow step={4} title="Credit to Account">
              Additional 3–5 business days depending on your card issuer
            </StepRow>
            <div style={{
              background: R.bgLight, borderRadius: 4, padding: "10px 16px",
              fontSize: 12, color: R.textLight, marginTop: 4,
            }}>
              Support hours: Weekdays 10:00–18:00 KST
            </div>
          </SectionCard>
        )}

        {/* 섹션 4 — 소비자 권익 보호 */}
        {lang === "ko" ? (
          <SectionCard title="소비자 권익 보호" accent={R.tealDark}>
            <p style={{ margin: "0 0 16px", lineHeight: 1.85 }}>
              이 환불정책은 대한민국 전자상거래법 및 소비자보호법에 따라 수립되었습니다.<br />
              법령에서 정한 소비자 권익보다 불리한 내용이 있을 경우 법령이 우선 적용됩니다.
            </p>
            <Label>분쟁 조정 기관</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["한국소비자원", "www.kca.go.kr", "1372"],
                ["공정거래위원회", "www.ftc.go.kr", null],
                ["전자거래분쟁조정위원회", "www.ecmc.or.kr", null],
              ].map(([name, url, tel]) => (
                <div key={name as string} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: R.textDark, minWidth: 160 }}>{name}</span>
                  <span style={{ color: R.textLight }}>{url}{tel ? ` / ${tel}` : ""}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="Consumer Rights" accent={R.tealDark}>
            <p style={{ margin: "0 0 16px", lineHeight: 1.85 }}>
              This refund policy is established in compliance with Korean e-commerce and consumer protection law.<br />
              Statutory consumer rights take precedence over this policy where applicable.
            </p>
            <Label>Dispute Resolution Authorities (Korea)</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Korea Consumer Agency", "www.kca.go.kr"],
                ["Fair Trade Commission", "www.ftc.go.kr"],
                ["E-Commerce Mediation Committee", "www.ecmc.or.kr"],
              ].map(([name, url]) => (
                <div key={name} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: R.textDark, minWidth: 200 }}>{name}</span>
                  <span style={{ color: R.textLight }}>{url}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* InfoTable — 하단 정보 */}
        {lang === "ko" ? (
          <InfoTable
            rows={[
              { label: "회사명",    value: "(주)루시퍼" },
              { label: "서비스명",  value: "Clauze (clauze.io)" },
              { label: "결제 수단", value: "Dodo Payments" },
              { label: "환불 문의", value: <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>nextidealab.ai@gmail.com</a> },
              { label: "시행일",    value: "2026년 4월 1일" },
              { label: "관련 조항", value: <Link href="/terms#art6" style={{ color: R.tealMid, textDecoration: "none" }}>이용약관 제6조 →</Link> },
            ]}
          />
        ) : (
          <InfoTable
            rows={[
              { label: "Company",         value: "Lucifer Co., Ltd." },
              { label: "Service",         value: "Clauze (clauze.io)" },
              { label: "Payment",         value: "Dodo Payments" },
              { label: "Refund Contact",  value: <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>nextidealab.ai@gmail.com</a> },
              { label: "Effective",       value: "April 1, 2026" },
              { label: "Related",         value: <Link href="/terms#art6" style={{ color: R.tealMid, textDecoration: "none" }}>Terms of Service Article 6 →</Link> },
            ]}
          />
        )}

        {/* 관련 문서 링크 */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" as const }}>
          <Link href="/terms" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: R.btnRadius,
            border: `1px solid ${R.borderLight}`, background: R.bgWhite,
            fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 600,
          }}>
            {lang === "ko" ? "← 이용약관" : "← Terms of Service"}
          </Link>
          <Link href="/privacy" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: R.btnRadius,
            border: `1px solid ${R.borderLight}`, background: R.bgWhite,
            fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 600,
          }}>
            {lang === "ko" ? "개인정보처리방침 →" : "Privacy Policy →"}
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: R.bgDark, padding: "32px 40px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap" as const, gap: 16,
        }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            © 2026 Clauze. (주)루시퍼. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            <Link href="/terms"   style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              {lang === "ko" ? "이용약관" : "Terms"}
            </Link>
            <Link href="/privacy" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              {lang === "ko" ? "개인정보처리방침" : "Privacy"}
            </Link>
            <Link href="/refund"  style={{ color: R.tealBright, textDecoration: "none", fontWeight: 600 }}>
              {lang === "ko" ? "환불정책" : "Refund Policy"}
            </Link>
            <a href="mailto:nextidealab.ai@gmail.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              nextidealab.ai@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
