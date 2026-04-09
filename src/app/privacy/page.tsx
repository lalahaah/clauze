// src/app/privacy/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SUPPORT_EMAIL } from "@/lib/config";

// ── 디자인 토큰 ──────────────────────────────
const R = {
  bgWhite:    "#FFFFFF",
  bgLight:    "#F6F7FB",
  bgDark:     "#093944",
  bgMid:      "#0D4F5C",
  tealBright: "#00C2B5",
  tealMid:    "#00A599",
  tealDark:   "#00857C",
  tealBtn:    "#00C2B5",
  textDark:   "#042228",
  textMid:    "#3D5A5E",
  textLight:  "#7A9A9E",
  textWhite:  "#FFFFFF",
  borderLight: "rgba(4,34,40,0.1)",
  borderDark:  "rgba(255,255,255,0.15)",
  btnRadius:  "28px",
  cardRadius: "4px",
  fontSans:   "'DM Sans', -apple-system, sans-serif",
  fontMono:   "'DM Mono', monospace",
};

type Lang = 'ko' | 'en';

// ── 공통 컴포넌트 ─────────────────────────────────────────────

function Section({ num, title, children }: {
  num: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: R.bgWhite, borderRadius: R.cardRadius,
      borderLeft: `4px solid ${R.tealMid}`,
      padding: "28px 32px", marginBottom: 20,
      boxShadow: "0 2px 12px rgba(4,34,40,0.07)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: "50%",
          background: R.bgDark, color: R.tealBright,
          fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: R.fontMono,
        }}>
          {num}
        </span>
        <h2 style={{
          fontSize: 17, fontWeight: 800, color: R.textDark,
          letterSpacing: "-0.02em", margin: 0, fontFamily: R.fontSans,
        }}>
          {title}
        </h2>
      </div>
      <div style={{ fontSize: 14, color: R.textMid, lineHeight: 1.8, fontFamily: R.fontSans }}>
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18, marginBottom: 8 }}>
      <h3 style={{
        fontSize: 13, fontWeight: 700, color: R.textDark,
        margin: "0 0 10px", letterSpacing: "-0.01em", fontFamily: R.fontMono,
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function HeaderTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const colCount = headers.length;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: "10px 14px", background: R.bgDark,
              color: R.textWhite, fontWeight: 700, fontSize: 12,
              border: `1px solid ${R.borderLight}`, textAlign: "left",
              fontFamily: R.fontMono,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? R.bgWhite : R.bgLight }}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: "10px 14px", color: R.textMid,
                border: `1px solid ${R.borderLight}`,
                fontFamily: R.fontSans,
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? R.bgLight : R.bgWhite }}>
            <td style={{
              padding: "10px 14px", fontWeight: 700, color: R.textDark,
              border: `1px solid ${R.borderLight}`, width: "32%",
              fontSize: 12, fontFamily: R.fontMono,
            }}>{label}</td>
            <td style={{
              padding: "10px 14px", color: R.textMid,
              border: `1px solid ${R.borderLight}`, fontFamily: R.fontSans,
            }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: R.tealMid, flexShrink: 0, marginTop: 8,
      }} />
      <span>{children}</span>
    </div>
  );
}

function Num({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
      <span style={{
        fontSize: 12, fontWeight: 700, color: R.tealBright,
        flexShrink: 0, minWidth: 20, marginTop: 2, fontFamily: R.fontMono,
      }}>{n}.</span>
      <span>{children}</span>
    </div>
  );
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#EDF7F6",
      border: `1px solid rgba(0,165,153,0.3)`,
      borderLeft: `4px solid ${R.tealMid}`,
      borderRadius: "0 4px 4px 0",
      padding: "14px 18px",
      marginTop: 12, marginBottom: 12,
      fontSize: 13, color: R.textMid, lineHeight: 1.7,
      fontFamily: R.fontSans,
    }}>
      {children}
    </div>
  );
}

// ── KO 콘텐츠 ────────────────────────────────────────────────

