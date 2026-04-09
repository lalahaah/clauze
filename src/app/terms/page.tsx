// src/app/terms/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 디자인 토큰
const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944", bgMid: "#0D4F5C",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", borderLight: "rgba(4,34,40,0.1)", borderDark: "rgba(255,255,255,0.15)",
  danger: "#D94F3D",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

type Lang = 'ko' | 'en';

// 이중 언어 목차 데이터
const ARTICLES = [
  { id: "art1",  num: 1,  ko: "목적",                    en: "Purpose" },
  { id: "art2",  num: 2,  ko: "정의",                    en: "Definitions" },
  { id: "art3",  num: 3,  ko: "약관의 효력 및 변경",     en: "Terms & Changes" },
  { id: "art4",  num: 4,  ko: "서비스의 제공 및 변경",   en: "Services" },
  { id: "art5",  num: 5,  ko: "회원가입 및 계정 관리",   en: "Membership" },
  { id: "art6",  num: 6,  ko: "유료 서비스 및 결제",     en: "Paid Services & Payments" },
  { id: "art7",  num: 7,  ko: "이용자의 콘텐츠 및 개인정보", en: "User Content & Privacy" },
  { id: "art8",  num: 8,  ko: "면책 조항",               en: "Disclaimer", important: true },
  { id: "art9",  num: 9,  ko: "이용자의 의무",           en: "User Obligations" },
  { id: "art10", num: 10, ko: "지식재산권",              en: "Intellectual Property" },
  { id: "art11", num: 11, ko: "계약 해지",               en: "Termination" },
  { id: "art12", num: 12, ko: "분쟁 해결 및 관할 법원",  en: "Dispute Resolution" },
  { id: "art13", num: 13, ko: "고객 문의",               en: "Contact" },
];

// 조 배지 — 한국어/영어 분기
function ArticleBadge({ num, important, lang }: { num: number; important?: boolean; lang: Lang }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "3px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700,
      fontFamily: R.fontMono, letterSpacing: "0.5px",
      background: important ? R.danger : R.tealMid,
      color: R.textWhite, flexShrink: 0,
    }}>
      {lang === 'ko' ? `제${num}조` : `Art. ${num}`}
    </span>
  );
}

// 조 카드 컨테이너
function ArticleCard({ id, num, title, important, lang, children }: {
  id: string; num: number; title: string; important?: boolean; lang: Lang; children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      style={{
        background: R.bgWhite, borderRadius: R.cardRadius,
        borderLeft: `4px solid ${important ? R.danger : R.tealMid}`,
        padding: "32px 36px", marginBottom: 24,
        boxShadow: "0 2px 12px rgba(4,34,40,0.07)",
        scrollMarginTop: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <ArticleBadge num={num} important={important} lang={lang} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: R.textDark, margin: 0, fontFamily: R.fontSans, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {important && (
          <span style={{ fontSize: 11, fontWeight: 700, color: R.danger, border: `1px solid ${R.danger}`, borderRadius: 4, padding: "2px 8px", fontFamily: R.fontSans }}>
            {lang === 'ko' ? '중요' : 'IMPORTANT'}
          </span>
        )}
      </div>
      {important && (
        <div style={{
          background: "rgba(217,79,61,0.07)", border: `1px solid rgba(217,79,61,0.25)`,
          borderRadius: 4, padding: "12px 16px", marginBottom: 20,
          fontSize: 13, color: R.danger, lineHeight: 1.65, fontFamily: R.fontSans,
        }}>
          <strong>⚠ {lang === 'ko' ? '법적 면책 고지:' : 'Legal Disclaimer:'}</strong>{' '}
          {lang === 'ko'
            ? '이 조항은 서비스 이용 전 반드시 확인하세요.'
            : 'Please read this section carefully before using the service.'}
        </div>
      )}
      <div style={{ fontSize: 14, color: R.textMid, lineHeight: 1.8, fontFamily: R.fontSans }}>
        {children}
      </div>
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ margin: "0 0 10px", lineHeight: 1.8, ...style }}>{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "8px 0 12px", paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6, lineHeight: 1.7 }}>{item}</li>
      ))}
    </ul>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" as const,
      color: R.tealDark, fontFamily: R.fontMono, marginTop: 20, marginBottom: 8,
    }}>{children}</div>
  );
}

