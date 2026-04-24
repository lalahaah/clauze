import { Webhook } from 'standardwebhooks'
import { headers } from 'next/headers'
import { adminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const rawBody = await request.text()

    // Dodo는 Svix 형식으로 전송
    // svix-id → webhook-id로 매핑
    const webhookId =
      headersList.get('webhook-id') ||
      headersList.get('svix-id') || ''

    const webhookSignature =
      headersList.get('webhook-signature') ||
      headersList.get('svix-signature') || ''

    const webhookTimestamp =
      headersList.get('webhook-timestamp') ||
      headersList.get('svix-timestamp') || ''

    console.log('[Webhook] 헤더 수신:', {
      hasId: !!webhookId,
      hasSignature: !!webhookSignature,
      hasTimestamp: !!webhookTimestamp,
    })

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      console.error('[Webhook] 헤더 누락 — 무시')
      return new Response('ok', { status: 200 })
    }

    // 서명 검증
    const wh = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!)
    await wh.verify(rawBody, {
      'webhook-id': webhookId,
      'webhook-signature': webhookSignature,
      'webhook-timestamp': webhookTimestamp,
    })

    const payload = JSON.parse(rawBody)
    const eventType = payload.type
    const data = payload.data
    const customerEmail = data?.customer?.email

    console.log('[Webhook] 이벤트:', eventType, '/', customerEmail)

    if (!customerEmail) {
      return new Response('ok', { status: 200 })
    }

    // 이메일로 유저 조회
    const userQuery = await adminDb
      .collection('users')
      .where('email', '==', customerEmail)
      .limit(1)
      .get()

    if (userQuery.empty) {
      console.warn('[Webhook] 유저 없음:', customerEmail)
      return new Response('ok', { status: 200 })
    }

    const userDoc = userQuery.docs[0]

    // 단건 결제 완료 → 크레딧 +1
    if (eventType === 'payment.succeeded') {
      const current = userDoc.data().singleReviewCredits || 0
      await userDoc.ref.update({
        singleReviewCredits: current + 1,
        updatedAt: new Date(),
      })
      console.log('[Webhook] ✅ 단건 크레딧 +1 완료:', customerEmail)
    }

    // 구독 활성화 / 갱신 → 플랜 업데이트
    if (
      eventType === 'subscription.active' ||
      eventType === 'subscription.renewed'
    ) {
      const productId = data?.product_id
      const planType =
        productId === process.env.DODO_PRODUCT_PRO
          ? 'pro'
          : productId === process.env.DODO_PRODUCT_BUSINESS
          ? 'business'
          : 'free'

      await userDoc.ref.update({
        plan: planType,
        subscriptionId: data?.subscription_id || '',
        subscriptionStatus: 'active',
        currentPeriodEnd: data?.next_billing_date || null,
        updatedAt: new Date(),
      })
      console.log('[Webhook] ✅ 플랜 업데이트 완료:', customerEmail, '->', planType)
    }

    // 구독 취소 / 실패 → 무료 플랜으로
    if (
      eventType === 'subscription.cancelled' ||
      eventType === 'subscription.failed'
    ) {
      await userDoc.ref.update({
        plan: 'free',
        subscriptionStatus: 'cancelled',
        updatedAt: new Date(),
      })
      console.log('[Webhook] ✅ 구독 취소 완료:', customerEmail)
    }

    return new Response('ok', { status: 200 })

  } catch (error) {
    console.error('[Webhook] 오류:', error instanceof Error ? error.message : error)
    return new Response('ok', { status: 200 })
  }
}
