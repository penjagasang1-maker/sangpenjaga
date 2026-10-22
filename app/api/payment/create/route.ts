import { db } from '@/lib/db'
import { payments, chapterPurchases, subscriptions, subscriptionPlans } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { createTransaction, verifySignature } from '@/lib/midtrans'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json(
        { error: 'Harus login terlebih dahulu' },
        { status: 401 }
      )
    }

    const { type, chapterId, planId, amount } = await request.json()

    if (!type || !amount) {
      return NextResponse.json(
        { error: 'Data pembayaran tidak lengkap' },
        { status: 400 }
      )
    }

    const orderId = `SP-${type.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    // Create Midtrans transaction
    const { token, redirectUrl } = await createTransaction({
      orderId,
      amount,
      customerName: user.username,
      customerEmail: user.email,
    })

    // Save payment record
    await db.insert(payments).values({
      userId: user.id,
      midtransOrderId: orderId,
      amount,
      type: type as 'chapter' | 'subscription',
      status: 'pending',
    })

    return NextResponse.json({ token, redirectUrl, orderId })
  } catch (error) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat transaksi' },
      { status: 500 }
    )
  }
}
