// src/components/legal/Disclaimer.tsx
// Clauze 법적 면책 조항 컴포넌트 3종
// - FooterDisclaimer     : 모든 페이지 하단 상시 노출
// - ResultDisclaimer     : 검토 결과 화면 하단 노출
// - DisclaimerModal      : 최초 업로드 전 동의 수집 모달

'use client'

import { useState } from 'react'
import { SUPPORT_EMAIL } from '@/lib/config'

// ─────────────────────────────────────────────────────────────
// 디자인 토큰
// ─────────────────────────────────────────────────────────────
const T = {
  bgDark:    '#093944',
  bgDarker:  '#062830',
  teal:      '#00A599',
  tealBr:    '#00C2B5',
  tealDim:   'rgba(0,165,153,0.12)',
  text:      '#042228',
  textMid:   '#3D5A5E',
  textLt:    '#7A9A9E',
  bgLight:   '#F6F7FB',
  bgCard:    '#FFFFFF',
  border:    'rgba(4,34,40,0.08)',
  borderDk:  'rgba(255,255,255,0.10)',
  warning:   '#FFF8E6',
  warnBdr:   '#F59E0B',
  warnText:  '#92400E',
}

// ─────────────────────────────────────────────────────────────
// 1. Footer Disclaimer — 모든 페이지 하단 상시 노출
// ─────────────────────────────────────────────────────────────
export function FooterDisclaimer() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      borderTop: `1px solid ${T.borderDk}`,
      padding: '20px 40px 24px',
      background: T.bgDarker,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 280 }}>
          <div style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="#F59E0B" strokeWidth="1.2" fill="rgba(245,158,11,0.15)" strokeLinejoin="round"/>
              <path d="M8 6v3.5M8 11v.5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>법적 고지:</span>{' '}
            Clauze의 AI 분석 결과는 참고용 정보 제공만을 목적으로 하며,
            변호사의 법률 자문이나 법적 효력을 갖는 검토 의견이 아닙니다.
            중요한 계약은 반드시 법률 전문가와 상담하시기 바랍니다.{' '}
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: T.tealBr, padding: 0,
                textDecoration: 'underline', textDecorationColor: 'rgba(0,194,181,0.4)',
              }}
            >
              {expanded ? '접기' : '상세 면책 조항 보기'}
            </button>
          </p>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>개인정보처리방침</a>
          <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>이용약관</a>
          <span>© 2026 (주)루시퍼</span>
        </div>
      </div>

      {expanded && (
        <div style={{
          maxWidth: 1100, margin: '16px auto 0',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${T.borderDk}`,
          borderLeft: `3px solid ${T.warnBdr}`,
          borderRadius: '0 4px 4px 0',
          padding: '18px 22px',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.warnBdr, marginBottom: 12 }}>
            Legal Disclaimer / 법적 면책 조항
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 8, fontSize: 12 }}>한국어</strong>
                본 서비스 Clauze는 인공지능(AI)을 활용한 계약서 분석 도구입니다.
                제공되는 모든 분석 결과, 위험도 분류, 조항 요약 및 권고 사항은{' '}
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>법률적 조언, 법률 서비스 또는 변호사-의뢰인 관계를 구성하지 않습니다.</strong>{' '}
                AI 분석 결과는 오류를 포함할 수 있으며, 법적 효력이 없습니다.
                계약서의 법적 해석, 유효성 판단, 최종 서명 여부 결정 등 중요한 법적 사안에 대해서는
                반드시 대한민국 변호사 자격을 보유한 법률 전문가의 자문을 받으시기 바랍니다.
                본 서비스 이용으로 인해 발생하는 법적 분쟁, 손해, 불이익에 대하여
                (주)루시퍼는 관련 법령이 허용하는 최대 한도 내에서 책임을 부담하지 않습니다.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 8, fontSize: 12 }}>English</strong>
                Clauze is an AI-powered contract analysis tool. All analysis results,
                risk classifications, clause summaries, and recommendations provided by this service{' '}
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>do not constitute legal advice, legal services, or an attorney-client relationship.</strong>{' '}
                AI-generated results may contain errors and have no legal effect.
                For important legal matters including interpretation of contracts, assessment of validity,
                and final decisions on signing, please consult a qualified legal professional
                licensed to practice law in the relevant jurisdiction.
                Lucifer Co., Ltd. disclaims all liability for legal disputes, damages, or losses
                arising from use of this service to the fullest extent permitted by applicable law.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.borderDk}`, display: 'flex', gap: 16, alignItems: 'center' }}>
            <a href="/terms#section-8" style={{ fontSize: 11, color: T.tealBr, textDecoration: 'none' }}>이용약관 제8조 (면책 조항) →</a>
            <a href="/privacy" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>개인정보처리방침</a>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>v1.0 · 2026.04.01 시행</span>
          </div>
        </div>
      )}
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// 2. Result Disclaimer — 검토 결과 화면 하단
// ─────────────────────────────────────────────────────────────
export function ResultDisclaimer() {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{
        background: T.warning,
        border: `1px solid rgba(245,158,11,0.3)`,
        borderLeft: `4px solid ${T.warnBdr}`,
        borderRadius: '0 4px 4px 0',
        padding: '18px 22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flexShrink: 0, marginTop: 1 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 17H2L10 2Z" stroke="#D97706" strokeWidth="1.5" fill="rgba(217,119,6,0.12)" strokeLinejoin="round"/>
              <path d="M10 8v4.5M10 14.5v.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.warnText, margin: '0 0 8px', lineHeight: 1.4 }}>
              이 분석 결과는 AI 참고용이며 법적 효력이 없습니다
            </p>
            <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.7, margin: 0 }}>
              Clauze의 AI 분석 결과는{' '}
              <strong>변호사의 법률 자문을 대체하지 않습니다.</strong>{' '}
              AI는 오류를 포함할 수 있으며, 본 분석이 정상으로 분류한 조항에도
              법적 위험이 존재할 수 있습니다.
              계약 서명 전 중요한 사안은 반드시 법률 전문가와 상담하시기 바랍니다.
            </p>
            <p style={{
              fontSize: 12, color: 'rgba(120,53,15,0.65)', lineHeight: 1.65,
              margin: '10px 0 12px', fontStyle: 'italic',
              borderTop: '1px solid rgba(217,119,6,0.15)', paddingTop: 10,
            }}>
              This AI analysis is for informational purposes only and does not constitute legal advice.
              AI results may contain errors. Please consult a qualified attorney before signing
              any contract based on this analysis.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowDetail(!showDetail)}
                style={{
                  background: 'none', border: `1px solid rgba(217,119,6,0.35)`,
                  borderRadius: 28, padding: '6px 14px',
                  fontSize: 12, fontWeight: 600, color: T.warnText, cursor: 'pointer',
                }}
              >
                {showDetail ? '상세 접기' : '면책 조항 전문 보기'}
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=[Clauze] 법률 전문가 연결 문의`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '6px 14px', background: T.bgDark, borderRadius: 28,
                  fontSize: 12, fontWeight: 600, color: T.tealBr, textDecoration: 'none',
                }}
              >
                법률 전문가 연결 문의 →
              </a>
            </div>
          </div>
        </div>
      </div>

      {showDetail && (
        <div style={{
          background: T.bgLight, border: `1px solid ${T.border}`,
          borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '18px 22px',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textLt, marginBottom: 12 }}>
            상세 면책 조항 (Full Disclaimer)
          </p>
          {[
            {
              num: '①', title: '법률 자문 비해당',
              ko: 'Clauze가 제공하는 계약서 분석 결과, 위험도 분류, 조항 요약 및 모든 권고 사항은 법률적 조언을 구성하지 않으며, 변호사-의뢰인 관계를 형성하지 않습니다.',
              en: 'The contract analysis, risk classifications, and recommendations provided by Clauze do not constitute legal advice and do not create an attorney-client relationship.',
            },
            {
              num: '②', title: 'AI 정확성 한계',
              ko: 'AI 분석 시스템은 오류, 누락, 부정확한 해석을 포함할 수 있습니다. 특히 외국법이 준거법인 계약서, 특수 산업 관련 계약서, 최신 판례가 반영된 조항의 경우 분석 정확도가 현저히 낮을 수 있습니다.',
              en: 'The AI analysis system may contain errors, omissions, or inaccurate interpretations. Analysis accuracy may be significantly lower for contracts governed by foreign law, specialized industry agreements, or clauses reflecting recent case law.',
            },
            {
              num: '③', title: '손해 책임 부인',
              ko: 'Clauze의 분석 결과에 의존하여 이루어진 계약 서명, 법적 결정, 사업적 판단으로 인해 발생하는 일체의 손해, 손실, 법적 책임에 대하여 (주)루시퍼는 관련 법령이 허용하는 최대 한도 내에서 책임을 부담하지 않습니다.',
              en: "Lucifer Co., Ltd. disclaims all liability to the fullest extent permitted by applicable law for any damages, losses, or legal liabilities arising from reliance on Clauze's analysis results.",
            },
            {
              num: '④', title: '전문가 상담 권고',
              ko: '계약서의 법적 해석, 유효성 판단, 계약 조건의 협상, 최종 서명 여부 결정 등 중요한 법적 사안에 대해서는 반드시 대한민국 변호사 자격을 보유한 법률 전문가의 자문을 받으시기 바랍니다.',
              en: 'For important legal matters including contract interpretation, validity assessment, negotiation of terms, and final signing decisions, please consult a qualified attorney licensed to practice in the relevant jurisdiction.',
            },
          ].map(({ num, title, ko, en }) => (
            <div key={num} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.teal, flexShrink: 0, minWidth: 20 }}>{num}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</span>
              </div>
              <p style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7, margin: '0 0 6px 30px' }}>{ko}</p>
              <p style={{ fontSize: 12, color: T.textLt, lineHeight: 1.65, margin: '0 0 0 30px', fontStyle: 'italic' }}>{en}</p>
            </div>
          ))}
          <p style={{ fontSize: 11, color: T.textLt, margin: 0 }}>
            (주)루시퍼 · 담당자 박원영 ·{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: T.teal }}>{SUPPORT_EMAIL}</a>
            {' '}· 시행: 2026.04.01 · 관련 조항:{' '}
            <a href="/terms#section-8" style={{ color: T.teal }}>이용약관 제8조</a>
          </p>
        </div>
      )}
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// 3. Disclaimer Modal — 최초 업로드 전 1회 동의 수집
// ─────────────────────────────────────────────────────────────

export function hasAgreedToDisclaimer(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('clauze_disclaimer_agreed') === 'true'
}

export function DisclaimerModal({ onAgree, onClose }: {
  onAgree: () => void
  onClose: () => void
}) {
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const canProceed = check1 && check2

  const handleAgree = () => {
    localStorage.setItem('clauze_disclaimer_agreed', 'true')
    localStorage.setItem('clauze_disclaimer_agreed_at', new Date().toISOString())
    onAgree()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(6,40,48,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: T.bgCard, borderRadius: 8,
        width: '100%', maxWidth: 540, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(6,40,48,0.4)',
      }}>
        {/* 헤더 */}
        <div style={{ background: T.bgDark, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2.5L20 19H2L11 2.5Z" stroke="#F59E0B" strokeWidth="1.5" fill="rgba(245,158,11,0.15)" strokeLinejoin="round"/>
              <path d="M11 9v5M11 16v.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
              서비스 이용 전 반드시 확인하세요
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 2px' }}>
              Please confirm before using this service
            </p>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '22px 24px' }}>
          {[
            {
              titleKo: 'AI 분석은 참고용입니다',
              titleEn: 'AI analysis is for reference only',
              descKo: '본 서비스의 분석 결과는 정보 제공 목적이며, 법적 효력이 없습니다. AI는 오류를 포함할 수 있습니다.',
              descEn: 'Analysis results are for informational purposes only and have no legal effect. AI may contain errors.',
            },
            {
              titleKo: '법률 자문이 아닙니다',
              titleEn: 'Not legal advice',
              descKo: 'Clauze는 변호사 서비스가 아닙니다. 중요한 계약은 반드시 자격 있는 법률 전문가와 상담하세요.',
              descEn: 'Clauze is not a legal service. For important contracts, always consult a qualified legal professional.',
            },
            {
              titleKo: '손해에 대한 책임 부인',
              titleEn: 'Disclaimer of liability',
              descKo: 'AI 분석 결과에 의존한 법적 결정으로 발생하는 손해에 대해 (주)루시퍼는 책임을 부담하지 않습니다.',
              descEn: 'Lucifer Co., Ltd. disclaims all liability for damages arising from legal decisions based on AI analysis.',
            },
          ].map(({ titleKo, titleEn, descKo, descEn }) => (
            <div key={titleKo} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 14px', marginBottom: 8,
              background: T.warning, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 4,
            }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5L13 12H1L7 1.5Z" stroke="#F59E0B" strokeWidth="1.2" fill="rgba(245,158,11,0.15)" strokeLinejoin="round"/>
                  <path d="M7 5.5v3M7 10v.3" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.warnText, margin: '0 0 1px' }}>{titleKo}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(146,64,14,0.65)', margin: '0 0 4px', fontStyle: 'italic' }}>{titleEn}</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6, margin: '0 0 3px' }}>{descKo}</p>
                <p style={{ fontSize: 11, color: 'rgba(120,53,15,0.65)', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>{descEn}</p>
              </div>
            </div>
          ))}

          {/* 체크박스 */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)}
                style={{ width: 16, height: 16, marginTop: 2, accentColor: T.teal, flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: T.text, lineHeight: 1.55 }}>
                <strong>AI 분석 결과의 한계</strong>를 이해했으며, 이 분석이 법적 효력이 없는 참고용
                정보임을 인정합니다. (필수)<br />
                <span style={{ fontSize: 11, color: T.textMid, fontStyle: 'italic' }}>
                  I understand the limitations of AI analysis and acknowledge it is for reference only. (Required)
                </span>
              </span>
            </label>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)}
                style={{ width: 16, height: 16, marginTop: 2, accentColor: T.teal, flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: T.text, lineHeight: 1.55 }}>
                중요한 계약의 최종 검토는{' '}
                <strong>법률 전문가와 별도 상담</strong>이 필요함을 이해하고,
                본 서비스를 그 대체제로 사용하지 않겠습니다. (필수)<br />
                <span style={{ fontSize: 11, color: T.textMid, fontStyle: 'italic' }}>
                  I understand that final review of important contracts requires a legal professional and will not use this service as a substitute. (Required)
                </span>
              </span>
            </label>
          </div>

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', background: T.bgLight,
                border: `1px solid ${T.border}`, borderRadius: 28,
                fontSize: 13, fontWeight: 600, color: T.textMid, cursor: 'pointer',
              }}
            >
              취소 / Cancel
            </button>
            <button
              onClick={handleAgree}
              disabled={!canProceed}
              style={{
                flex: 2, padding: '12px', border: 'none', borderRadius: 28,
                fontSize: 13, fontWeight: 700,
                background: canProceed ? T.bgDark : T.bgLight,
                color: canProceed ? T.tealBr : T.textLt,
                cursor: canProceed ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              {canProceed ? '동의하고 계약서 분석 시작 →' : '위 항목에 모두 동의해주세요 / Agree to all'}
            </button>
          </div>

          <p style={{ fontSize: 11, color: T.textLt, textAlign: 'center', marginTop: 12, lineHeight: 1.7 }}>
            이용약관{' '}
            <a href="/terms#section-8" target="_blank" style={{ color: T.teal, textDecoration: 'none' }}>제8조 면책 조항</a>
            {' '}및{' '}
            <a href="/privacy" target="_blank" style={{ color: T.teal, textDecoration: 'none' }}>개인정보처리방침</a>
            에도 동의하게 됩니다.<br />
            <span style={{ fontStyle: 'italic' }}>
              By agreeing, you also consent to{' '}
              <a href="/terms#section-8" target="_blank" style={{ color: T.teal, textDecoration: 'none' }}>Article 8 of our Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" target="_blank" style={{ color: T.teal, textDecoration: 'none' }}>Privacy Policy</a>.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
