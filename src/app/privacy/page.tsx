// src/app/privacy/page.tsx
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
  { id: "art1",  num: 1,  title: "수집하는 개인정보 항목 및 수집 방법" },
  { id: "art2",  num: 2,  title: "개인정보의 수집 및 이용 목적" },
  { id: "art3",  num: 3,  title: "개인정보의 보유 및 이용 기간" },
  { id: "art4",  num: 4,  title: "개인정보의 제3자 제공" },
  { id: "art5",  num: 5,  title: "개인정보 처리 업무의 위탁" },
  { id: "art6",  num: 6,  title: "이용자의 권리와 의무" },
  { id: "art7",  num: 7,  title: "개인정보의 파기 절차 및 방법" },
  { id: "art8",  num: 8,  title: "쿠키의 설치·운영 및 거부" },
  { id: "art9",  num: 9,  title: "개인정보의 안전성 확보 조치" },
  { id: "art10", num: 10, title: "개인정보 보호책임자" },
  { id: "art11", num: 11, title: "권익침해 구제 방법" },
  { id: "art12", num: 12, title: "개인정보처리방침의 변경" },
];

function ArticleCard({ id, num, title, children }: {
  id: string; num: number; title: string; children: React.ReactNode;
}) {
  return (
    <div id={id} style={{
      background: R.bgWhite, borderRadius: R.cardRadius,
      borderLeft: `4px solid ${R.tealMid}`,
      padding: "32px 36px", marginBottom: 24,
      boxShadow: "0 2px 12px rgba(4,34,40,0.07)",
      scrollMarginTop: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", padding: "3px 12px",
          borderRadius: 12, fontSize: 11, fontWeight: 700, fontFamily: R.fontMono,
          background: R.tealMid, color: R.textWhite, flexShrink: 0,
        }}>제{num}조</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: R.textDark, margin: 0, fontFamily: R.fontSans, letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      <div style={{ fontSize: 14, color: R.textMid, lineHeight: 1.8, fontFamily: R.fontSans }}>
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" as const,
      color: R.tealDark, fontFamily: R.fontMono, marginTop: 20, marginBottom: 10,
    }}>{children}</div>
  );
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

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 10px", lineHeight: 1.8 }}>{children}</p>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ borderRadius: R.cardRadius, overflow: "hidden", border: `1px solid ${R.borderLight}`, marginTop: 12, marginBottom: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)`, background: R.tealMid }}>
        {headers.map(h => (
          <div key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: R.textWhite, letterSpacing: "1px", textTransform: "uppercase" as const, fontFamily: R.fontMono }}>{h}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)`, background: i % 2 === 0 ? R.bgWhite : R.bgLight, borderTop: `1px solid ${R.borderLight}` }}>
          {row.map((cell, j) => (
            <div key={j} style={{ padding: "12px 16px", fontSize: 13, color: j === 0 ? R.textDark : R.textMid, fontWeight: j === 0 ? 600 : 400, fontFamily: j === 0 ? R.fontSans : R.fontSans, lineHeight: 1.6 }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PrivacyPage() {
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
        <span style={{ fontSize: 13, color: R.textLight }}>개인정보처리방침</span>
        <div style={{ flex: 1 }} />
        <Link href="/terms" style={{ fontSize: 13, color: R.textMid, textDecoration: "none", fontWeight: 500 }}>이용약관 →</Link>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: `1px solid ${R.borderLight}`, borderRadius: R.btnRadius, padding: "7px 18px", fontSize: 13, color: R.textMid, cursor: "pointer", fontWeight: 600 }}
        >← Back</button>
      </nav>

      {/* Hero */}
      <div style={{ background: R.bgDark, padding: "56px 40px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "-5%", bottom: "-30%", width: "30%", height: "160%", borderRadius: "50%", background: "rgba(0,165,153,0.07)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase" as const, color: R.tealBright, marginBottom: 14, fontFamily: R.fontMono }}>Privacy Policy</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: R.textWhite, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>개인정보처리방침</h1>
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
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 20, marginBottom: 0, lineHeight: 1.7, maxWidth: 680 }}>
            (주)루시퍼는 Clauze 서비스 운영과 관련하여 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 보호합니다.
          </p>
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
                display: "flex", alignItems: "flex-start", gap: 8,
                width: "100%", textAlign: "left", border: "none", background: "none",
                padding: "8px 12px", borderRadius: 4, cursor: "pointer",
                marginBottom: 2, transition: "all 0.15s",
                borderLeft: `2px solid ${active === a.id ? R.tealMid : "transparent"}`,
                background: active === a.id ? "rgba(0,165,153,0.08)" : "transparent",
              } as React.CSSProperties}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: active === a.id ? R.tealMid : R.textLight, fontFamily: R.fontMono, minWidth: 28, paddingTop: 1 }}>제{a.num}조</span>
              <span style={{ fontSize: 12, color: active === a.id ? R.textDark : R.textLight, fontWeight: active === a.id ? 700 : 400, lineHeight: 1.4 }}>{a.title}</span>
            </button>
          ))}
        </nav>

        {/* Articles */}
        <main>
          {/* 제1조 */}
          <ArticleCard id="art1" num={1} title="수집하는 개인정보 항목 및 수집 방법">
            <SectionLabel>수집 항목</SectionLabel>
            <DataTable
              headers={["구분", "수집 항목"]}
              rows={[
                ["필수 (회원가입)", "이메일 주소, 비밀번호(암호화 저장), 서비스 가입일시"],
                ["자동 수집", "IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 기기 정보"],
                ["결제 시 (Pro/Business)", "Stripe를 통해 처리 — 회사는 카드번호를 직접 저장하지 않음"],
                ["Google 소셜 로그인", "Google 계정 이메일, 프로필 이름 (Google이 제공하는 범위 내)"],
              ]}
            />
            <SectionLabel>수집 방법</SectionLabel>
            <BulletList items={[
              "회원가입 및 서비스 이용 과정에서 이용자가 직접 입력",
              "서비스 이용 과정에서 자동 생성 및 수집",
              "Google, Firebase 등 제3자 서비스를 통한 간접 수집",
            ]} />
          </ArticleCard>

          {/* 제2조 */}
          <ArticleCard id="art2" num={2} title="개인정보의 수집 및 이용 목적">
            <P>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</P>
            <DataTable
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
          </ArticleCard>

          {/* 제3조 */}
          <ArticleCard id="art3" num={3} title="개인정보의 보유 및 이용 기간">
            <P>회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 일정 기간 보존이 필요한 경우 아래와 같이 보관합니다.</P>
            <SectionLabel>법령에 따른 보존 기간</SectionLabel>
            <DataTable
              headers={["보존 항목", "보존 근거", "보존 기간"]}
              rows={[
                ["계약 또는 청약철회에 관한 기록", "전자상거래법", "5년"],
                ["대금결제 및 재화 공급에 관한 기록", "전자상거래법", "5년"],
                ["소비자 불만 또는 분쟁처리에 관한 기록", "전자상거래법", "3년"],
                ["접속 로그, IP 주소", "통신비밀보호법", "3개월"],
              ]}
            />
            <SectionLabel>회원 탈퇴 시</SectionLabel>
            <P>회원 탈퇴 시 개인정보는 즉시 파기하는 것을 원칙으로 하되, 위 법령 보존 기간에 해당하는 정보는 해당 기간 동안 분리 보관 후 파기합니다.</P>
          </ArticleCard>

          {/* 제4조 */}
          <ArticleCard id="art4" num={4} title="개인정보의 제3자 제공">
            <P>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</P>
            <BulletList items={[
              "이용자가 사전에 동의한 경우",
              "법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우",
            ]} />
          </ArticleCard>

          {/* 제5조 */}
          <ArticleCard id="art5" num={5} title="개인정보 처리 업무의 위탁">
            <P>회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</P>
            <DataTable
              headers={["수탁업체", "위탁 업무 내용", "보유 기간"]}
              rows={[
                ["Google Firebase", "회원 인증, 데이터 저장, 파일 스토리지", "회원 탈퇴 시까지"],
                ["Anthropic", "계약서 AI 분석 처리 (업로드 PDF 일시 처리)", "분석 완료 즉시 파기"],
                ["Stripe", "결제 처리 및 구독 관리", "법정 보존 기간"],
                ["Vercel", "서비스 호스팅 및 배포", "서비스 운영 기간"],
              ]}
            />
          </ArticleCard>

          {/* 제6조 */}
          <ArticleCard id="art6" num={6} title="이용자의 권리와 의무">
            <P>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</P>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              {["개인정보 열람 요구", "오류 정정 요구", "삭제 요구", "처리 정지 요구"].map(right => (
                <div key={right} style={{
                  padding: "12px 16px", background: R.bgLight, borderRadius: 4,
                  border: `1px solid ${R.borderLight}`, fontSize: 13, color: R.textDark,
                  fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: R.tealMid, fontSize: 16 }}>✓</span> {right}
                </div>
              ))}
            </div>
            <P style={{ marginTop: 16 }}>위 권리 행사는 서비스 내 설정 메뉴 또는 개인정보 보호책임자에게 이메일로 요청하실 수 있으며, 회사는 지체 없이 조치하겠습니다.</P>
          </ArticleCard>

          {/* 제7조 */}
          <ArticleCard id="art7" num={7} title="개인정보의 파기 절차 및 방법">
            <SectionLabel>파기 절차</SectionLabel>
            <P>이용자가 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보 보호 사유에 따라 일정 기간 저장된 후 파기됩니다.</P>
            <SectionLabel>파기 방법</SectionLabel>
            <BulletList items={[
              "전자적 파일 형태: 복구가 불가능한 방법으로 영구 삭제",
              "종이 문서: 분쇄기로 분쇄하거나 소각",
            ]} />
          </ArticleCard>

          {/* 제8조 */}
          <ArticleCard id="art8" num={8} title="쿠키의 설치·운영 및 거부">
            <P>회사는 이용자에게 맞춤화된 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다. 쿠키는 웹사이트가 이용자의 브라우저에 전송하는 소량의 텍스트 파일입니다.</P>
            <SectionLabel>쿠키 수집 목적</SectionLabel>
            <BulletList items={[
              "로그인 상태 유지 (Firebase Authentication 세션)",
              "서비스 이용 환경 설정 (언어 설정, 다크모드 등) 저장",
              "서비스 이용 통계 분석",
            ]} />
            <SectionLabel>쿠키 거부 방법</SectionLabel>
            <P>이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 로그인이 필요한 서비스 이용에 어려움이 발생할 수 있습니다.</P>
          </ArticleCard>

          {/* 제9조 */}
          <ArticleCard id="art9" num={9} title="개인정보의 안전성 확보 조치">
            <P>회사는 개인정보 보호법에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.</P>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {[
                { label: "관리적 조치", desc: "개인정보 접근 권한의 최소화, 정기 교육 실시" },
                { label: "기술적 조치", desc: "개인정보 암호화 저장(Firebase 보안), HTTPS 통신, Firebase Security Rules 적용" },
                { label: "물리적 조치", desc: "전산실 및 서버 보안 구역 접근 통제 (Google Cloud 인프라)" },
                { label: "결제 정보", desc: "PCI-DSS 인증 Stripe를 통해 처리 — 카드 정보 직접 저장 없음" },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: R.tealDark, background: "rgba(0,133,124,0.08)", padding: "3px 10px", borderRadius: 4, fontFamily: R.fontMono, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 14, color: R.textMid, lineHeight: 1.7 }}>{desc}</span>
                </div>
              ))}
            </div>
          </ArticleCard>

          {/* 제10조 */}
          <ArticleCard id="art10" num={10} title="개인정보 보호책임자">
            <P>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 이용자의 불만 처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</P>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 24px", marginTop: 16, fontSize: 14 }}>
              {[
                ["회사명", "(주)루시퍼"],
                ["담당자", "박원영"],
                ["이메일", "nextidealab.ai@gmail.com"],
                ["서비스 URL", "https://clauze.io"],
              ].map(([label, value]) => (
                <>
                  <span key={`l-${label}`} style={{ fontSize: 11, fontWeight: 700, color: R.textLight, textTransform: "uppercase" as const, letterSpacing: "1px", fontFamily: R.fontMono, alignSelf: "center" }}>{label}</span>
                  <span key={`v-${value}`} style={{ fontSize: 14, color: R.textDark, fontWeight: 500 }}>
                    {label === "이메일" ? <a href={`mailto:${value}`} style={{ color: R.tealMid, textDecoration: "none" }}>{value}</a> : value}
                  </span>
                </>
              ))}
            </div>
            <P style={{ marginTop: 16 }}>이용자는 서비스를 이용하면서 발생하는 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 위의 이메일로 문의하실 수 있습니다.</P>
          </ArticleCard>

          {/* 제11조 */}
          <ArticleCard id="art11" num={11} title="권익침해 구제 방법">
            <P>이용자는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.</P>
            <DataTable
              headers={["기관", "연락처"]}
              rows={[
                ["개인정보 침해신고센터", "(국번없이) 118 / privacy.kisa.or.kr"],
                ["개인정보 분쟁조정위원회", "(국번없이) 1833-6972 / www.kopico.go.kr"],
                ["대검찰청 사이버수사과", "(국번없이) 1301 / www.spo.go.kr"],
                ["경찰청 사이버안전국", "(국번없이) 182 / ecrm.cyber.go.kr"],
              ]}
            />
          </ArticleCard>

          {/* 제12조 */}
          <ArticleCard id="art12" num={12} title="개인정보처리방침의 변경">
            <BulletList items={[
              "이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.",
              "중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.",
            ]} />
            <div style={{ marginTop: 24, padding: "12px 16px", background: R.bgLight, borderRadius: 4, fontSize: 12, color: R.textLight, fontFamily: R.fontMono }}>
              부칙 | 본 방침은 2026년 4월 1일부터 시행됩니다.
            </div>
          </ArticleCard>
        </main>
      </div>

      {/* Footer */}
      <footer style={{ background: R.bgDark, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 Clauze. (주)루시퍼. All rights reserved.</div>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>이용약관</Link>
            <Link href="/privacy" style={{ color: R.tealBright, textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</Link>
            <a href="mailto:nextidealab.ai@gmail.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>nextidealab.ai@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
