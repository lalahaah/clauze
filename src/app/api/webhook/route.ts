// src/app/api/webhook/route.ts
// Dodo Payments 웹훅 처리 — Svix + standardwebhooks 헤더 지원

import { Webhook } from 'standardwebhooks'
import { headers } from 'next/headers'
import { adminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const rawBody = await request.text()

    // Svix 형식 헤더 (Dodo가 사용)
    const svixId        = headersList.get('svix-id')        || ''
    const svixSignature = headersList.get('svix-signature') || ''
    const svixTimestamp = headersList.get('svix-timestamp') || ''

    // standardwebhooks 형식 헤더 (fallback)
    const webhookId        = headersList.get('webhook-id')        || svixId
    const webhookSignature = headersList.get('webhook-signature') || svixSignature
    const webhookTimestamp = headersList.get('webhook-timestamp') || svixTimestamp

    console.log('[Webhook] 헤더 확인:', {
      svixId:     !!svixId,
      svixSig:    !!svixSignature,
      webhookId:  !!webhookId,
      webhookSig: !!webhookSignature,
    })

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      console.error('[Webhook] 필수 헤더 없음 — 200 반환')
      return new Response('ok', { status: 200 })
    }

    const wh = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!)
    await wh.verify(rawBody, {
      'webhook-id':        webhookId,
      'webhook-signature': webhookSignature,
      'webhook-timestamp': webhookTimestamp,
    })

    const payload   = JSON.parse(rawBody)
    const eventType = payload.type as string
    const data      = payload.data as Record<string, any>

    console.log('[Webhook] 이벤트:', eventType, data?.customer?.email)

    const customerEmail = data?.customer?.email as string | undefined
    if (!customerEmail) {
      console.warn('[Webhook] customer.email 없음 — 200 반환')
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

    // payment.succeeded — 단건 크레딧 추가
    if (eventType === 'payment.succeeded') {
      const current = (userDoc.data().singleReviewCredits as number) || 0
      await userDoc.ref.update({
        singleReviewCredits: current + 1,
        updatedAt: new Date(),
      })
      console.log('[Webhook] 단건 크레딧 +1:', customerEmail)
    }

    // subscription.active / subscription.renewed — 구독 활성화
    if (eventType === 'subscription.active' || eventType === 'subscription.renewed') {
      const productId = data?.product_id as string | undefined
      const planType =
        productId === process.env.DODO_PRODUCT_PRO      ? 'pro'
        : productId === process.env.DODO_PRODUCT_BUSINESS ? 'business'
        : 'free'

      await userDoc.ref.update({
        plan:             planType,
        subscriptionId:   (data.subscription_id as string) || '',
        subscriptionStatus: 'active',
        currentPeriodEnd: (data.next_billing_date as string) || null,
        updatedAt:        new Date(),
      })
      console.log('[Webhook] 플랜 업데이트:', customerEmail, '->', planType)
    }

    // subscription.cancelled / subscription.failed — 구독 해제
    if (eventType === 'subscription.cancelled' || eventType === 'subscription.failed') {
      await userDoc.ref.update({
        plan:               'free',
        subscriptionStatus: 'cancelled',
        updatedAt:          new Date(),
      })
      console.log('[Webhook] 구독 취소:', customerEmail)
    }

    return new Response('ok', { status: 200 })

  } catch (error) {
    console.error('[Webhook] 오류:', error instanceof Error ? error.message : error)
    return new Response('ok', { status: 200 })
  }
}
