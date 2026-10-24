import { db } from '@/lib/db'
import { payments, subscriptions, subscriptionPlans } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    let body: Record<string, any> = {}
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}))
    } else {
      try {
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
          body[key] = value
        }
      } catch {
        const text = await request.text()
        const params = new URLSearchParams(text)
        params.forEach((val, key) => {
          body[key] = val
        })
      }
    }

    const referenceId =
      body.reference_id ||
      body.referenceId ||
      body.trx_id ||
      body.external_id ||
      body.order_id

    const rawStatus = (body.status || '').toLowerCase()
    const statusCode = String(body.status_code || '')

    if (!referenceId) {
      console.warn('Webhook iPaymu: reference_id tidak ditemukan', body)
      return NextResponse.json(
        { error: 'Missing reference_id' },
        { status: 400 }
      )
    }

    // Determine payment status (iPaymu sends status: 'berhasil' or status_code: '1')
    let paymentStatus: 'success' | 'failed' | 'pending' | 'expired' = 'pending'

    if (
      rawStatus === 'berhasil' ||
      rawStatus === 'success' ||
      rawStatus === 'paid' ||
      statusCode === '1'
    ) {
      paymentStatus = 'success'
    } else if (rawStatus === 'expired') {
      paymentStatus = 'expired'
    } else if (rawStatus === 'gagal' || rawStatus === 'failed' || statusCode === '-1') {
      paymentStatus = 'failed'
    }

    // Find the payment record
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.midtransOrderId, referenceId))
      .limit(1)

    if (!payment) {
      console.warn(`Payment not found for referenceId: ${referenceId}`)
      return NextResponse.json({ status: 'not_found' }, { status: 404 })
    }

    // Update payment record
    await db
      .update(payments)
      .set({
        status: paymentStatus,
        midtransResponse: body,
      })
      .where(eq(payments.midtransOrderId, referenceId))

    // If payment succeeded, activate or extend subscription
    if (paymentStatus === 'success' && payment.userId) {
      const planMeta = (payment.midtransResponse as any) || {}
      const planDays = planMeta.planDays || (payment.amount >= 10000 ? 365 : 30)
      const planId = planMeta.planId || (planDays === 365 ? 2 : 1)

      const now = new Date()
      const additionalMs = planDays * 24 * 60 * 60 * 1000

      // Check existing active subscription for this user
      const existingSubs = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, payment.userId),
            eq(subscriptions.status, 'active')
          )
        )
        .limit(1)

      if (existingSubs.length > 0 && existingSubs[0].expiresAt > now) {
        // Extend existing subscription
        const currentExpiry = new Date(existingSubs[0].expiresAt)
        const newExpiry = new Date(currentExpiry.getTime() + additionalMs)

        await db
          .update(subscriptions)
          .set({
            expiresAt: newExpiry,
            planId: planId,
          })
          .where(eq(subscriptions.id, existingSubs[0].id))
      } else {
        // Insert new active subscription
        const expiresAt = new Date(now.getTime() + additionalMs)

        await db.insert(subscriptions).values({
          userId: payment.userId,
          planId: planId,
          startsAt: now,
          expiresAt: expiresAt,
          status: 'active',
        })
      }

      console.log(`User ${payment.userId} subscribed successfully via iPaymu for ${planDays} days`)
    }

    return NextResponse.json({ status: 'ok', referenceId, paymentStatus })
  } catch (error) {
    console.error('iPaymu webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
