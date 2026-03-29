// src/app/terms/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", borderLight: "rgba(4,34,40,0.1)", borderDark: "rgba(255,255,255,0.15)",
  danger: "#D94F3D", btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif", fontMono: "'DM Mono', monospace",
};

const TERMS_DATA = [
  {
    number: 1,
    title: "목적",
    content: `이 약관은 (주)루시퍼(이하 "회사")가 운영하는 Clauze(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.`,
  },
  {
    number: 2,
    title: "정의",
    content: `이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
• "서비스"란 회사가 제공하는 Clauze 플랫폼을 통한 한국어 계약서 AI 분석 서비스 및 관련 제반 서비스를 의미합니다.
• "이용자"란 이 약관에 따라 서비스에 접속하여 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
• "회원"이란 회사에 개인정보를 제공하여 회원 등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
• "유료 서비스"란 회사가 제공하는 서비스 중 별도의 요금을 지급하고 이용하는 서비스(Pro, Business 플랜 등)를 의미합니다.
• "콘텐츠"란 이용자가 서비스에 업로드하는 계약서 파일, 텍스트 등 일체의 정보를 의미합니다.
• "AI 분석 결과"란 이용자가 업로드한 계약서를 기반으로 AI가 생성한 분석 보고서 및 요약 정보를 의미합니다.`,
  },
  {
    number: 3,
    title: "약관의 효력 및 변경",
    content: `• 이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
• 회사는 합리적인 사유가 발생할 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.
• 중요한 약관 변경의 경우 시행일로부터 최소 30일 전에 공지합니다. 단, 이용자에게 불리한 변경의 경우에는 최소 30일 전 공지 후 이메일로 개별 통지합니다.
• 이용자는 변경된 약관에 동의하지 않을 권리가 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 변경된 약관에 동의한 것으로 간주됩니다.`,
  },
  {
    number: 4,
    title: "서비스의 제공 및 변경",
    content: `회사는 다음과 같은 서비스를 제공합니다:
• 한국어 계약서 PDF 업로드 및 AI 기반 위험 조항 분석
• 조항별 위험도 분류 (고위험 / 주의 / 정상) 및 한국어·영어 동시 요약
• 검토 이력 저장 및 관리
• 기타 회사가 추가 개발하거나 제휴를 통해 제공하는 일체의 서비스

[서비스 플랜]
• Free: 무료, 월 2건 검토, 한국어 요약 제공
• Pro: 월 19,000원, 무제한 검토, 한/영 번역, 위험 조항 하이라이트
• Business: 월 79,000원, 팀 5인, 커스텀 체크리스트, 우선 처리

회사는 서비스의 내용, 요금 등을 변경할 수 있으며, 변경 시 30일 전에 공지합니다.`,
  },
  {
    number: 5,
    title: "회원가입 및 계정 관리",
    content: `• 이용자는 회사가 정한 가입 양식에 따라 회원 정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
• 회원은 자신의 계정 정보를 관리할 책임이 있으며, 제3자에게 계정 정보를 제공하거나 공유하여서는 안 됩니다.
• 회원은 계정 정보가 도용되거나 제3자가 사용하고 있음을 인지한 경우 즉시 회사에 통보하고 회사의 안내에 따라야 합니다.
• 만 14세 미만의 아동은 회원가입을 할 수 없습니다.`,
  },
  {
    number: 6,
    title: "유료 서비스 및 결제",
    content: `• 유료 서비스 이용을 위해서는 사전에 요금을 납부하여야 합니다.
• 결제는 Stripe를 통한 신용카드/체크카드 결제를 지원합니다.
• 구독형 유료 서비스는 매월 자동 갱신됩니다. 이용자는 갱신일 전 언제든지 해지할 수 있습니다.
• 해지 시 남은 기간에 대한 요금은 환불되지 않으며, 해지 시점부터 다음 갱신일까지 서비스를 계속 이용할 수 있습니다.
• 회사의 귀책사유로 서비스 이용이 불가한 경우 해당 기간에 대한 요금을 환불합니다.
• 결제와 관련한 분쟁은 이용자와 카드사 간에 해결하는 것을 원칙으로 하되, 회사는 필요 시 협조합니다.`,
  },
  {
    number: 7,
    title: "이용자의 콘텐츠 및 개인정보",
    content: `• 이용자가 업로드하는 계약서 파일은 AI 분석 목적으로만 사용되며, 회사의 다른 용도로 사용되지 않습니다.
• 업로드된 계약서 파일은 분석 완료 후 AI 처리 시스템(Anthropic)에서 즉시 파기됩니다. 회사 서버에는 파일 URL과 분석 결과 JSON만 보관됩니다.
• 이용자는 타인의 개인정보나 기밀정보가 포함된 계약서를 업로드할 경우, 해당 정보 주체의 동의를 얻었음을 보증합니다.
• 이용자는 저작권, 영업비밀 등 제3자의 권리를 침해하는 콘텐츠를 업로드하여서는 안 됩니다.`,
  },
  {
    number: 8,
    title: "면책 조항",
    isImportant: true,
    content: `[AI 분석 결과의 법적 한계]
Clauze의 AI 분석 결과는 참고용 정보 제공만을 목적으로 하며, 법률적 자문이나 법적 효력을 갖는 검토 의견이 아닙니다. 중요한 계약의 최종 검토는 반드시 자격을 갖춘 법률 전문가(변호사)와 상담하시기 바랍니다.

• AI 분석 결과는 참고 목적의 정보 제공만을 위한 것이며, 법률적 조언을 구성하지 않습니다.
• AI는 오류를 포함할 수 있으며, 분석 결과의 완전성, 정확성, 적시성을 보장하지 않습니다.
• 이용자가 AI 분석 결과에 의존하여 법적 판단을 내린 경우, 그로 인해 발생하는 손해에 대해 회사는 책임을 지지 않습니다.
• 서비스는 한국법에 따른 계약서를 주요 대상으로 하며, 외국법이 적용되는 계약서의 경우 분석 정확도가 낮을 수 있습니다.`,
  },
  {
    number: 9,
    title: "이용자의 의무",
    content: `이용자는 다음 행위를 하여서는 안 됩니다:
• 허위 정보를 기재하거나 타인의 정보를 도용하는 행위
• 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 유통, 판매하는 행위
• 회사의 저작권, 제3자의 저작권 등 지식재산권을 침해하는 행위
• 서비스 운영을 방해하거나 서비스에 위해를 가하는 행위
• 범죄와 결부되거나 관련 법령에 위반되는 행위
• 타인의 명예를 손상시키거나 불이익을 주는 행위
• 회사의 서비스를 이용하여 얻은 AI 분석 결과를 법률 서비스 제공의 근거로 사용하는 상업적 행위`,
  },
  {
    number: 10,
    title: "지식재산권",
    content: `• 서비스 내 회사가 작성한 콘텐츠(UI 디자인, 소프트웨어, 로고 등)에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.
• 이용자의 AI 분석 결과물은 이용자에게 귀속됩니다. 단, 회사는 서비스 개선 목적으로 비식별화된 형태의 통계 데이터를 활용할 수 있습니다.
• 이용자는 서비스를 통해 얻은 AI 분석 결과를 개인적, 비상업적 목적으로 이용할 수 있습니다.`,
  },
  {
    number: 11,
    title: "계약 해지",
    content: `• 회원은 언제든지 서비스 내 설정 메뉴 또는 이메일을 통해 이용 계약 해지(탈퇴)를 신청할 수 있습니다.
• 회사는 다음과 같은 경우 사전 통보 후 이용 계약을 해지할 수 있습니다:
  - 이용자가 이 약관을 위반한 경우
  - 서비스를 이용하여 타인에게 피해를 주거나 미풍양속에 위배되는 행위를 한 경우
  - 기타 회사가 정한 이용 조건에 위배되는 경우`,
  },
  {
    number: 12,
    title: "분쟁 해결 및 관할 법원",
    content: `• 회사와 이용자 사이에 발생한 분쟁에 관한 소송은 대한민국 법률을 준거법으로 합니다.
• 서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.`,
  },
  {
    number: 13,
    title: "고객 문의",
    content: `서비스 이용과 관련한 문의 및 불만사항은 아래 연락처로 접수해 주시기 바랍니다.

[회사 정보]
• 회사명: (주)루시퍼
• 서비스명: Clauze (clauze.io)
• 담당자: 박원영
• 이메일: nextidealab.ai@gmail.com
• 응답 시간: 영업일 기준 24시간 이내`,
  },
];

