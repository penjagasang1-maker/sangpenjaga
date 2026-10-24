import { db } from '@/lib/db'
import { payments, subscriptionPlans } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { createIpaymuTransaction } from '@/lib/ipaymu'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json(
        { error: 'Harus login terlebih dahulu untuk berlangganan' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, type = 'subscription' } = body

    let planName = 'Langganan VIP Bulanan'
    let planPrice = 1000
    let planDays = 30

    // Check plan from database if planId provided
    if (planId) {
      const [dbPlan] = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.id, Number(planId)))
        .limit(1)

      if (dbPlan) {
        planName = `Langganan VIP ${dbPlan.name}`
        planPrice = dbPlan.price
        planDays = dbPlan.durationDays
      } else if (Number(planId) === 2) {
        planName = 'Langganan VIP Tahunan'
        planPrice = 10000
        planDays = 365
      }
    }

    const orderId = `SP-VIP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    // Create iPaymu transaction
    const ipaymuResult = await createIpaymuTransaction({
      orderId,
      amount: planPrice,
      description: `${planName} Sang Penjaga (${planDays} Hari)`,
      customerEmail: user.email,
      customerName: user.username,
    })

    // Save payment record
    await db.insert(payments).values({
      userId: user.id,
      midtransOrderId: orderId,
      amount: planPrice,
      type: 'subscription',
      status: 'pending',
      midtransResponse: {
        gateway: 'ipaymu',
        sessionId: ipaymuResult.sessionId,
        transactionId: ipaymuResult.transactionId,
        planId: planId || 1,
        planDays,
      },
    })

    return NextResponse.json({
      success: true,
      orderId,
      invoiceUrl: ipaymuResult.paymentUrl,
      sessionId: ipaymuResult.sessionId,
    })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal membuat transaksi pembayaran iPaymu' },
      { status: 500 }
    )
  }
}
