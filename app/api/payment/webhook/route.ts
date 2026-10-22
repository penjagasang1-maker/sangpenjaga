import { db } from '@/lib/db'
import { payments, chapterPurchases, subscriptions } from '@/lib/schema'
import { verifySignature } from '@/lib/midtrans'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body

    // Verify signature from Midtrans
    const isValid = verifySignature(
      signature_key,
      order_id,
      status_code,
      gross_amount
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Determine payment status
    let paymentStatus: 'success' | 'failed' | 'pending' | 'expired' = 'pending'

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        paymentStatus = 'success'
      } else {
        paymentStatus = 'failed'
      }
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny'
    ) {
      paymentStatus = 'failed'
    } else if (transaction_status === 'expire') {
      paymentStatus = 'expired'
    }

    // Update payment record
    await db
      .update(payments)
      .set({
        status: paymentStatus,
        midtransResponse: body,
      })
      .where(eq(payments.midtransOrderId, order_id))

    // If payment success, grant access
    if (paymentStatus === 'success') {
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.midtransOrderId, order_id))
        .limit(1)

      if (payment) {
        if (payment.type === 'chapter') {
          // Extract chapterId from order metadata
          // In production, store chapterId in payment record or order metadata
          console.log(`Chapter purchase successful: ${order_id}`)
        } else if (payment.type === 'subscription') {
          console.log(`Subscription purchase successful: ${order_id}`)
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