export default function TermsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div style={{ background: R.bgLight, minHeight: "100vh", fontFamily: R.fontSans }}>
      {/* Nav */}
      <nav style={{ background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 24, height: 68, position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealMid} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealMid}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontFamily: R.fontSans, fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" }}>CLAUZE</span>
        </Link>
        <div style={{ flex: 1 }} />
        <button onClick={() => router.back()} style={{ background: "none", border: `1px solid ${R.borderLight}`, borderRadius: R.btnRadius, padding: "7px 18px", fontSize: 13, color: R.textMid, fontFamily: R.fontSans, cursor: "pointer", fontWeight: 600 }}>← Back</button>
      </nav>

      {/* Hero */}
      <div style={{ background: R.bgDark, padding: "64px 40px", color: R.textWhite }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: R.tealBright, marginBottom: 12 }}>Terms of Service</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>서비스 이용약관</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>시행일 2026년 4월 1일 | 최종 수정 2026년 3월 27일 | v1.0</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>
        {/* 좌측 목차 */}
        <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
          {TERMS_DATA.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                marginBottom: 8,
                background: activeSection === i ? R.tealMid : "transparent",
                color: activeSection === i ? R.textWhite : R.textMid,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: R.fontSans,
                fontSize: 13,
                fontWeight: activeSection === i ? 700 : 500,
                transition: "all 0.2s",
              }}
            >
              제{item.number}조
            </button>
          ))}
        </div>

        {/* 우측 본문 */}
        <div>
          {TERMS_DATA.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: R.bgWhite,
                borderRadius: R.cardRadius,
                padding: 32,
                marginBottom: 28,
                boxShadow: "0 4px 16px rgba(4,34,40,0.08)",
                borderLeft: item.isImportant ? `4px solid ${R.danger}` : `4px solid ${R.tealMid}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ background: item.isImportant ? R.danger : R.tealMid, color: R.textWhite, padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700, fontFamily: R.fontMono }}>제{item.number}조</span>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: R.textDark, margin: 0, fontFamily: R.fontSans }}>{item.title}</h2>
              </div>
              {item.isImportant && (
                <div style={{ background: `rgba(${217},${79},${61},0.1)`, border: `1px solid ${R.danger}`, borderRadius: 4, padding: 12, marginBottom: 20, fontSize: 13, color: R.danger, lineHeight: 1.6 }}>
                <strong>⚠️ 중요 면책 조항:</strong> 이 조항의 내용을 꼼꼼히 읽어주세요.
              </div>
              )}
              <div style={{ fontSize: 14, color: R.textMid, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {item.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: R.bgDark, padding: "32px 40px", borderTop: `1px solid ${R.borderDark}`, marginTop: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>© 2026 Clauze. All rights reserved.</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            <a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealBright, textDecoration: "none" }}>nextidealab.ai@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
