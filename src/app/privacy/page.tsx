// src/app/privacy/page.tsx
// 개인정보처리방침 페이지 — Clauze 디자인 시스템 적용

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | Clauze',
  description: 'Clauze 서비스의 개인정보처리방침입니다.',
}

// ── 디자인 토큰 ──────────────────────────────
const T = {
  bgDark:   '#093944',
  teal:     '#00A599',
  tealBr:   '#00C2B5',
  text:     '#042228',
  textMid:  '#3D5A5E',
  textLt:   '#7A9A9E',
  bgLight:  '#F6F7FB',
  bgCard:   '#FFFFFF',
  border:   'rgba(4,34,40,0.08)',
}

// ── 공통 컴포넌트 ─────────────────────────────────────────────

function LegalLayout({ title, subtitle, effectiveDate, children }: {
  title: string
  subtitle: string
  effectiveDate: string
  children: React.ReactNode
}) {
  return (
    <div style={{ background: T.bgLight, minHeight: '100vh', fontFamily: "'DM Sans', -apple-system, sans-serif" }}>

      {/* 헤더 */}
      <div style={{ background: T.bgDark, padding: '64px 40px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'rgba(255,255,255,0.5)', fontSize: 13,
              textDecoration: 'none', marginBottom: 32,
              letterSpacing: '-0.01em',
            }}
          >
            ← Clauze 홈으로
          </a>
          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: T.tealBr, marginBottom: 12,
          }}>
            {subtitle}
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800,
            color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            {title}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            시행일: {effectiveDate} &nbsp;·&nbsp; 버전: v1.0 &nbsp;·&nbsp; (주)루시퍼
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ maxWidth: 800, margin: '-32px auto 0', padding: '0 40px 80px' }}>
        {children}
      </div>

      {/* 푸터 */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: '28px 40px', textAlign: 'center',
        background: T.bgCard,
      }}>
        <p style={{ fontSize: 13, color: T.textLt, margin: 0 }}>
          © 2026 (주)루시퍼 · Clauze &nbsp;|&nbsp;
          <a href="/privacy" style={{ color: T.teal, textDecoration: 'none' }}>개인정보처리방침</a>
          &nbsp;·&nbsp;
          <a href="/terms" style={{ color: T.teal, textDecoration: 'none' }}>이용약관</a>
          &nbsp;·&nbsp;
          <a href="mailto:nextidealab.ai@gmail.com" style={{ color: T.teal, textDecoration: 'none' }}>
            nextidealab.ai@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

function Section({ num, title, children }: {
  num: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: T.bgCard,
      borderRadius: 4,
      border: `1px solid ${T.border}`,
      borderTop: `3px solid ${T.teal}`,
      padding: '28px 32px',
      marginBottom: 16,
    }}>
      <h2 style={{
        fontSize: 17, fontWeight: 800, color: T.text,
        letterSpacing: '-0.02em', margin: '0 0 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: '50%',
          background: T.bgDark, color: T.tealBr,
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {num}
        </span>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 20, marginBottom: 8 }}>
      <h3 style={{
        fontSize: 14, fontWeight: 700, color: T.text,
        margin: '0 0 10px', letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? T.bgLight : T.bgCard }}>
            <td style={{
              padding: '10px 14px', fontWeight: 700, color: T.text,
              border: `1px solid ${T.border}`, width: '32%',
              fontSize: 12,
            }}>
              {label}
            </td>
            <td style={{
              padding: '10px 14px', color: T.textMid,
              border: `1px solid ${T.border}`,
            }}>
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function HeaderTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '10px 14px', background: T.bgDark,
              color: '#FFFFFF', fontWeight: 700, fontSize: 12,
              border: `1px solid ${T.border}`, textAlign: 'left',
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? T.bgCard : T.bgLight }}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: '10px 14px', color: T.textMid,
                border: `1px solid ${T.border}`,
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: T.teal, flexShrink: 0, marginTop: 7,
      }} />
      <span>{children}</span>
    </div>
  )
}