function KoContent() {
  return (
    <>
      {/* 전문 */}
      <div style={{
        background: R.bgWhite, borderRadius: R.cardRadius,
        border: `1px solid ${R.borderLight}`,
        padding: "22px 28px", marginBottom: 20,
        fontSize: 14, color: R.textMid, lineHeight: 1.8,
        fontFamily: R.fontSans,
      }}>
        (주)루시퍼(이하 "회사")는 Clauze 서비스 운영과 관련하여{' '}
        <strong style={{ color: R.textDark }}>개인정보 보호법</strong>,{' '}
        <strong style={{ color: R.textDark }}>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong>{' '}
        등 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하게
        처리할 수 있도록 다음과 같이 개인정보처리방침을 수립하여 공개합니다.
      </div>

      <Section num="1" title="수집하는 개인정보 항목 및 수집 방법">
        <SubSection title="① 회원가입 시 수집 항목">
          <HeaderTable
            headers={["구분", "수집 항목"]}
            rows={[
              ["필수", "이메일 주소, 비밀번호(암호화 저장), 서비스 가입일시"],
              ["자동 수집", "IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 기기 정보"],
              ["결제 시 (유료 플랜)", "Dodo Payments를 통해 처리 — 회사는 카드번호를 직접 저장하지 않습니다"],
            ]}
          />
        </SubSection>
        <SubSection title="② Google 소셜 로그인 시 추가 수집">
          <Li>Google 계정 이메일, 프로필 이름 (Google이 제공하는 범위 내)</Li>
        </SubSection>
        <SubSection title="③ 수집 방법">
          <Li>회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</Li>
          <Li>서비스 이용 과정에서 자동 생성 및 수집</Li>
          <Li>Google, Firebase 등 제3자 서비스를 통한 간접 수집</Li>
        </SubSection>
      </Section>

      <Section num="2" title="개인정보의 수집 및 이용 목적">
        <HeaderTable
          headers={["이용 목적", "내용"]}
          rows={[
            ["서비스 제공", "계약서 AI 분석 서비스 제공, 검토 이력 저장 및 관리"],
            ["회원 관리", "회원 식별 및 인증, 불량 이용자 제재, 서비스 부정이용 방지"],
            ["결제 및 요금 부과", "유료 서비스 결제 처리, 구독 상태 관리, 환불 처리"],
            ["고객 지원", "민원 처리, 공지사항 전달, 서비스 관련 안내"],
            ["서비스 개선", "이용 통계 분석, 서비스 품질 개선, 신규 기능 개발"],
            ["법적 의무 이행", "관련 법령에 따른 기록 보존 의무 이행"],
          ]}
        />
      </Section>

      <Section num="3" title="개인정보의 보유 및 이용 기간">
        <p style={{ marginBottom: 14 }}>
          회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
          단, 관계 법령의 규정에 의하여 일정 기간 보존이 필요한 경우 아래와 같이 보관합니다.
        </p>
        <HeaderTable
          headers={["보존 항목", "보존 근거", "보존 기간"]}
          rows={[
            ["계약 또는 청약철회에 관한 기록", "전자상거래법", "5년"],
            ["대금결제 및 재화 공급에 관한 기록", "전자상거래법", "5년"],
            ["소비자 불만 또는 분쟁처리에 관한 기록", "전자상거래법", "3년"],
            ["접속 로그, IP 주소", "통신비밀보호법", "3개월"],
          ]}
        />
        <AlertBox>
          <strong>회원 탈퇴 시:</strong> 개인정보는 즉시 파기하는 것을 원칙으로 하되,
          위 법령 보존 기간에 해당하는 정보는 해당 기간 동안 분리 보관 후 파기합니다.
        </AlertBox>
      </Section>

      <Section num="4" title="개인정보의 제3자 제공">
        <p style={{ marginBottom: 12 }}>
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
          다만, 다음의 경우에는 예외로 합니다.
        </p>
        <Num n={1}>이용자가 사전에 동의한 경우</Num>
        <Num n={2}>
          법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라
          수사기관의 요구가 있는 경우
        </Num>
      </Section>

      <Section num="5" title="개인정보 처리 업무의 위탁">
        <p style={{ marginBottom: 12 }}>
          회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
        </p>
        <HeaderTable
          headers={["수탁업체", "위탁 업무 내용", "보유 기간"]}
          rows={[
            ["Google Firebase", "회원 인증, 데이터 저장, 파일 스토리지", "회원 탈퇴 시까지"],
            ["Anthropic", "계약서 AI 분석 처리 (업로드 PDF 일시 처리)", "분석 완료 즉시 파기"],
            ["Dodo Payments", "결제 처리 및 구독 관리 (국제 결제)", "법정 보존 기간"],
            ["Vercel", "서비스 호스팅 및 배포", "서비스 운영 기간"],
          ]}
        />
      </Section>

      <Section num="6" title="이용자의 권리와 의무">
        <p style={{ marginBottom: 12 }}>
          이용자는 언제든지 다음의 권리를 행사할 수 있습니다.
        </p>
        <Num n={1}>개인정보 열람 요구</Num>
        <Num n={2}>오류 등이 있을 경우 정정 요구</Num>
        <Num n={3}>삭제 요구</Num>
        <Num n={4}>처리 정지 요구</Num>
        <AlertBox>
          위 권리 행사는 서비스 내 설정 메뉴 또는 개인정보 보호책임자에게{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: R.tealMid }}>
            {SUPPORT_EMAIL}
          </a>
          으로 요청하실 수 있으며, 회사는 지체 없이 조치하겠습니다.
        </AlertBox>
      </Section>

      <Section num="7" title="개인정보의 파기 절차 및 방법">
        <SubSection title="파기 절차">
          <p>
            이용자가 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및
            기타 관련 법령에 의한 정보 보호 사유에 따라 일정 기간 저장된 후 파기됩니다.
          </p>
        </SubSection>
        <SubSection title="파기 방법">
          <Li>전자적 파일 형태: 복구가 불가능한 방법으로 영구 삭제</Li>
          <Li>종이 문서: 분쇄기로 분쇄하거나 소각</Li>
        </SubSection>
      </Section>

      <Section num="8" title="개인정보 자동 수집 장치의 설치·운영 및 거부">
        <p style={{ marginBottom: 12 }}>
          회사는 이용자에게 맞춤화된 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다.
        </p>
        <SubSection title="쿠키 수집 목적">
          <Li>로그인 상태 유지 (Firebase Authentication 세션)</Li>
          <Li>서비스 이용 환경 설정 (언어 설정 등) 저장</Li>
          <Li>서비스 이용 통계 분석</Li>
        </SubSection>
        <SubSection title="쿠키 거부 방법">
          <p>
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
            단, 쿠키 저장을 거부할 경우 로그인이 필요한 서비스 이용에 어려움이 발생할 수 있습니다.
          </p>
        </SubSection>
      </Section>

      <Section num="9" title="개인정보의 안전성 확보 조치">
        <Num n={1}>관리적 조치: 개인정보 접근 권한의 최소화, 정기 교육 실시</Num>
        <Num n={2}>기술적 조치: 개인정보 암호화 저장(Firebase 보안), HTTPS 통신, Firebase Security Rules 적용</Num>
        <Num n={3}>물리적 조치: 서버 보안 구역 접근 통제 (Google Cloud 인프라)</Num>
        <Num n={4}>결제 정보: PCI-DSS 인증 Dodo Payments를 통해 처리 — 카드 정보 직접 저장 없음</Num>
      </Section>

      <Section num="10" title="개인정보 보호책임자">
        <p style={{ marginBottom: 14 }}>
          회사는 개인정보 처리에 관한 업무를 총괄하고, 이용자의 불만 처리 및 피해구제를 위하여
          아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <InfoTable
          rows={[
            ["회사명", "(주)루시퍼"],
            ["성명", "박원영"],
            ["이메일", SUPPORT_EMAIL],
            ["서비스 URL", "https://clauze-ai.vercel.app"],
          ]}
        />
      </Section>

      <Section num="11" title="권익침해 구제 방법">
        <p style={{ marginBottom: 12 }}>
          이용자는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
        </p>
        <HeaderTable
          headers={["기관", "연락처"]}
          rows={[
            ["개인정보 침해신고센터", "(국번없이) 118 / privacy.kisa.or.kr"],
            ["개인정보 분쟁조정위원회", "(국번없이) 1833-6972 / www.kopico.go.kr"],
            ["대검찰청 사이버수사과", "(국번없이) 1301 / www.spo.go.kr"],
            ["경찰청 사이버안전국", "(국번없이) 182 / ecrm.cyber.go.kr"],
          ]}
        />
      </Section>

      <Section num="12" title="개인정보처리방침의 변경">
        <Num n={1}>
          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의
          추가·삭제·정정이 있는 경우 변경사항의 시행 7일 전부터 공지사항을 통하여 고지합니다.
        </Num>
        <Num n={2}>중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.</Num>
      </Section>

      <div style={{
        background: R.bgDark, borderRadius: R.cardRadius,
        padding: "20px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
          본 방침은 2026년 4월 1일부터 시행됩니다.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: R.fontSans }}>
          (주)루시퍼 · 개인정보 보호책임자 박원영
        </p>
      </div>
    </>
  );
}

