// src/app/terms/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const R = {
  bgWhite: "#FFFFFF", bgLight: "#F6F7FB", bgDark: "#093944", bgMid: "#0D4F5C",
  tealBright: "#00C2B5", tealMid: "#00A599", tealDark: "#00857C", tealBtn: "#00C2B5",
  textDark: "#042228", textMid: "#3D5A5E", textLight: "#7A9A9E",
  textWhite: "#FFFFFF", borderLight: "rgba(4,34,40,0.1)", borderDark: "rgba(255,255,255,0.15)",
  danger: "#D94F3D", warning: "#E59A1A", success: "#1A9E6A",
  btnRadius: "28px", cardRadius: "4px",
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
};

const ARTICLES = [
  { id: "art1",  num: 1,  title: "목적" },
  { id: "art2",  num: 2,  title: "정의" },
  { id: "art3",  num: 3,  title: "약관의 효력 및 변경" },
  { id: "art4",  num: 4,  title: "서비스의 제공 및 변경" },
  { id: "art5",  num: 5,  title: "회원가입 및 계정 관리" },
  { id: "art6",  num: 6,  title: "유료 서비스 및 결제" },
  { id: "art7",  num: 7,  title: "이용자의 콘텐츠 및 개인정보" },
  { id: "art8",  num: 8,  title: "면책 조항", important: true },
  { id: "art9",  num: 9,  title: "이용자의 의무" },
  { id: "art10", num: 10, title: "지식재산권" },
  { id: "art11", num: 11, title: "계약 해지" },
  { id: "art12", num: 12, title: "분쟁 해결 및 관할 법원" },
  { id: "art13", num: 13, title: "고객 문의" },
];

function ArticleBadge({ num, important }: { num: number; important?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "3px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700,
      fontFamily: R.fontMono, letterSpacing: "0.5px",
      background: important ? R.danger : R.tealMid,
      color: R.textWhite, flexShrink: 0,
    }}>제{num}조</span>
  );
}