// 서비스 플랜 표 — 4티어 (Free/Single/Pro/Business)
function PlanTable({ lang }: { lang: Lang }) {
  const plans = lang === 'ko' ? [
    { plan: "Free",          price: "무료",        features: "월 2건 검토, 기본 위험 분석" },
    { plan: "Single Review", price: "₩9,900/건",   features: "단건 계약서 검토, AI 분석 1회" },
    { plan: "Pro",           price: "₩17,000/월",  features: "무제한 검토, 한/영 번역, 위험 조항 하이라이트" },
    { plan: "Business",      price: "₩79,000/월",  features: "팀 5인, 커스텀 체크리스트, 우선 처리" },
  ] : [
    { plan: "Free",          price: "Free",         features: "2 reviews/month, basic risk analysis" },
    { plan: "Single Review", price: "₩9,900/use",   features: "One-time review, 1 AI analysis" },
    { plan: "Pro",           price: "₩17,000/mo",   features: "Unlimited reviews, KO/EN translation, risk highlights" },
    { plan: "Business",      price: "₩79,000/mo",   features: "Team of 5, custom checklists, priority processing" },
  ];
  const headers = lang === 'ko' ? ["플랜", "요금", "주요 내용"] : ["Plan", "Price", "Key Features"];

  return (
    <div style={{ borderRadius: R.cardRadius, overflow: "hidden", border: `1px solid ${R.borderLight}`, marginTop: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", background: R.tealMid }}>
        {headers.map(h => (
          <div key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: R.textWhite, letterSpacing: "1px", textTransform: "uppercase" as const, fontFamily: R.fontMono }}>{h}</div>
        ))}
      </div>
      {plans.map((row, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", background: i % 2 === 0 ? R.bgWhite : R.bgLight, borderTop: `1px solid ${R.borderLight}` }}>
          <div style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: R.textDark, fontFamily: R.fontSans }}>{row.plan}</div>
          <div style={{ padding: "12px 16px", fontSize: 13, color: R.tealDark, fontWeight: 600, fontFamily: R.fontMono }}>{row.price}</div>
          <div style={{ padding: "12px 16px", fontSize: 13, color: R.textMid, fontFamily: R.fontSans }}>{row.features}</div>
        </div>
      ))}
    </div>
  );
}