// ── EN 콘텐츠 ────────────────────────────────────────────────

function EnContent() {
  return (
    <>
      {/* Preamble */}
      <div style={{
        background: R.bgWhite, borderRadius: R.cardRadius,
        border: `1px solid ${R.borderLight}`,
        padding: "22px 28px", marginBottom: 20,
        fontSize: 14, color: R.textMid, lineHeight: 1.8,
        fontFamily: R.fontSans,
      }}>
        Lucifer Inc. ("Company") establishes and discloses this Privacy Policy in accordance with the{' '}
        <strong style={{ color: R.textDark }}>Personal Information Protection Act</strong> and the{' '}
        <strong style={{ color: R.textDark }}>Act on Promotion of Information and Communications Network Utilization and Information Protection</strong>{' '}
        to protect users' personal information and promptly handle any related grievances in connection with the operation of the Clauze service.
      </div>

      <Section num="1" title="Personal Information Collected & Collection Methods">
        <SubSection title="① Items Collected at Registration">
          <HeaderTable
            headers={["Category", "Items"]}
            rows={[
              ["Required", "Email address, password (encrypted), registration date/time"],
              ["Auto-collected", "IP address, cookies, service usage logs, access logs, device information"],
              ["On Payment (Paid Plans)", "Processed via Dodo Payments — the Company does not store card numbers directly"],
            ]}
          />
        </SubSection>
        <SubSection title="② Additional Items via Google Social Login">
          <Li>Google account email, profile name (within the scope provided by Google)</Li>
        </SubSection>
        <SubSection title="③ Collection Methods">
          <Li>Directly entered by users during registration and service use</Li>
          <Li>Automatically generated and collected during service use</Li>
          <Li>Collected indirectly via third-party services such as Google and Firebase</Li>
        </SubSection>
      </Section>

      <Section num="2" title="Purpose of Collection and Use">
        <HeaderTable
          headers={["Purpose", "Details"]}
          rows={[
            ["Service Provision", "Providing AI contract analysis, storing and managing review history"],
            ["Member Management", "Member identification and authentication, restricting abusive users, preventing fraudulent use"],
            ["Payment & Billing", "Processing paid service payments, managing subscription status, handling refunds"],
            ["Customer Support", "Handling inquiries, delivering notices, providing service-related guidance"],
            ["Service Improvement", "Usage statistics analysis, improving service quality, developing new features"],
            ["Legal Compliance", "Fulfilling record-keeping obligations under applicable laws"],
          ]}
        />
      </Section>

      <Section num="3" title="Retention Period">
        <p style={{ marginBottom: 14 }}>
          The Company destroys personal information without delay after the purpose of collection and use has been achieved.
          However, information required to be retained under relevant laws is stored as follows.
        </p>
        <HeaderTable
          headers={["Records", "Legal Basis", "Retention Period"]}
          rows={[
            ["Records on contracts or withdrawal of subscription", "E-Commerce Act", "5 years"],
            ["Records on payment and supply of goods", "E-Commerce Act", "5 years"],
            ["Records on consumer complaints or dispute resolution", "E-Commerce Act", "3 years"],
            ["Access logs, IP addresses", "Protection of Communications Secrets Act", "3 months"],
          ]}
        />
        <AlertBox>
          <strong>Upon Account Deletion:</strong> Personal information is destroyed immediately in principle;
          information subject to the statutory retention periods above is stored separately for the applicable period before destruction.
        </AlertBox>
      </Section>

      <Section num="4" title="Third-Party Disclosure">
        <p style={{ marginBottom: 12 }}>
          The Company does not provide users' personal information to third parties in principle.
          Exceptions apply in the following cases:
        </p>
        <Num n={1}>When the user has provided prior consent</Num>
        <Num n={2}>
          When required by law or requested by investigative authorities in accordance with legally prescribed procedures and methods for investigation purposes
        </Num>
      </Section>

      <Section num="5" title="Processing Delegation">
        <p style={{ marginBottom: 12 }}>
          The Company delegates personal information processing tasks as follows to ensure smooth service delivery.
        </p>
        <HeaderTable
          headers={["Processor", "Scope of Work", "Retention Period"]}
          rows={[
            ["Google Firebase", "Member authentication, data storage, file storage", "Until account deletion"],
            ["Anthropic", "AI contract analysis processing (temporary processing of uploaded PDFs)", "Destroyed immediately after analysis"],
            ["Dodo Payments", "Payment processing and subscription management (international)", "Statutory retention period"],
            ["Vercel", "Service hosting and deployment", "Duration of service operation"],
          ]}
        />
      </Section>

      <Section num="6" title="User Rights & Obligations">
        <p style={{ marginBottom: 12 }}>
          Users may exercise the following rights at any time:
        </p>
        <Num n={1}>Right to request access to personal information</Num>
        <Num n={2}>Right to request correction in case of errors</Num>
        <Num n={3}>Right to request deletion</Num>
        <Num n={4}>Right to request suspension of processing</Num>
        <AlertBox>
          Rights may be exercised via the in-service settings menu or by contacting the Privacy Officer at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: R.tealMid }}>
            {SUPPORT_EMAIL}
          </a>
          . The Company will take action without delay.
        </AlertBox>
      </Section>

      <Section num="7" title="Deletion Procedures & Methods">
        <SubSection title="Deletion Procedure">
          <p>
            Information entered by users is transferred to a separate database after the purpose is achieved
            and stored for a period in accordance with internal policies and applicable laws before being destroyed.
          </p>
        </SubSection>
        <SubSection title="Deletion Methods">
          <Li>Electronic files: Permanently deleted by a method that renders recovery impossible</Li>
          <Li>Paper documents: Shredded or incinerated</Li>
        </SubSection>
      </Section>

      <Section num="8" title="Cookie Policy">
        <p style={{ marginBottom: 12 }}>
          The Company uses cookies to provide personalized services to users.
        </p>
        <SubSection title="Purpose of Cookie Collection">
          <Li>Maintaining login state (Firebase Authentication session)</Li>
          <Li>Storing service environment settings (e.g. language preferences)</Li>
          <Li>Analyzing service usage statistics</Li>
        </SubSection>
        <SubSection title="How to Refuse Cookies">
          <p>
            Users may refuse cookie storage through browser settings.
            However, refusing cookies may cause difficulties in using services that require login.
          </p>
        </SubSection>
      </Section>

      <Section num="9" title="Security Measures">
        <Num n={1}>Administrative: Minimizing access to personal information, conducting regular training</Num>
        <Num n={2}>Technical: Encrypted storage of personal information (Firebase security), HTTPS communication, Firebase Security Rules</Num>
        <Num n={3}>Physical: Access control to server security zones (Google Cloud infrastructure)</Num>
        <Num n={4}>Payment: Processed via PCI-DSS certified Dodo Payments — no direct storage of card information</Num>
      </Section>

      <Section num="10" title="Privacy Officer">
        <p style={{ marginBottom: 14 }}>
          The Company has designated a Privacy Officer to oversee personal information processing and handle
          user complaints and remediation as follows:
        </p>
        <InfoTable
          rows={[
            ["Company", "Lucifer Inc. (주)루시퍼"],
            ["Name", "Won-Young Park (박원영)"],
            ["Email", SUPPORT_EMAIL],
            ["Service URL", "https://clauze-ai.vercel.app"],
          ]}
        />
      </Section>

      <Section num="11" title="Remedies for Rights Violations">
        <p style={{ marginBottom: 12 }}>
          Users may contact the following organizations for remedies, consultations, etc. regarding personal information violations:
        </p>
        <HeaderTable
          headers={["Organization", "Contact"]}
          rows={[
            ["Personal Information Infringement Report Center", "118 (no area code) / privacy.kisa.or.kr"],
            ["Personal Information Dispute Mediation Committee", "1833-6972 (no area code) / www.kopico.go.kr"],
            ["Supreme Prosecutors' Office Cyber Investigation Division", "1301 (no area code) / www.spo.go.kr"],
            ["National Police Agency Cyber Safety Bureau", "182 (no area code) / ecrm.cyber.go.kr"],
          ]}
        />
      </Section>

      <Section num="12" title="Policy Changes">
        <Num n={1}>
          This Privacy Policy applies from the effective date. Any additions, deletions, or corrections
          arising from changes to laws or policies will be notified via announcements at least 7 days
          before the effective date of such changes.
        </Num>
        <Num n={2}>For significant changes, notice will be provided at least 30 days in advance.</Num>
      </Section>

      <div style={{
        background: R.bgDark, borderRadius: R.cardRadius,
        padding: "20px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
          This policy is effective from April 1, 2026.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: R.fontSans }}>
          Lucifer Inc. · Privacy Officer: Won-Young Park
        </p>
      </div>
    </>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────

