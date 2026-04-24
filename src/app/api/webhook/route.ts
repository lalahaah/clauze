import { Webhook } from 'standardwebhooks'
import { headers } from 'next/headers'
import { adminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const rawBody = await request.text()

    const webhookId =
      headersList.get('webhook-id') ||
      headersList.get('svix-id') || ''

    const webhookSignature =
      headersList.get('webhook-signature') ||
      headersList.get('svix-signature') || ''

    const webhookTimestamp =
      headersList.get('webhook-timestamp') ||
      headersList.get('svix-timestamp') || ''

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      console.error('[Webhook] 헤더 누락')
      return new Response('ok', { status: 200 })
    }

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
    const uid = data?.metadata?.uid

    console.log('[Webhook] 이벤트:', eventType, '| email:', customerEmail, '| uid:', uid)

    let userRef: FirebaseFirestore.DocumentReference | null = null

    if (uid) {
      const doc = await adminDb.collection('users').doc(uid).get()
      if (doc.exists) {
        userRef = doc.ref
        console.log('[Webhook] ✅ uid로 유저 찾음:', uid)
      }
    }

    if (!userRef && customerEmail) {
      const q = await adminDb
        .collection('users')
        .where('email', '==', customerEmail)
        .limit(1)
        .get()
      if (!q.empty) {
        userRef = q.docs[0].ref
        console.log('[Webhook] ✅ email로 유저 찾음:', customerEmail)
      }
    }

    if (!userRef) {
      console.warn('[Webhook] ❌ 유저 없음 — uid:', uid, '/ email:', customerEmail)
      return new Response('ok', { status: 200 })
    }

    if (eventType === 'payment.succeeded') {
      const doc = await userRef.get()
      const current = doc.data()?.singleReviewCredits || 0
      await userRef.update({
        plan: 'single',
        singleReviewCredits: current + 1,
        email: customerEmail,
        updatedAt: new Date(),
      })
      console.log('[Webhook] ✅ 단건 크레딧 +1:', customerEmail)
    }

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

      await userRef.update({
        plan: planType,
        email: customerEmail,
        subscriptionId: data?.subscription_id || '',
        subscriptionStatus: 'active',
        currentPeriodEnd: data?.next_billing_date || null,
        updatedAt: new Date(),
      })
      console.log('[Webhook] ✅ 플랜 업데이트:', customerEmail, '->', planType)
    }

    if (
      eventType === 'subscription.cancelled' ||
      eventType === 'subscription.failed'
    ) {
      await userRef.update({
        plan: 'free',
        subscriptionStatus: 'cancelled',
        updatedAt: new Date(),
      })
      console.log('[Webhook] ✅ 구독 취소:', customerEmail)
    }

    return new Response('ok', { status: 200 })

  } catch (error) {
    console.error('[Webhook] 오류:', error instanceof Error ? error.message : error)
    return new Response('ok', { status: 200 })
  }
}
