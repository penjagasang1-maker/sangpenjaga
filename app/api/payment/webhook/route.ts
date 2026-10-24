import { db } from '@/lib/db'
import { payments, subscriptions, subscriptionPlans } from '@/lib/schema'
import { verifyXenditWebhookToken } from '@/lib/xendit'
import { eq, and, gt } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const callbackToken = request.headers.get('x-callback-token')

    if (!verifyXenditWebhookToken(callbackToken)) {
      console.error('Invalid Xendit callback token')
      return NextResponse.json(
        { error: 'Unauthorized callback token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { external_id, status } = body

    if (!external_id) {
      return NextResponse.json(
        { error: 'Missing external_id' },
        { status: 400 }
      )
    }

    // Determine payment status from Xendit status
    let paymentStatus: 'success' | 'failed' | 'pending' | 'expired' = 'pending'

    if (status === 'PAID' || status === 'SETTLED') {
      paymentStatus = 'success'
    } else if (status === 'EXPIRED') {
      paymentStatus = 'expired'
    } else if (status === 'FAILED') {
      paymentStatus = 'failed'
    }

    // Find the payment record
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.midtransOrderId, external_id))
      .limit(1)

    if (!payment) {
      console.warn(`Payment not found for external_id: ${external_id}`)
      return NextResponse.json({ status: 'not_found' }, { status: 404 })
    }

    // Update payment record
    await db
      .update(payments)
      .set({
        status: paymentStatus,
        midtransResponse: body,
      })
      .where(eq(payments.midtransOrderId, external_id))

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

      console.log(`User ${payment.userId} subscribed successfully for ${planDays} days`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Xendit webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