// 환불 플랜별 박스 컴포넌트
function RefundPlanBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{
      border: `1px solid ${R.borderLight}`,
      borderLeft: `3px solid ${R.tealMid}`,
      borderRadius: 4, padding: "16px 20px", marginBottom: 12,
      background: "rgba(0,165,153,0.03)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, fontFamily: R.fontMono, marginBottom: 10, letterSpacing: "0.5px" }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 13, color: R.textMid, lineHeight: 1.75, marginBottom: 4 }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// 정의 용어 행 (제2조)
function TermRow({ term, def }: { term: string; def: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, background: "rgba(0,133,124,0.08)", padding: "3px 10px", borderRadius: 4, fontFamily: R.fontMono, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{term}</span>
      <span style={{ fontSize: 14, color: R.textMid, lineHeight: 1.7 }}>{def}</span>
    </div>
  );
}

export default function TermsPage() {
  const router = useRouter();
  const [active, setActive] = useState("art1");
  const [lang, setLang] = useState<Lang>('ko'); // 언어 상태 관리

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ARTICLES.forEach(a => {
      const el = document.getElementById(a.id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          {lang === 'ko' ? '서비스 이용약관' : 'Terms of Service'}
        </span>
        <div style={{ flex: 1 }} />
        <Link href="/privacy" style={{ fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 500 }}>
          {lang === 'ko' ? '개인정보처리방침 →' : 'Privacy Policy →'}
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
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase" as const, color: R.tealBright, marginBottom: 14, fontFamily: R.fontMono }}>Terms of Service</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: R.textWhite, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {lang === 'ko' ? '서비스 이용약관' : 'Terms of Service'}
          </h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
                {lang === 'ko' ? '시행일' : 'Effective'}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>2026. 04. 09</span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>
                {lang === 'ko' ? '최종 수정' : 'Last Updated'}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>2026. 04. 09</span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(0,194,181,0.2)", color: R.tealBright, padding: "3px 10px", borderRadius: 12, fontFamily: R.fontMono }}>v1.1</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 48 }}>

        {/* TOC — lang 기반 제목 표시 */}
        <nav style={{ position: "sticky", top: 88, height: "fit-content" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: R.textLight, textTransform: "uppercase" as const, fontFamily: R.fontMono, marginBottom: 14 }}>
            {lang === 'ko' ? '목차' : 'Contents'}
          </div>
          {ARTICLES.map(a => (
            <button
              key={a.id}
              onClick={() => scrollTo(a.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", textAlign: "left", border: "none",
                padding: "8px 12px", borderRadius: 4, cursor: "pointer",
                marginBottom: 2, transition: "all 0.15s",
                borderLeft: `2px solid ${active === a.id ? (a.important ? R.danger : R.tealMid) : "transparent"}`,
                background: active === a.id ? (a.important ? "rgba(217,79,61,0.07)" : "rgba(0,165,153,0.08)") : "transparent",
              } as React.CSSProperties}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: active === a.id ? (a.important ? R.danger : R.tealMid) : R.textLight, fontFamily: R.fontMono, minWidth: 28 }}>
                {lang === 'ko' ? `제${a.num}조` : `§${a.num}`}
              </span>
              <span style={{ fontSize: 12, color: active === a.id ? R.textDark : R.textLight, fontWeight: active === a.id ? 700 : 400, lineHeight: 1.4 }}>
                {lang === 'ko' ? a.ko : a.en}
              </span>
            </button>
          ))}
        </nav>

        {/* 본문 — 각 조항 lang 분기 처리 */}
        <main>

          {/* 제1조 / Art. 1 — 목적 / Purpose */}
          <ArticleCard id="art1" num={1} title={lang === 'ko' ? "목적" : "Purpose"} lang={lang}>
            {lang === 'ko' ? (
              <P>이 약관은 <strong>(주)루시퍼</strong>(이하 "회사")가 운영하는 <strong>Clauze</strong>(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</P>
            ) : (
              <P>These Terms govern the use of <strong>Clauze</strong> (the &quot;Service&quot;) operated by <strong>Lucifer Inc.</strong> (the &quot;Company&quot;), and set forth the rights, obligations, and responsibilities between the Company and users.</P>
            )}
          </ArticleCard>

          {/* 제2조 / Art. 2 — 정의 / Definitions */}
          <ArticleCard id="art2" num={2} title={lang === 'ko' ? "정의" : "Definitions"} lang={lang}>
            {lang === 'ko' ? (
              <>
                <P>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</P>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                  <TermRow term="서비스"      def="Clauze 플랫폼을 통한 한국어 계약서 AI 분석 서비스 및 관련 제반 서비스" />
                  <TermRow term="이용자"      def="이 약관에 따라 서비스에 접속하여 회사가 제공하는 서비스를 받는 회원 및 비회원" />
                  <TermRow term="회원"        def="회사에 개인정보를 제공하여 회원 등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자" />
                  <TermRow term="유료 서비스" def="별도의 요금을 지급하고 이용하는 서비스 (Single Review, Pro, Business 플랜)" />
                  <TermRow term="콘텐츠"      def="이용자가 서비스에 업로드하는 계약서 파일, 텍스트 등 일체의 정보" />
                  <TermRow term="AI 분석 결과" def="이용자가 업로드한 계약서를 기반으로 AI가 생성한 분석 보고서 및 요약 정보" />
                </div>
              </>
            ) : (
              <>
                <P>The following terms are defined as below.</P>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                  <TermRow term="Service"      def="AI-powered Korean contract review service and related offerings provided via the Clauze platform" />
                  <TermRow term="User"         def="Any individual accessing the Service under these Terms, whether registered or not" />
                  <TermRow term="Member"       def="A registered user who has provided personal information and can use the Service continuously" />
                  <TermRow term="Paid Service" def="Services that require payment (Single Review, Pro, Business plans)" />
                  <TermRow term="Content"      def="Contract files, text, and all other information uploaded by users to the Service" />
                  <TermRow term="AI Analysis"  def="Analysis reports and summaries generated by AI based on contracts uploaded by users" />
                </div>
              </>
            )}
          </ArticleCard>

          {/* 제3조 / Art. 3 — 약관의 효력 및 변경 / Terms & Changes */}
          <ArticleCard id="art3" num={3} title={lang === 'ko' ? "약관의 효력 및 변경" : "Terms & Changes"} lang={lang}>
            {lang === 'ko' ? (
              <BulletList items={[
                "이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.",
                "회사는 합리적인 사유가 발생할 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.",
                "중요한 약관 변경의 경우 시행일로부터 최소 30일 전에 공지합니다. 이용자에게 불리한 변경의 경우 최소 30일 전 공지 후 이메일로 개별 통지합니다.",
                "변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 변경된 약관에 동의한 것으로 간주됩니다.",
              ]} />
            ) : (
              <BulletList items={[
                "These Terms take effect upon posting on the Service or other notice to users.",
                "The Company may amend these Terms for legitimate reasons; amendments will be announced via service notices.",
                "Material changes will be announced at least 30 days in advance. Changes unfavorable to users will additionally be notified by email.",
                "Continued use of the Service after the effective date of amended Terms constitutes acceptance of those amendments.",
              ]} />
            )}
          </ArticleCard>

          {/* 제4조 / Art. 4 — 서비스의 제공 및 변경 / Services */}
          <ArticleCard id="art4" num={4} title={lang === 'ko' ? "서비스의 제공 및 변경" : "Services"} lang={lang}>
            {lang === 'ko' ? (
              <>
                <SectionLabel>서비스 내용</SectionLabel>
                <BulletList items={[
                  "한국어 계약서 PDF 업로드 및 AI 기반 위험 조항 분석",
                  "조항별 위험도 분류 (고위험 / 주의 / 정상) 및 한국어·영어 동시 요약",
                  "검토 이력 저장 및 관리",
                  "기타 회사가 추가 개발하거나 제휴를 통해 제공하는 일체의 서비스",
                ]} />
                <SectionLabel>서비스 플랜</SectionLabel>
                <PlanTable lang={lang} />
                <SectionLabel>서비스 변경 및 중단</SectionLabel>
                <BulletList items={[
                  "회사는 서비스의 내용, 요금 등을 변경할 수 있으며, 변경 시 30일 전에 공지합니다.",
                  "서비스용 설비의 보수 등 공사로 인한 부득이한 경우 일시 중단할 수 있습니다.",
                  "정전, 설비 장애 또는 이용량 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우 일시 중단할 수 있습니다.",
                  "천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우 일시 중단할 수 있습니다.",
                ]} />
              </>
            ) : (
              <>
                <SectionLabel>Service Content</SectionLabel>
                <BulletList items={[
                  "Upload Korean contract PDFs and receive AI-based risk clause analysis",
                  "Risk classification per clause (High / Caution / Normal) with Korean/English summaries",
                  "Review history storage and management",
                  "Any additional services developed or provided through partnerships",
                ]} />
                <SectionLabel>Service Plans</SectionLabel>
                <PlanTable lang={lang} />
                <SectionLabel>Changes & Interruptions</SectionLabel>
                <BulletList items={[
                  "The Company may change service content or pricing with 30 days prior notice.",
                  "Service may be temporarily suspended for maintenance or infrastructure work.",
                  "Service may be interrupted due to power outages, equipment failures, or sudden traffic surges.",
                  "Force majeure events (natural disasters, national emergencies) may cause service interruptions.",
                ]} />
              </>
            )}
          </ArticleCard>

          {/* 제5조 / Art. 5 — 회원가입 및 계정 관리 / Membership */}
          <ArticleCard id="art5" num={5} title={lang === 'ko' ? "회원가입 및 계정 관리" : "Membership"} lang={lang}>
            {lang === 'ko' ? (
              <BulletList items={[
                "이용자는 회사가 정한 가입 양식에 따라 회원 정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.",
                "회원은 자신의 계정 정보를 관리할 책임이 있으며, 제3자에게 계정 정보를 제공하거나 공유하여서는 안 됩니다.",
                "회원은 계정 정보가 도용되거나 제3자가 사용하고 있음을 인지한 경우 즉시 회사에 통보하고 회사의 안내에 따라야 합니다.",
                "만 14세 미만의 아동은 회원가입을 할 수 없습니다.",
              ]} />
            ) : (
              <BulletList items={[
                "Users may register by completing the sign-up form and agreeing to these Terms.",
                "Members are responsible for managing their account credentials and must not share them with third parties.",
                "Members must immediately notify the Company upon discovering unauthorized account access.",
                "Individuals under 14 years of age may not register.",
              ]} />
            )}
          </ArticleCard>

          {/* 제6조 / Art. 6 — 유료 서비스 및 결제 / Paid Services & Payments — 전면 교체 */}
          <ArticleCard id="art6" num={6} title={lang === 'ko' ? "유료 서비스 및 결제" : "Paid Services & Payments"} lang={lang}>
            {lang === 'ko' ? (
              <>
                <P>① 유료 서비스 이용을 위해서는 사전에 요금을 납부하여야 합니다.</P>
                <P>② 결제는 <strong>Dodo Payments</strong>를 통한 국제 신용카드/체크카드 결제를 지원합니다. (Visa, Mastercard, Amex 등 220개국 카드 포함)</P>
                <P>③ 구독형 유료 서비스(Pro, Business)는 매월 자동 갱신됩니다. 이용자는 갱신일 전 언제든지 해지할 수 있습니다.</P>

                <SectionLabel>④ 서비스 플랜별 환불 정책</SectionLabel>
                <RefundPlanBox
                  title="단건 결제 — Single Review (₩9,900/건)"
                  items={[
                    "서비스 미이용 시: 결제일로부터 7일 이내 전액 환불",
                    "서비스 이용 후: 환불 불가 (AI 분석 1회 실행 = 이용으로 간주)",
                    "처리 기간: 영업일 기준 5~10일",
                  ]}
                />
                <RefundPlanBox
                  title="구독 결제 — Pro (₩17,000/월) / Business (₩79,000/월)"
                  items={[
                    "해지 시 남은 기간에 대한 요금은 환불되지 않습니다.",
                    "해지 후 현재 결제 기간 만료일까지 서비스를 계속 이용할 수 있습니다.",
                    "회사 귀책 장애(연속 24시간 이상): 이용 불가 기간 비례 환불",
                    "이중 청구 확인 시: 전액 환불",
                    "처리 기간: 영업일 기준 5~10일",
                  ]}
                />

                <P>⑤ 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라 AI 분석 결과물이 생성된 이후에는 청약철회가 제한될 수 있습니다.</P>

                <SectionLabel>⑥ 환불 요청 방법</SectionLabel>
                <div style={{ background: R.bgLight, borderRadius: 4, padding: "14px 18px", fontSize: 13, color: R.textMid, lineHeight: 2 }}>
                  <div><strong>이메일:</strong>{' '}<a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>nextidealab.ai@gmail.com</a></div>
                  <div><strong>제목:</strong> [Clauze 환불요청] 결제 이메일 주소</div>
                  <div><strong>필수 포함:</strong> 결제 이메일, 결제 일시, 결제 유형, 환불 사유</div>
                </div>

                <P style={{ marginTop: 14 }}>
                  ⑦ 자세한 환불정책 전문 →{' '}
                  <Link href="/refund" style={{ color: R.tealMid, fontWeight: 600, textDecoration: "none" }}>환불정책 보기</Link>
                </P>
              </>
            ) : (
              <>
                <P>① Advance payment is required to use paid services.</P>
                <P>② Payments are processed via <strong>Dodo Payments</strong>. International cards accepted: Visa, Mastercard, Amex, and more (220+ countries).</P>
                <P>③ Pro and Business plans renew automatically each month. You may cancel anytime before the renewal date.</P>

                <SectionLabel>④ Refund Policy by Plan</SectionLabel>
                <RefundPlanBox
                  title="Single Review — ₩9,900 per review"
                  items={[
                    "Eligible: Full refund within 7 days if AI analysis has not been executed.",
                    "Not eligible: Once AI analysis has been executed (1 use = used).",
                    "Processing time: 5–10 business days.",
                  ]}
                />
                <RefundPlanBox
                  title="Subscription — Pro ₩17,000/mo · Business ₩79,000/mo"
                  items={[
                    "No refund for unused days upon cancellation.",
                    "Service continues until the end of the current billing period.",
                    "Service outage caused by our fault (24+ hrs): Prorated refund.",
                    "Duplicate charge confirmed: Full refund.",
                    "Processing time: 5–10 business days.",
                  ]}
                />

                <P>⑤ Per the Act on Consumer Protection in Electronic Commerce (Article 17, Section 2, Item 5), refunds may be restricted once digital content (AI analysis) has been delivered.</P>

                <SectionLabel>⑥ How to Request a Refund</SectionLabel>
                <div style={{ background: R.bgLight, borderRadius: 4, padding: "14px 18px", fontSize: 13, color: R.textMid, lineHeight: 2 }}>
                  <div><strong>Email:</strong>{' '}<a href="mailto:nextidealab.ai@gmail.com" style={{ color: R.tealMid, textDecoration: "none" }}>nextidealab.ai@gmail.com</a></div>
                  <div><strong>Subject:</strong> [Clauze Refund] Your payment email</div>
                  <div><strong>Include:</strong> Payment email, date, plan type, reason.</div>
                </div>

                <P style={{ marginTop: 14 }}>
                  ⑦ Full refund policy →{' '}
                  <Link href="/refund" style={{ color: R.tealMid, fontWeight: 600, textDecoration: "none" }}>View Refund Policy</Link>
                </P>
              </>
            )}
          </ArticleCard>

          {/* 제7조 / Art. 7 — 이용자의 콘텐츠 및 개인정보 / User Content & Privacy */}
          <ArticleCard id="art7" num={7} title={lang === 'ko' ? "이용자의 콘텐츠 및 개인정보" : "User Content & Privacy"} lang={lang}>
            {lang === 'ko' ? (
              <BulletList items={[
                "이용자가 업로드하는 계약서 파일은 AI 분석 목적으로만 사용되며, 회사의 다른 용도로 사용되지 않습니다.",
                "업로드된 계약서 파일은 분석 완료 후 AI 처리 시스템(Anthropic)에서 즉시 파기됩니다. 회사 서버에는 파일 URL과 분석 결과 JSON만 보관됩니다.",
                "이용자는 타인의 개인정보나 기밀정보가 포함된 계약서를 업로드할 경우, 해당 정보 주체의 동의를 얻었음을 보증합니다.",
                "이용자는 저작권, 영업비밀 등 제3자의 권리를 침해하는 콘텐츠를 업로드하여서는 안 됩니다.",
              ]} />
            ) : (
              <BulletList items={[
                "Contract files uploaded by users are used solely for AI analysis and not for any other purpose.",
                "Uploaded contract files are immediately deleted from the AI processing system (Anthropic) after analysis. Only file URL and analysis result JSON are retained on Company servers.",
                "By uploading contracts containing third-party personal or confidential information, users warrant they have obtained the necessary consent.",
                "Users must not upload content that infringes third-party rights, including copyright or trade secrets.",
              ]} />
            )}
          </ArticleCard>

          {/* 제8조 / Art. 8 — 면책 조항 / Disclaimer */}
          <ArticleCard id="art8" num={8} title={lang === 'ko' ? "면책 조항" : "Disclaimer"} important lang={lang}>
            {lang === 'ko' ? (
              <>
                <SectionLabel>AI 분석 결과의 한계 — 법적 효력 없음</SectionLabel>
                <div style={{ background: "rgba(217,79,61,0.05)", border: `1px solid rgba(217,79,61,0.2)`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: R.textMid }}>
                    Clauze의 AI 분석 결과는 <strong>참고용 정보 제공만을 목적</strong>으로 하며, 법률적 자문이나 법적 효력을 갖는 검토 의견이 아닙니다.<br />
                    중요한 계약의 최종 검토는 반드시 자격을 갖춘 <strong>법률 전문가(변호사)</strong>와 상담하시기 바랍니다.
                  </p>
                </div>
                <BulletList items={[
                  "AI 분석 결과는 참고 목적의 정보 제공만을 위한 것이며, 법률적 조언을 구성하지 않습니다.",
                  "AI는 오류를 포함할 수 있으며, 분석 결과의 완전성, 정확성, 적시성을 보장하지 않습니다.",
                  "이용자가 AI 분석 결과에 의존하여 법적 판단을 내린 경우, 그로 인해 발생하는 손해에 대해 회사는 책임을 지지 않습니다.",
                  "서비스는 한국법에 따른 계약서를 주요 대상으로 하며, 외국법이 적용되는 계약서의 경우 분석 정확도가 낮을 수 있습니다.",
                ]} />
                <SectionLabel>서비스 중단 및 기술적 오류</SectionLabel>
                <BulletList items={[
                  "천재지변, 불가항력, 외부 API(Anthropic, Firebase, Dodo Payments) 장애 등 회사의 귀책사유 없이 발생한 서비스 중단에 대해 책임을 지지 않습니다.",
                  "이용자의 귀책사유로 인한 서비스 이용 장애에 대해서는 회사가 책임지지 않습니다.",
                ]} />
              </>
            ) : (
              <>
                <SectionLabel>Limitations of AI Analysis — Not Legal Advice</SectionLabel>
                <div style={{ background: "rgba(217,79,61,0.05)", border: `1px solid rgba(217,79,61,0.2)`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: R.textMid }}>
                    Clauze&apos;s AI analysis is provided <strong>for informational purposes only</strong> and does not constitute legal advice or a legally binding review opinion.<br />
                    For important contracts, always consult a qualified <strong>licensed attorney</strong> before making legal decisions.
                  </p>
                </div>
                <BulletList items={[
                  "AI analysis results are for reference only and do not constitute legal advice.",
                  "AI may contain errors; the Company does not guarantee completeness, accuracy, or timeliness of analysis results.",
                  "The Company is not liable for damages arising from users relying on AI analysis for legal decisions.",
                  "The Service primarily targets contracts governed by Korean law; accuracy may be lower for contracts under foreign law.",
                ]} />
                <SectionLabel>Service Interruptions & Technical Errors</SectionLabel>
                <BulletList items={[
                  "The Company is not liable for service interruptions caused by force majeure, third-party API failures (Anthropic, Firebase, Dodo Payments), or events beyond the Company's control.",
                  "The Company is not responsible for service failures arising from the user's own actions.",
                ]} />
              </>
            )}
          </ArticleCard>

          {/* 제9조 / Art. 9 — 이용자의 의무 / User Obligations */}
          <ArticleCard id="art9" num={9} title={lang === 'ko' ? "이용자의 의무" : "User Obligations"} lang={lang}>
            {lang === 'ko' ? (
              <>
                <P>이용자는 다음 행위를 하여서는 안 됩니다.</P>
                <BulletList items={[
                  "허위 정보를 기재하거나 타인의 정보를 도용하는 행위",
                  "서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 유통, 판매하는 행위",
                  "회사의 저작권, 제3자의 저작권 등 지식재산권을 침해하는 행위",
                  "서비스 운영을 방해하거나 서비스에 위해를 가하는 행위",
                  "범죄와 결부되거나 관련 법령에 위반되는 행위",
                  "타인의 명예를 손상시키거나 불이익을 주는 행위",
                  "회사의 서비스를 이용하여 얻은 AI 분석 결과를 법률 서비스 제공의 근거로 사용하는 상업적 행위",
                ]} />
              </>
            ) : (
              <>
                <P>Users must not engage in any of the following:</P>
                <BulletList items={[
                  "Providing false information or misappropriating another person's identity",
                  "Reproducing, distributing, or selling information obtained through the Service without prior Company consent",
                  "Infringing intellectual property rights of the Company or third parties",
                  "Interfering with or damaging Service operations",
                  "Engaging in activities related to criminal conduct or violating applicable laws",
                  "Harming others' reputation or causing disadvantage to others",
                  "Using AI analysis results as the basis for providing commercial legal services",
                ]} />
              </>
            )}
          </ArticleCard>

          {/* 제10조 / Art. 10 — 지식재산권 / Intellectual Property */}
          <ArticleCard id="art10" num={10} title={lang === 'ko' ? "지식재산권" : "Intellectual Property"} lang={lang}>
            {lang === 'ko' ? (
              <BulletList items={[
                "서비스 내 회사가 작성한 콘텐츠(UI 디자인, 소프트웨어, 로고 등)에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.",
                "이용자의 AI 분석 결과물은 이용자에게 귀속됩니다. 단, 회사는 서비스 개선 목적으로 비식별화된 형태의 통계 데이터를 활용할 수 있습니다.",
                "이용자는 서비스를 통해 얻은 AI 분석 결과를 개인적, 비상업적 목적으로 이용할 수 있습니다.",
              ]} />
            ) : (
              <BulletList items={[
                "Copyright and intellectual property in Company-created content (UI design, software, logos, etc.) belongs to the Company.",
                "AI analysis results generated for users belong to those users. However, the Company may use de-identified statistical data to improve the Service.",
                "Users may use AI analysis results for personal, non-commercial purposes.",
              ]} />
            )}
          </ArticleCard>

          {/* 제11조 / Art. 11 — 계약 해지 / Termination */}
          <ArticleCard id="art11" num={11} title={lang === 'ko' ? "계약 해지" : "Termination"} lang={lang}>
            {lang === 'ko' ? (
              <BulletList items={[
                "회원은 언제든지 서비스 내 설정 메뉴 또는 이메일을 통해 이용 계약 해지(탈퇴)를 신청할 수 있습니다.",
                "이용자가 이 약관을 위반한 경우 회사는 사전 통보 후 이용 계약을 해지할 수 있습니다.",
                "서비스를 이용하여 타인에게 피해를 주거나 미풍양속에 위배되는 행위를 한 경우 이용 계약을 해지할 수 있습니다.",
                "기타 회사가 정한 이용 조건에 위배되는 경우 이용 계약을 해지할 수 있습니다.",
              ]} />
            ) : (
              <BulletList items={[
                "Members may terminate their account at any time via the in-service settings menu or by email.",
                "The Company may terminate a user's account after prior notice if these Terms are violated.",
                "Account termination may occur if a user causes harm to others or engages in conduct contrary to public order.",
                "Termination may also occur for other violations of the Company's usage conditions.",
              ]} />
            )}
          </ArticleCard>

          {/* 제12조 / Art. 12 — 분쟁 해결 및 관할 법원 / Dispute Resolution */}
          <ArticleCard id="art12" num={12} title={lang === 'ko' ? "분쟁 해결 및 관할 법원" : "Dispute Resolution"} lang={lang}>
            {lang === 'ko' ? (
              <BulletList items={[
                "회사와 이용자 사이에 발생한 분쟁에 관한 소송은 대한민국 법률을 준거법으로 합니다.",
                "서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.",
              ]} />
            ) : (
              <BulletList items={[
                "These Terms are governed by the laws of the Republic of Korea.",
                "Any disputes arising from the use of the Service shall be subject to the exclusive jurisdiction of the court with jurisdiction over the Company's principal place of business.",
              ]} />
            )}
          </ArticleCard>

          {/* 제13조 / Art. 13 — 고객 문의 / Contact */}
          <ArticleCard id="art13" num={13} title={lang === 'ko' ? "고객 문의" : "Contact"} lang={lang}>
            {lang === 'ko' ? (
              <>
                <P>서비스 이용과 관련한 문의 및 불만사항은 아래 연락처로 접수해 주시기 바랍니다.</P>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", marginTop: 16 }}>
                  {([
                    ["회사명",   "(주)루시퍼"],
                    ["서비스명", "Clauze (clauze-ai.vercel.app)"],
                    ["담당자",   "박원영"],
                    ["이메일",   "nextidealab.ai@gmail.com"],
                    ["응답 시간", "영업일 기준 24시간 이내"],
                  ] as [string, string][]).map(([label, value]) => (
                    <React.Fragment key={label}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: R.textLight, textTransform: "uppercase" as const, letterSpacing: "1px", fontFamily: R.fontMono, alignSelf: "center" }}>{label}</span>
                      <span style={{ fontSize: 14, color: R.textDark, fontWeight: 500 }}>
                        {label === "이메일" ? <a href={`mailto:${value}`} style={{ color: R.tealMid, textDecoration: "none" }}>{value}</a> : value}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ marginTop: 24, padding: "12px 16px", background: R.bgLight, borderRadius: 4, fontSize: 12, color: R.textLight, fontFamily: R.fontMono }}>
                  부칙 | 본 약관은 2026년 4월 9일부터 시행됩니다.
                </div>
              </>
            ) : (
              <>
                <P>For inquiries or complaints related to the Service, please contact us at:</P>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", marginTop: 16 }}>
                  {([
                    ["Company",       "Lucifer Inc."],
                    ["Service",       "Clauze (clauze-ai.vercel.app)"],
                    ["Contact",       "Wonyoung Park"],
                    ["Email",         "nextidealab.ai@gmail.com"],
                    ["Response Time", "Within 24 business hours"],
                  ] as [string, string][]).map(([label, value]) => (
                    <React.Fragment key={label}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: R.textLight, textTransform: "uppercase" as const, letterSpacing: "1px", fontFamily: R.fontMono, alignSelf: "center" }}>{label}</span>
                      <span style={{ fontSize: 14, color: R.textDark, fontWeight: 500 }}>
                        {label === "Email" ? <a href={`mailto:${value}`} style={{ color: R.tealMid, textDecoration: "none" }}>{value}</a> : value}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ marginTop: 24, padding: "12px 16px", background: R.bgLight, borderRadius: 4, fontSize: 12, color: R.textLight, fontFamily: R.fontMono }}>
                  Addendum | These Terms take effect from April 9, 2026.
                </div>
              </>
            )}
          </ArticleCard>

        </main>
      </div>

      {/* Footer */}
      <footer style={{ background: R.bgDark, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 Clauze. (주)루시퍼. All rights reserved.</div>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            <Link href="/terms" style={{ color: R.tealBright, textDecoration: "none", fontWeight: 600 }}>
              {lang === 'ko' ? '이용약관' : 'Terms'}
            </Link>
            <Link href="/privacy" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
            </Link>
            <Link href="/refund" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              {lang === 'ko' ? '환불정책' : 'Refund Policy'}
            </Link>
            <a href="mailto:nextidealab.ai@gmail.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>nextidealab.ai@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// React import — React.Fragment 사용을 위해 필요
import React from "react";
