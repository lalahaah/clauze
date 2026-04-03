// src/components/landing/DifferentiationSection.tsx
// 핵심 기능 섹션 — Clauze의 가치 자체를 자신감있게 소개
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// 디자인 토큰
const T = {
  bgDark: '#093944',
  bgLight: '#F6F7FB',
  bgCard: '#FFFFFF',
  teal: '#00A599',
  tealBr: '#00C2B5',
  amber: '#F59E0B',
  text: '#042228',
  textMid: '#3D5A5E',
  textLt: '#7A9A9E',
  border: 'rgba(4,34,40,0.08)',
  borderDk: 'rgba(255,255,255,0.10)',
  fontSans: "'DM Sans', -apple-system, sans-serif",
  fontMono: "'DM Mono', monospace",
}

// ─── Mini Mock 컴포넌트들 ─────────────────────────────────────────────────────

// 카드 1: 이력 참조 배너 미리보기
function PatternAlertMock() {
  return (
    <div style={{
      background: '#FFF8E6',
      borderLeft: '4px solid #F59E0B',
      borderRadius: 4,
      padding: '12px 14px',
      marginTop: 20,
    }}>
      <div style={{
        fontFamily: T.fontSans,
        fontSize: 12,
        fontWeight: 700,
        color: '#92400E',
        marginBottom: 4,
      }}>
        📋 이전 이력 참조 — &apos;대금 지급 조건&apos; 조항이
      </div>
      <div style={{
        fontFamily: T.fontSans,
        fontSize: 12,
        color: '#92400E',
        lineHeight: 1.5,
        marginBottom: 6,
      }}>
        A사와의 계약 2건에서 반복 확인되었습니다
      </div>
      <div style={{
        fontFamily: T.fontSans,
        fontSize: 11,
        color: '#B45309',
        lineHeight: 1.5,
      }}>
        History match: This clause has appeared in 2 previous reviews with this client.
      </div>
    </div>
  )
}

// 카드 2: 이메일 초안 카드 미리보기
function EmailDraftMock() {
  const [tab, setTab] = useState<'ko' | 'en'>('ko')
  return (
    <div style={{
      background: T.bgLight,
      borderRadius: 6,
      padding: '14px 16px',
      marginTop: 20,
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        fontFamily: T.fontSans,
        fontSize: 11,
        fontWeight: 700,
        color: T.textMid,
        letterSpacing: '0.8px',
        textTransform: 'uppercase' as const,
        marginBottom: 10,
      }}>
        협상 이메일 초안 생성됨
      </div>
      {/* 탭 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {(['ko', 'en'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '3px 10px',
              borderRadius: 20,
              border: `1px solid ${tab === t ? T.teal : T.border}`,
              background: tab === t ? T.teal : 'transparent',
              color: tab === t ? '#fff' : T.textMid,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: T.fontSans,
              cursor: 'pointer',
            }}
          >
            {t === 'ko' ? '한국어 ✓' : 'English'}
          </button>
        ))}
      </div>
      {/* 본문 미리보기 2줄 */}
      <p style={{
        fontFamily: T.fontSans,
        fontSize: 12,
        color: T.textMid,
        lineHeight: 1.6,
        margin: '0 0 10px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical' as const,
      }}>
        {tab === 'ko'
          ? '안녕하세요. 계약서 검토 중 제7조 대금 지급 조건 조항에 대해 수정을 요청드리고자 합니다...'
          : 'Dear Sir/Madam, I am writing to request a revision of Article 7 regarding payment terms in the contract...'}
      </p>
      {/* 버튼 */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['클립보드 복사', 'Gmail로 열기 →'].map(label => (
          <button
            key={label}
            style={{
              padding: '5px 10px',
              borderRadius: 20,
              border: `1px solid ${T.border}`,
              background: 'transparent',
              color: T.text,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: T.fontSans,
              cursor: 'default',
            }}
          >{label}</button>
        ))}
      </div>
    </div>
  )
}