function ArticleCard({ id, num, title, important, children }: {
  id: string; num: number; title: string; important?: boolean; children: React.ReactNode;
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
        <ArticleBadge num={num} important={important} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: R.textDark, margin: 0, fontFamily: R.fontSans, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {important && (
          <span style={{ fontSize: 11, fontWeight: 700, color: R.danger, border: `1px solid ${R.danger}`, borderRadius: 4, padding: "2px 8px", fontFamily: R.fontSans }}>중요</span>
        )}
      </div>
      {important && (
        <div style={{
          background: "rgba(217,79,61,0.07)", border: `1px solid rgba(217,79,61,0.25)`,
          borderRadius: 4, padding: "12px 16px", marginBottom: 20,
          fontSize: 13, color: R.danger, lineHeight: 1.65, fontFamily: R.fontSans,
        }}>
          <strong>⚠ 법적 면책 고지:</strong> 이 조항은 서비스 이용 전 반드시 확인하세요.
        </div>
      )}
      <div style={{ fontSize: 14, color: R.textMid, lineHeight: 1.8, fontFamily: R.fontSans }}>
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 10px", lineHeight: 1.8 }}>{children}</p>;
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

function PlanTable() {
  const plans = [
    { plan: "Free", price: "무료", features: "월 2건 검토, 한국어 요약 제공" },
    { plan: "Pro", price: "월 19,000원", features: "무제한 검토, 한/영 번역, 위험 조항 하이라이트" },
    { plan: "Business", price: "월 79,000원", features: "팀 5인, 커스텀 체크리스트, 우선 처리" },
  ];
  return (
    <div style={{ borderRadius: R.cardRadius, overflow: "hidden", border: `1px solid ${R.borderLight}`, marginTop: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", background: R.tealMid }}>
        {["플랜", "요금", "주요 내용"].map(h => (
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

export default function TermsPage() {
  const router = useRouter();
  const [active, setActive] = useState("art1");
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
        <span style={{ fontSize: 13, color: R.textLight, fontFamily: R.fontSans }}>서비스 이용약관</span>
        <div style={{ flex: 1 }} />
        <Link href="/privacy" style={{ fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 500 }}>개인정보처리방침 →</Link>
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
          <h1 style={{ fontSize: 38, fontWeight: 800, color: R.textWhite, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>서비스 이용약관</h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>시행일</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>2026. 04. 01</span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: R.tealBright, fontFamily: R.fontMono }}>최종 수정</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: R.fontMono }}>2026. 03. 27</span>
            </div>
            <div style={{ width: 1, height: 12, background: R.borderDark }} />
            <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(0,194,181,0.2)", color: R.tealBright, padding: "3px 10px", borderRadius: 12, fontFamily: R.fontMono }}>v1.0</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 48 }}>

        {/* TOC */}
        <nav style={{ position: "sticky", top: 88, height: "fit-content" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: R.textLight, textTransform: "uppercase" as const, fontFamily: R.fontMono, marginBottom: 14 }}>목차</div>
          {ARTICLES.map(a => (
            <button
              key={a.id}
              onClick={() => scrollTo(a.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", textAlign: "left", border: "none", background: "none",
                padding: "8px 12px", borderRadius: 4, cursor: "pointer",
                marginBottom: 2, transition: "all 0.15s",
                borderLeft: `2px solid ${active === a.id ? (a.important ? R.danger : R.tealMid) : "transparent"}`,
                background: active === a.id ? (a.important ? "rgba(217,79,61,0.07)" : "rgba(0,165,153,0.08)") : "transparent",
              } as React.CSSProperties}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: active === a.id ? (a.important ? R.danger : R.tealMid) : R.textLight, fontFamily: R.fontMono, minWidth: 28 }}>제{a.num}조</span>
              <span style={{ fontSize: 12, color: active === a.id ? R.textDark : R.textLight, fontWeight: active === a.id ? 700 : 400, lineHeight: 1.4 }}>{a.title}</span>
            </button>
          ))}
        </nav>

        {/* Articles */}
        <main>
          <ArticleCard id="art1" num={1} title="목적">
            <P>이 약관은 <strong>(주)루시퍼</strong>(이하 "회사")가 운영하는 <strong>Clauze</strong>(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</P>
          </ArticleCard>

          <ArticleCard id="art2" num={2} title="정의">
            <P>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</P>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {[
                { term: "서비스", def: '회사가 제공하는 Clauze 플랫폼을 통한 한국어 계약서 AI 분석 서비스 및 관련 제반 서비스' },
                { term: "이용자", def: '이 약관에 따라 서비스에 접속하여 회사가 제공하는 서비스를 받는 회원 및 비회원' },
                { term: "회원", def: '회사에 개인정보를 제공하여 회원 등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자' },
                { term: "유료 서비스", def: '회사가 제공하는 서비스 중 별도의 요금을 지급하고 이용하는 서비스 (Pro, Business 플랜 등)' },
                { term: "콘텐츠", def: '이용자가 서비스에 업로드하는 계약서 파일, 텍스트 등 일체의 정보' },
                { term: "AI 분석 결과", def: '이용자가 업로드한 계약서를 기반으로 AI가 생성한 분석 보고서 및 요약 정보' },
              ].map(({ term, def }) => (
                <div key={term} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: R.tealDark, background: "rgba(0,133,124,0.08)", padding: "3px 10px", borderRadius: 4, fontFamily: R.fontMono, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{term}</span>
                  <span style={{ fontSize: 14, color: R.textMid, lineHeight: 1.7 }}>{def}</span>
                </div>
              ))}
            </div>
          </ArticleCard>

          <ArticleCard id="art3" num={3} title="약관의 효력 및 변경">
            <BulletList items={[
              "이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.",
              "회사는 합리적인 사유가 발생할 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.",
              "중요한 약관 변경의 경우 시행일로부터 최소 30일 전에 공지합니다. 단, 이용자에게 불리한 변경의 경우에는 최소 30일 전 공지 후 이메일로 개별 통지합니다.",
              "이용자는 변경된 약관에 동의하지 않을 권리가 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 변경된 약관에 동의한 것으로 간주됩니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art4" num={4} title="서비스의 제공 및 변경">
            <SectionLabel>서비스 내용</SectionLabel>
            <BulletList items={[
              "한국어 계약서 PDF 업로드 및 AI 기반 위험 조항 분석",
              "조항별 위험도 분류 (고위험 / 주의 / 정상) 및 한국어·영어 동시 요약",
              "검토 이력 저장 및 관리",
              "기타 회사가 추가 개발하거나 제휴를 통해 제공하는 일체의 서비스",
            ]} />
            <SectionLabel>서비스 플랜</SectionLabel>
            <PlanTable />
            <SectionLabel>서비스 변경 및 중단</SectionLabel>
            <BulletList items={[
              "회사는 서비스의 내용, 요금 등을 변경할 수 있으며, 변경 시 30일 전에 공지합니다.",
              "서비스용 설비의 보수 등 공사로 인한 부득이한 경우 일시 중단할 수 있습니다.",
              "정전, 제반 설비의 장애 또는 이용량 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우 일시 중단할 수 있습니다.",
              "기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우 일시 중단할 수 있습니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art5" num={5} title="회원가입 및 계정 관리">
            <BulletList items={[
              "이용자는 회사가 정한 가입 양식에 따라 회원 정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.",
              "회원은 자신의 계정 정보를 관리할 책임이 있으며, 제3자에게 계정 정보를 제공하거나 공유하여서는 안 됩니다.",
              "회원은 계정 정보가 도용되거나 제3자가 사용하고 있음을 인지한 경우 즉시 회사에 통보하고 회사의 안내에 따라야 합니다.",
              "만 14세 미만의 아동은 회원가입을 할 수 없습니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art6" num={6} title="유료 서비스 및 결제">
            <BulletList items={[
              "유료 서비스 이용을 위해서는 사전에 요금을 납부하여야 합니다.",
              "결제는 Stripe를 통한 신용카드/체크카드 결제를 지원합니다.",
              "구독형 유료 서비스는 매월 자동 갱신됩니다. 이용자는 갱신일 전 언제든지 해지할 수 있습니다.",
              "해지 시 남은 기간에 대한 요금은 환불되지 않으며, 해지 시점부터 다음 갱신일까지 서비스를 계속 이용할 수 있습니다.",
              "회사의 귀책사유로 서비스 이용이 불가한 경우 해당 기간에 대한 요금을 환불합니다.",
              "결제와 관련한 분쟁은 이용자와 카드사 간에 해결하는 것을 원칙으로 하되, 회사는 필요 시 협조합니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art7" num={7} title="이용자의 콘텐츠 및 개인정보">
            <BulletList items={[
              "이용자가 업로드하는 계약서 파일은 AI 분석 목적으로만 사용되며, 회사의 다른 용도로 사용되지 않습니다.",
              "업로드된 계약서 파일은 분석 완료 후 AI 처리 시스템(Anthropic)에서 즉시 파기됩니다. 회사 서버에는 파일 URL과 분석 결과 JSON만 보관됩니다.",
              "이용자는 타인의 개인정보나 기밀정보가 포함된 계약서를 업로드할 경우, 해당 정보 주체의 동의를 얻었음을 보증합니다.",
              "이용자는 저작권, 영업비밀 등 제3자의 권리를 침해하는 콘텐츠를 업로드하여서는 안 됩니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art8" num={8} title="면책 조항" important>
            <SectionLabel>AI 분석 결과의 한계 — 법적 효력 없음</SectionLabel>
            <div style={{ background: "rgba(217,79,61,0.05)", border: `1px solid rgba(217,79,61,0.2)`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: R.textMid }}>
                Clauze의 AI 분석 결과는 <strong>참고용 정보 제공만을 목적</strong>으로 하며, 법률적 자문이나 법적 효력을 갖는 검토 의견이 아닙니다.<br/>
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
              "회사는 천재지변, 불가항력, 외부 API(Anthropic, Firebase, Stripe) 장애 등 회사의 귀책사유 없이 발생한 서비스 중단에 대해 책임을 지지 않습니다.",
              "이용자의 귀책사유로 인한 서비스 이용 장애에 대해서는 회사가 책임지지 않습니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art9" num={9} title="이용자의 의무">
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
          </ArticleCard>

          <ArticleCard id="art10" num={10} title="지식재산권">
            <BulletList items={[
              "서비스 내 회사가 작성한 콘텐츠(UI 디자인, 소프트웨어, 로고 등)에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.",
              "이용자의 AI 분석 결과물은 이용자에게 귀속됩니다. 단, 회사는 서비스 개선 목적으로 비식별화된 형태의 통계 데이터를 활용할 수 있습니다.",
              "이용자는 서비스를 통해 얻은 AI 분석 결과를 개인적, 비상업적 목적으로 이용할 수 있습니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art11" num={11} title="계약 해지">
            <BulletList items={[
              "회원은 언제든지 서비스 내 설정 메뉴 또는 이메일을 통해 이용 계약 해지(탈퇴)를 신청할 수 있습니다.",
              "이용자가 이 약관을 위반한 경우 회사는 사전 통보 후 이용 계약을 해지할 수 있습니다.",
              "서비스를 이용하여 타인에게 피해를 주거나 미풍양속에 위배되는 행위를 한 경우 이용 계약을 해지할 수 있습니다.",
              "기타 회사가 정한 이용 조건에 위배되는 경우 이용 계약을 해지할 수 있습니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art12" num={12} title="분쟁 해결 및 관할 법원">
            <BulletList items={[
              "회사와 이용자 사이에 발생한 분쟁에 관한 소송은 대한민국 법률을 준거법으로 합니다.",
              "서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.",
            ]} />
          </ArticleCard>

          <ArticleCard id="art13" num={13} title="고객 문의">
            <P>서비스 이용과 관련한 문의 및 불만사항은 아래 연락처로 접수해 주시기 바랍니다.</P>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", marginTop: 16, fontSize: 14 }}>
              {[
                ["회사명", "(주)루시퍼"],
                ["서비스명", "Clauze (clauze.io)"],
                ["담당자", "박원영"],
                ["이메일", "nextidealab.ai@gmail.com"],
                ["응답 시간", "영업일 기준 24시간 이내"],
              ].map(([label, value]) => (
                <>
                  <span key={`l-${label}`} style={{ fontSize: 11, fontWeight: 700, color: R.textLight, textTransform: "uppercase" as const, letterSpacing: "1px", fontFamily: R.fontMono, alignSelf: "center" }}>{label}</span>
                  <span key={`v-${value}`} style={{ fontSize: 14, color: R.textDark, fontWeight: 500 }}>
                    {label === "이메일" ? <a href={`mailto:${value}`} style={{ color: R.tealMid, textDecoration: "none" }}>{value}</a> : value}
                  </span>
                </>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: "12px 16px", background: R.bgLight, borderRadius: 4, fontSize: 12, color: R.textLight, fontFamily: R.fontMono }}>
              부칙 | 본 약관은 2026년 4월 1일부터 시행됩니다.
            </div>
          </ArticleCard>
        </main>
      </div>

      {/* Footer */}
      <footer style={{ background: R.bgDark, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 Clauze. (주)루시퍼. All rights reserved.</div>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            <Link href="/terms" style={{ color: R.tealBright, textDecoration: "none", fontWeight: 600 }}>이용약관</Link>
            <Link href="/privacy" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>개인정보처리방침</Link>
            <a href="mailto:nextidealab.ai@gmail.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>nextidealab.ai@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
