// src/app/privacy/page.tsx
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

const PRIVACY_DATA = [
  {
    number: 1,
    title: "수집하는 개인정보 항목 및 수집 방법",
    hasTable: true,
    content: `[수집 항목]
• 회원가입 시: 이메일 주소, 비밀번호(암호화 저장), 서비스 가입일시
• 자동 수집: IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 기기 정보
• 결제 시 (Pro/Business): Stripe를 통해 처리 ― 회사는 카드번호를 직접 저장하지 않음
• Google 소셜 로그인 시 추가 수집: Google 계정 이메일, 프로필 이름 (Google이 제공하는 범위 내)

[수집 방법]
• 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력
• 서비스 이용 과정에서 자동 생성 및 수집
• Google, Firebase 등 제3자 서비스를 통한 간접 수집`,
  },
  {
    number: 2,
    title: "개인정보의 수집 및 이용 목적",
    hasTable: true,
    content: `[개인정보 활용 목적]
• 서비스 제공: 계약서 AI 분석 서비스 제공, 검토 이력 저장 및 관리
• 회원 관리: 회원 식별 및 인증, 불량 이용자 제재, 서비스 부정이용 방지
• 결제 및 요금 부과: 유료 서비스 결제 처리, 구독 상태 관리, 환불 처리
• 고객 지원: 민원 처리, 공지사항 전달, 서비스 관련 안내
• 서비스 개선: 이용 통계 분석, 서비스 품질 개선, 신규 기능 개발
• 법적 의무 이행: 관련 법령에 따른 기록 보존 의무 이행`,
  },
  {
    number: 3,
    title: "개인정보의 보유 및 이용 기간",
    hasTable: true,
    content: `[원칙]
회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 일정 기간 보존이 필요한 경우 아래와 같이 보관합니다.

[법령에 따른 보존 기간]
• 계약 또는 청약철회에 관한 기록 (전자상거래법): 5년
• 대금결제 및 재화 공급에 관한 기록 (전자상거래법): 5년
• 소비자 불만 또는 분쟁처리에 관한 기록 (전자상거래법): 3년
• 접속 로그, IP 주소 (통신비밀보호법): 3개월

[회원 탈퇴 시]
회원 탈퇴 시 개인정보는 즉시 파기하는 것을 원칙으로 하되, 위 법령 보존 기간에 해당하는 정보는 해당 기간 동안 분리 보관 후 파기합니다.`,
  },
  {
    number: 4,
    title: "개인정보의 제3자 제공",
    content: `회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
• 이용자가 사전에 동의한 경우
• 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우`,
  },
  {
    number: 5,
    title: "개인정보 처리 업무의 위탁",
    hasTable: true,
    content: `회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:

[수탁업체 정보]
• Google Firebase: 회원 인증, 데이터 저장, 파일 스토리지 (회원 탈퇴 시까지)
• Anthropic: 계약서 AI 분석 처리 (업로드 PDF 일시 처리, 분석 완료 즉시 파기)
• Stripe: 결제 처리 및 구독 관리 (법정 보존 기간)
• Vercel: 서비스 호스팅 및 배포 (서비스 운영 기간)`,
  },
  {
    number: 6,
    title: "이용자의 권리와 의무",
    content: `이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
• 개인정보 열람 요구
• 오류 등이 있을 경우 정정 요구
• 삭제 요구
• 처리 정지 요구

위 권리 행사는 서비스 내 설정 메뉴 또는 개인정보 보호책임자에게 이메일로 요청하실 수 있으며, 회사는 지체 없이 조치하겠습니다.`,
  },
  {
    number: 7,
    title: "개인정보의 파기 절차 및 방법",
    content: `[파기 절차]
이용자가 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보 보호 사유에 따라 일정 기간 저장된 후 파기됩니다.

[파기 방법]
• 전자적 파일 형태: 복구가 불가능한 방법으로 영구 삭제
• 종이 문서: 분쇄기로 분쇄하거나 소각`,
  },
  {
    number: 8,
    title: "개인정보 자동 수집 장치의 설치·운영 및 거부",
    content: `[쿠키의 사용]
회사는 이용자에게 맞춤화된 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다. 쿠키는 웹사이트가 이용자의 브라우저에 전송하는 소량의 텍스트 파일입니다.

[쿠키 수집 목적]
• 로그인 상태 유지 (Firebase Authentication 세션)
• 서비스 이용 환경 설정 (언어 설정, 다크모드 등) 저장
• 서비스 이용 통계 분석

[쿠키 거부 방법]
이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 로그인이 필요한 서비스 이용에 어려움이 발생할 수 있습니다.`,
  },
  {
    number: 9,
    title: "개인정보의 안전성 확보 조치",
    content: `회사는 개인정보 보호법에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다:
• 관리적 조치: 개인정보 접근 권한의 최소화, 정기 교육 실시
• 기술적 조치: 개인정보 암호화 저장(Firebase 보안), HTTPS 통신, Firebase Security Rules 적용
• 물리적 조치: 전산실 및 서버 보안 구역 접근 통제 (Google Cloud 인프라)
• 결제 정보: PCI-DSS 인증 Stripe를 통해 처리 ― 카드 정보 직접 저장 없음`,
  },
  {
    number: 10,
    title: "개인정보 보호책임자",
    content: `회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만 처리 및 피해구제 등을 위하여 다음과 같이 개인정보 보호책임자를 지정하고 있습니다:

[보호책임자 정보]
• 회사명: (주)루시퍼
• 담당자 이름: 박원영
• 이메일: nextidealab.ai@gmail.com
• 서비스 URL: https://clauze.io

이용자는 서비스를 이용하면서 발생하는 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 위의 이메일로 문의하실 수 있습니다. 회사는 이용자의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.`,
  },
  {
    number: 11,
    title: "권익침해 구제 방법",
    hasTable: true,
    content: `이용자는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다:

[권익침해 구제 기관]
• 개인정보 침해신고센터: (국번없이) 118 / privacy.kisa.or.kr
• 개인정보 분쟁조정위원회: (국번없이) 1833-6972 / www.kopico.go.kr
• 대검찰청 사이버수사과: (국번없이) 1301 / www.spo.go.kr
• 경찰청 사이버안전국: (국번없이) 182 / ecrm.cyber.go.kr`,
  },
  {
    number: 12,
    title: "개인정보처리방침의 변경",
    content: `• 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
• 중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.

본 방침은 2026년 4월 1일부터 시행됩니다.`,
  },
];

export default function PrivacyPage() {
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
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: R.tealBright, marginBottom: 12 }}>Privacy Policy</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>개인정보처리방침</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>시행일 2026년 4월 1일 | 최종 수정 2026년 3월 27일 | v1.0</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>
        {/* 좌측 목차 */}
        <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
          {PRIVACY_DATA.map((item, i) => (
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
          {PRIVACY_DATA.map((item, i) => (
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
                borderLeft: `4px solid ${R.tealMid}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ background: R.tealMid, color: R.textWhite, padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700, fontFamily: R.fontMono }}>제{item.number}조</span>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: R.textDark, margin: 0, fontFamily: R.fontSans }}>{item.title}</h2>
              </div>
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