export default function PrivacyPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('ko');

  return (
    <div style={{ background: R.bgLight, minHeight: "100vh", fontFamily: R.fontSans }}>

      {/* Nav */}
      <nav style={{
        background: R.bgWhite, borderBottom: `1px solid ${R.borderLight}`,
        padding: "0 40px", display: "flex", alignItems: "center", gap: 24, height: 68,
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(4,34,40,0.06)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z" fill={R.tealBtn} opacity="0.2"/>
            <path d="M14 6l5 8H9l5-8z" fill={R.tealBtn}/>
            <path d="M9 14h10l-3 6H12l-3-6z" fill={R.tealDark}/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 800, color: R.textDark, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>CLAUZE</span>
        </Link>
        <div style={{ width: 1, height: 20, background: R.borderLight }} />
        <span style={{ fontSize: 13, color: R.textLight, fontFamily: R.fontSans }}>
          {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
        </span>
        <div style={{ flex: 1 }} />
        <Link href="/terms" style={{ fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 500 }}>
          {lang === 'ko' ? '이용약관 →' : 'Terms of Service →'}
        </Link>
        {/* 언어 토글 버튼 */}
        <div style={{
          display: 'flex', gap: 4,
          background: 'rgba(9,57,68,0.08)',
          borderRadius: 28, padding: 3,
        }}>
          <button
            onClick={() => setLang('ko')}
            style={{
              padding: '5px 14px', borderRadius: 24, border: 'none',
              background: lang === 'ko' ? R.tealMid : 'transparent',
              color: lang === 'ko' ? '#FFFFFF' : R.textMid,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >KO</button>
          <button
            onClick={() => setLang('en')}
            style={{
              padding: '5px 14px', borderRadius: 24, border: 'none',
              background: lang === 'en' ? R.tealMid : 'transparent',
              color: lang === 'en' ? '#FFFFFF' : R.textMid,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >EN</button>
        </div>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: `1px solid ${R.borderLight}`, borderRadius: R.btnRadius, padding: "7px 18px", fontSize: 13, color: R.textMid, cursor: "pointer", fontWeight: 600 }}
        >← Back</button>
      </nav>

      {/* Hero */}
      <div style={{ background: R.bgDark, padding: "56px 40px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-5%", top: "-30%", width: "30%", height: "160%", borderRadius: "50%", background: "rgba(0,165,153,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase" as const, color: R.tealBright, marginBottom: 14, fontFamily: R.fontMono }}>
            Privacy Policy
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: R.textWhite, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
          </h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
                {lang === 'ko' ? '시행일' : 'Effective'}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>2026. 04. 01</span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
                {lang === 'ko' ? '버전' : 'Version'}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>v1.0</span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(0,194,181,0.2)", color: R.tealBright, padding: "3px 10px", borderRadius: 12, fontFamily: R.fontMono }}>
              {lang === 'ko' ? '(주)루시퍼' : 'Lucifer Inc.'}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 40px 80px" }}>
        {lang === 'ko' ? <KoContent /> : <EnContent />}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${R.borderLight}`,
        padding: "28px 40px", textAlign: "center",
        background: R.bgWhite,
      }}>
        <p style={{ fontSize: 13, color: R.textLight, margin: 0, fontFamily: R.fontSans }}>
          © 2026 (주)루시퍼 · Clauze &nbsp;|&nbsp;
          <Link href="/privacy" style={{ color: R.tealMid, textDecoration: "none" }}>
            {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
          </Link>
          &nbsp;·&nbsp;
          <Link href="/terms" style={{ color: R.tealMid, textDecoration: "none" }}>
            {lang === 'ko' ? '이용약관' : 'Terms of Service'}
          </Link>
          &nbsp;·&nbsp;
          <Link href="/refund" style={{ color: R.tealMid, textDecoration: "none" }}>
            {lang === 'ko' ? '환불정책' : 'Refund Policy'}
          </Link>
          &nbsp;·&nbsp;
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: R.tealMid, textDecoration: "none" }}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