// 카드 3: 업종 선택 버튼 미리보기 (데모용 상태 변경 가능)
const INDUSTRIES = [
  { id: 'it', label: '💻 IT 프리랜서', focus: 'IP 귀속 · 소스코드 공개 · 유지보수 범위 · 비경쟁 조항' },
  { id: 'creator', label: '🎨 크리에이터', focus: '콘텐츠 소유권 · 수익 배분 · 독점 계약 · 저작인격권' },
  { id: 'rental', label: '🏠 임대차', focus: '보증금 반환 · 관리비 항목 · 계약 해지 조건 · 수선 의무' },
  { id: 'labor', label: '👔 근로/용역', focus: '급여 조건 · 퇴직금 · 업무 범위 · 전속 의무' },
  { id: 'general', label: '📄 일반', focus: '손해배상 한도 · 분쟁 해결 · 계약 해지 · 비밀유지' },
]

function IndustrySelectorMock() {
  const [selected, setSelected] = useState('it')
  const current = INDUSTRIES.find(i => i.id === selected)
  return (
    <div style={{ marginTop: 20 }}>
      {/* 업종 pill 버튼 5개 */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 12 }}>
        {INDUSTRIES.map(ind => (
          <button
            key={ind.id}
            onClick={() => setSelected(ind.id)}
            style={{
              padding: '5px 11px',
              borderRadius: 20,
              border: `1px solid ${selected === ind.id ? T.teal : T.border}`,
              background: selected === ind.id ? T.teal : 'transparent',
              color: selected === ind.id ? '#fff' : T.textMid,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: T.fontSans,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >{ind.label}</button>
        ))}
      </div>
      {/* 중점 검토 항목 */}
      <div style={{
        background: T.bgLight,
        borderRadius: 4,
        padding: '10px 12px',
        border: `1px solid ${T.border}`,
      }}>
        <span style={{
          fontFamily: T.fontSans,
          fontSize: 11,
          fontWeight: 700,
          color: T.teal,
        }}>
          중점 검토:&nbsp;
        </span>
        <span style={{
          fontFamily: T.fontSans,
          fontSize: 11,
          color: T.textMid,
        }}>
          {current?.focus}
        </span>
      </div>
    </div>
  )
}

// ─── 피처 카드 데이터 ─────────────────────────────────────────────────────────

const CARDS = [
  {
    num: '01',
    numColor: T.teal,
    borderColor: T.teal,
    titleEn: 'Gets smarter as you review more',
    titleKo: '계약이 쌓일수록 똑똑해집니다',
    sub: 'Pattern Detection',
    bodyEn: 'The more contracts you review, the smarter Clauze gets for your relationships. Past patterns surface automatically, so you never miss a recurring risk.',
    bodyKo: '같은 거래처와 반복 계약할 때,\nClauze는 이전 검토 이력을 기억합니다.\n\'이 조항, 지난번에도 문제였습니다\' —\n경험이 쌓일수록 더 빠르고 정확해집니다.',
    tags: ['검토 이력 누적', '패턴 자동 감지'],
    mock: <PatternAlertMock />,
  },
  {
    num: '02',
    numColor: T.amber,
    borderColor: T.amber,
    titleEn: 'Discovery is just the start',
    titleKo: '발견에서 끝나지 않습니다',
    sub: 'Negotiation Templates',
    bodyEn: 'When a risky clause is found, Clauze tells you exactly how to push back. AI instantly drafts negotiation emails in Korean and English. One click opens Gmail.',
    bodyKo: '위험 조항이 발견되면\n\'어떻게 수정 요청할지\'까지 알려줍니다.\n한국어 + 영어 협상 이메일을\nAI가 즉시 초안으로 생성합니다.\n버튼 하나로 Gmail이 열립니다.',
    tags: ['한/영 동시 생성', 'Gmail 바로 연동'],
    mock: <EmailDraftMock />,
  },
  {
    num: '03',
    numColor: T.teal,
    borderColor: T.tealBr,
    titleEn: 'One type, one focus',
    titleKo: 'IT 프리랜서는 IT답게 분석합니다',
    sub: 'Industry-Specific Analysis',
    bodyEn: 'Select your industry before uploading. Clauze prioritizes the clauses that matter most for your specific contract type.',
    bodyKo: '계약서를 올리기 전, 업종을 선택하세요.\nIT 프리랜서라면 IP 귀속 조항을,\n크리에이터라면 콘텐츠 소유권을,\n임대차라면 보증금 반환 조항을\n가장 먼저, 가장 깊게 분석합니다.',
    tags: ['5개 업종 특화', '핵심 조항 우선 분석'],
    mock: <IndustrySelectorMock />,
  },
]

// ─── 하단 통계 배너 ────────────────────────────────────────────────────────

const STATS = [
  {
    numEn: '30s',
    numKo: '30초',
    labelEn: 'Average Review Time',
    labelKo: '평균 검토 시간',
    descEn: 'From upload to risk classification.',
    descKo: 'PDF를 올리는 순간부터 위험도 분류 완료까지.',
  },
  {
    numEn: '100%',
    numKo: '100%',
    labelEn: 'Bilingual',
    labelKo: '한 / 영 동시 제공',
    descEn: 'Every result in Korean and English.',
    descKo: '모든 분석 결과는 한국어와 영어로 함께 제공됩니다.',
  },
  {
    numEn: '5',
    numKo: '5',
    labelEn: 'Industry Types',
    labelKo: '업종 특화 분석',
    descEn: 'Industry-optimized for 5 contract types.',
    descKo: 'IT, 크리에이터, 임대차, 근로/용역, 일반 — 업종별 최적화.',
  },
]

// ─── 메인 섹션 컴포넌트 ────────────────────────────────────────────────────────

export default function DifferentiationSection() {
  return (
    <section>
      {/* 섹션 헤더 — 다크 배경 */}
      <div style={{
        background: T.bgDark,
        padding: '80px 40px 64px',
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: T.fontSans,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            color: T.tealBr,
            margin: '0 0 16px',
          }}
        >
          CORE FEATURES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: T.fontSans,
            fontSize: 'clamp(30px, 4.5vw, 52px)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 12px',
          }}
        >
          Built for one thing.<br />
          <span style={{ color: T.tealBr }}>Korean contracts.</span>
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontFamily: T.fontSans,
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            color: T.tealBr,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: '0 0 20px',
          }}
        >
          계약서 검토, 이렇게 달라집니다.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontFamily: T.fontSans,
            fontSize: 16,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <span style={{ display: 'block', marginBottom: 8 }}>Every feature is designed around the moment you receive a contract and need to decide.</span>
          계약서를 받는 그 순간을 위해 설계된 3가지 기능.
        </motion.p>
      </div>

      {/* 카드 3개 그리드 */}
      <div style={{ background: T.bgLight, padding: '72px 40px' }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
          className="diff-grid"
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              style={{
                background: T.bgCard,
                borderRadius: 4,
                borderTop: `3px solid ${card.borderColor}`,
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 번호 레이블 */}
              <div style={{
                fontFamily: T.fontMono,
                fontSize: 13,
                fontWeight: 700,
                color: card.numColor,
                letterSpacing: '0.05em',
                marginBottom: 16,
              }}>
                {card.num}
              </div>

              {/* 제목 — 영/한 병기 */}
              <h3 style={{
                fontFamily: T.fontSans,
                fontSize: 18,
                fontWeight: 800,
                color: T.text,
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                margin: '0 0 2px',
              }}>
                {card.titleEn}
              </h3>
              <h3 style={{
                fontFamily: T.fontSans,
                fontSize: 18,
                fontWeight: 800,
                color: T.text,
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                margin: '0 0 8px',
              }}>
                {card.titleKo}
              </h3>

              {/* 영문 서브 */}
              <p style={{
                fontFamily: T.fontMono,
                fontSize: 11,
                color: T.textLt,
                letterSpacing: '0.04em',
                margin: '0 0 16px',
              }}>
                {card.sub}
              </p>

              {/* 본문 — 영/한 병기 */}
              <p style={{
                fontFamily: T.fontSans,
                fontSize: 13,
                color: T.textMid,
                lineHeight: 1.75,
                margin: '0 0 12px',
                whiteSpace: 'pre-line',
              }}>
                {card.bodyEn}
              </p>
              <p style={{
                fontFamily: T.fontSans,
                fontSize: 13,
                color: T.textMid,
                lineHeight: 1.75,
                margin: '0 0 0',
                whiteSpace: 'pre-line',
                flex: 1,
              }}>
                {card.bodyKo}
              </p>

              {/* Mini Mock */}
              {card.mock}

              {/* 하단 태그 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
                {card.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: T.fontSans,
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.teal,
                      background: 'rgba(0,165,153,0.08)',
                      border: `1px solid rgba(0,165,153,0.18)`,
                      borderRadius: 20,
                      padding: '3px 10px',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 핵심 가치 통계 배너 */}
      <div style={{ background: T.bgDark, padding: '72px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
          }}
            className="diff-stats"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                style={{
                  padding: '40px 32px',
                  borderRight: i < STATS.length - 1 ? `0.5px solid ${T.borderDk}` : 'none',
                  textAlign: 'center',
                }}
              >
                {/* 숫자 */}
                <div style={{
                  fontFamily: T.fontMono,
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 800,
                  color: T.tealBr,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {stat.numEn}
                </div>

                {/* 레이블 — 영/한 병기 */}
                <p style={{
                  fontFamily: T.fontSans,
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '-0.01em',
                  margin: '0 0 2px',
                }}>
                  {stat.labelEn}
                </p>
                <p style={{
                  fontFamily: T.fontSans,
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.tealBr,
                  letterSpacing: '-0.01em',
                  margin: '0 0 12px',
                }}>
                  {stat.labelKo}
                </p>

                {/* 설명 — 영/한 병기 */}
                <p style={{
                  fontFamily: T.fontSans,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.6,
                  margin: '0 0 4px',
                }}>
                  {stat.descEn}
                </p>
                <p style={{
                  fontFamily: T.fontSans,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {stat.descKo}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 하단 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              textAlign: 'center',
              marginTop: 56,
              paddingTop: 48,
              borderTop: `1px solid ${T.borderDk}`,
            }}
          >
            <CTAButtons />
            <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              <p style={{ margin: '0 0 2px', fontFamily: T.fontSans }}>2 free reviews per month · No credit card required</p>
              <p style={{ margin: 0, fontFamily: T.fontSans }}>월 2건 무료 · 신용카드 불필요</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 반응형 그리드 스타일 */}
      <style>{`
        @media (max-width: 900px) {
          .diff-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .diff-stats { grid-template-columns: 1fr !important; }
          .diff-stats > div { border-right: none !important; border-bottom: 0.5px solid rgba(255,255,255,0.10); padding-bottom: 32px; }
          .diff-stats > div:last-child { border-bottom: none; }
        }
        @media (max-width: 600px) {
          .diff-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// CTA 버튼들 (히어로 섹션과 동일한 스타일)
function CTAButtons() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* 무료로 시작하기 — filled */}
      <PillBtnDark onClick={() => router.push('/dashboard')} variant="filled">
        무료로 시작하기 →
      </PillBtnDark>
      {/* 가격 보기 — outline */}
      <PillBtnDark onClick={() => router.push('/pricing')} variant="outline">
        가격 보기
      </PillBtnDark>
    </div>
  )
}

// 다크 배경용 Pill 버튼
function PillBtnDark({
  children,
  onClick,
  variant = 'outline',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'outline' | 'filled'
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '13px 28px',
        background: variant === 'filled'
          ? (hov ? '#00857C' : '#00A599')
          : (hov ? 'rgba(255,255,255,0.1)' : 'transparent'),
        color: '#FFFFFF',
        border: variant === 'filled' ? `1.5px solid #00A599` : `1.5px solid #FFFFFF`,
        borderRadius: 28,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: T.fontSans,
        cursor: 'pointer',
        letterSpacing: '-0.01em',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap' as const,
      }}
    >{children}</button>
  )
}