function Num({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
      <span style={{
        fontSize: 12, fontWeight: 700, color: T.tealBr,
        flexShrink: 0, minWidth: 20, marginTop: 2,
      }}>
        {n}.
      </span>
      <span>{children}</span>
    </div>
  )
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#EDF7F6',
      border: `1px solid rgba(0,165,153,0.3)`,
      borderLeft: `4px solid ${T.teal}`,
      borderRadius: '0 4px 4px 0',
      padding: '14px 18px',
      marginTop: 12, marginBottom: 12,
      fontSize: 13, color: T.textMid, lineHeight: 1.7,
    }}>
      {children}
    </div>
  )
}

// ── 메인 페이지 컴포넌트 ───────────────────────────────────────

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="개인정보처리방침"
      subtitle="Privacy Policy"
      effectiveDate="2026년 4월 1일"
    >
      {/* 전문 */}
      <div style={{
        background: T.bgCard, borderRadius: 4,
        border: `1px solid ${T.border}`,
        padding: '22px 28px', marginBottom: 16,
        fontSize: 14, color: T.textMid, lineHeight: 1.8,
      }}>
        (주)루시퍼(이하 "회사")는 Clauze 서비스 운영과 관련하여{' '}
        <strong style={{ color: T.text }}>개인정보 보호법</strong>,{' '}
        <strong style={{ color: T.text }}>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong>{' '}
        등 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하게
        처리할 수 있도록 다음과 같이 개인정보처리방침을 수립하여 공개합니다.
      </div>

      {/* 제1조 */}
      <Section num="1" title="수집하는 개인정보 항목 및 수집 방법">
        <SubSection title="① 회원가입 시 수집 항목">
          <HeaderTable
            headers={['구분', '수집 항목']}
            rows={[
              ['필수', '이메일 주소, 비밀번호(암호화 저장), 서비스 가입일시'],
              ['자동 수집', 'IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 기기 정보'],
              ['결제 시 (유료 플랜)', '토스페이먼츠를 통해 처리 — 회사는 카드번호를 직접 저장하지 않습니다'],
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

      {/* 제2조 */}
      <Section num="2" title="개인정보의 수집 및 이용 목적">
        <HeaderTable
          headers={['이용 목적', '내용']}
          rows={[
            ['서비스 제공', '계약서 AI 분석 서비스 제공, 검토 이력 저장 및 관리'],
            ['회원 관리', '회원 식별 및 인증, 불량 이용자 제재, 서비스 부정이용 방지'],
            ['결제 및 요금 부과', '유료 서비스 결제 처리, 구독 상태 관리, 환불 처리'],
            ['고객 지원', '민원 처리, 공지사항 전달, 서비스 관련 안내'],
            ['서비스 개선', '이용 통계 분석, 서비스 품질 개선, 신규 기능 개발'],
            ['법적 의무 이행', '관련 법령에 따른 기록 보존 의무 이행'],
          ]}
        />
      </Section>

      {/* 제3조 */}
      <Section num="3" title="개인정보의 보유 및 이용 기간">
        <p style={{ marginBottom: 14 }}>
          회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
          단, 관계 법령의 규정에 의하여 일정 기간 보존이 필요한 경우 아래와 같이 보관합니다.
        </p>
        <HeaderTable
          headers={['보존 항목', '보존 근거', '보존 기간']}
          rows={[
            ['계약 또는 청약철회에 관한 기록', '전자상거래법', '5년'],
            ['대금결제 및 재화 공급에 관한 기록', '전자상거래법', '5년'],
            ['소비자 불만 또는 분쟁처리에 관한 기록', '전자상거래법', '3년'],
            ['접속 로그, IP 주소', '통신비밀보호법', '3개월'],
          ]}
        />
        <AlertBox>
          <strong>회원 탈퇴 시:</strong> 개인정보는 즉시 파기하는 것을 원칙으로 하되,
          위 법령 보존 기간에 해당하는 정보는 해당 기간 동안 분리 보관 후 파기합니다.
        </AlertBox>
      </Section>

      {/* 제4조 */}
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

      {/* 제5조 */}
      <Section num="5" title="개인정보 처리 업무의 위탁">
        <p style={{ marginBottom: 12 }}>
          회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
        </p>
        <HeaderTable
          headers={['수탁업체', '위탁 업무 내용', '보유 기간']}
          rows={[
            ['Google Firebase', '회원 인증, 데이터 저장, 파일 스토리지', '회원 탈퇴 시까지'],
            ['Anthropic', '계약서 AI 분석 처리 (업로드 PDF 일시 처리)', '분석 완료 즉시 파기'],
            ['토스페이먼츠', '결제 처리 및 구독 관리', '법정 보존 기간'],
            ['Vercel', '서비스 호스팅 및 배포', '서비스 운영 기간'],
          ]}
        />
      </Section>

      {/* 제6조 */}
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
          <a href="mailto:nextidealab.ai@gmail.com" style={{ color: T.teal }}>
            nextidealab.ai@gmail.com
          </a>
          으로 요청하실 수 있으며, 회사는 지체 없이 조치하겠습니다.
        </AlertBox>
      </Section>

      {/* 제7조 */}
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

      {/* 제8조 */}
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

      {/* 제9조 */}
      <Section num="9" title="개인정보의 안전성 확보 조치">
        <Num n={1}>관리적 조치: 개인정보 접근 권한의 최소화, 정기 교육 실시</Num>
        <Num n={2}>기술적 조치: 개인정보 암호화 저장(Firebase 보안), HTTPS 통신, Firebase Security Rules 적용</Num>
        <Num n={3}>물리적 조치: 서버 보안 구역 접근 통제 (Google Cloud 인프라)</Num>
        <Num n={4}>결제 정보: PCI-DSS 인증 토스페이먼츠를 통해 처리 — 카드 정보 직접 저장 없음</Num>
      </Section>

      {/* 제10조 */}
      <Section num="10" title="개인정보 보호책임자">
        <p style={{ marginBottom: 14 }}>
          회사는 개인정보 처리에 관한 업무를 총괄하고, 이용자의 불만 처리 및 피해구제를 위하여
          아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <InfoTable
          rows={[
            ['회사명', '(주)루시퍼'],
            ['성명', '박원영'],
            ['이메일', 'nextidealab.ai@gmail.com'],
            ['서비스 URL', 'https://clauze.io'],
          ]}
        />
      </Section>

      {/* 제11조 */}
      <Section num="11" title="권익침해 구제 방법">
        <p style={{ marginBottom: 12 }}>
          이용자는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
        </p>
        <HeaderTable
          headers={['기관', '연락처']}
          rows={[
            ['개인정보 침해신고센터', '(국번없이) 118 / privacy.kisa.or.kr'],
            ['개인정보 분쟁조정위원회', '(국번없이) 1833-6972 / www.kopico.go.kr'],
            ['대검찰청 사이버수사과', '(국번없이) 1301 / www.spo.go.kr'],
            ['경찰청 사이버안전국', '(국번없이) 182 / ecrm.cyber.go.kr'],
          ]}
        />
      </Section>

      {/* 제12조 */}
      <Section num="12" title="개인정보처리방침의 변경">
        <Num n={1}>
          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의
          추가·삭제·정정이 있는 경우 변경사항의 시행 7일 전부터 공지사항을 통하여 고지합니다.
        </Num>
        <Num n={2}>중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.</Num>
      </Section>

      {/* 시행일 */}
      <div style={{
        background: T.bgDark, borderRadius: 4,
        padding: '20px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.tealBr }}>
          본 방침은 2026년 4월 1일부터 시행됩니다.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          (주)루시퍼 · 개인정보 보호책임자 박원영
        </p>
      </div>

    </LegalLayout>
  )
}
