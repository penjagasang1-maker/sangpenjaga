export interface CreateXenditInvoiceParams {
  orderId: string
  amount: number
  description: string
  customerEmail: string
  customerName: string
  successRedirectUrl?: string
  failureRedirectUrl?: string
}

export interface CreateXenditInvoiceResult {
  invoiceId: string
  invoiceUrl: string
  status: string
  expiryDate?: string
}

export async function createXenditInvoice(
  params: CreateXenditInvoiceParams
): Promise<CreateXenditInvoiceResult> {
  const secretKey = process.env.XENDIT_SECRET_KEY
  if (!secretKey) {
    throw new Error('XENDIT_SECRET_KEY environment variable is not defined')
  }

  const authString =
    typeof Buffer !== 'undefined'
      ? Buffer.from(`${secretKey}:`).toString('base64')
      : btoa(`${secretKey}:`)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sang-penjaga.pages.dev'

  const payload = {
    external_id: params.orderId,
    amount: Math.round(params.amount),
    description: params.description,
    payer_email: params.customerEmail,
    customer: {
      given_names: params.customerName || 'Pembaca',
      email: params.customerEmail,
    },
    success_redirect_url: params.successRedirectUrl || `${appUrl}/langganan/sukses?order_id=${params.orderId}`,
    failure_redirect_url: params.failureRedirectUrl || `${appUrl}/langganan/gagal?order_id=${params.orderId}`,
    currency: 'IDR',
  }

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMsg = data.message || data.error_code || 'Gagal membuat invoice Xendit'
    console.error('Xendit invoice error:', data)
    throw new Error(errorMsg)
  }

  return {
    invoiceId: data.id,
    invoiceUrl: data.invoice_url,
    status: data.status,
    expiryDate: data.expiry_date,
  }
}

export function verifyXenditWebhookToken(tokenFromHeader: string | null): boolean {
  const configuredToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN
  if (!configuredToken) {
    // If no webhook token is configured yet, log warning and allow for testing if needed
    console.warn('XENDIT_WEBHOOK_VERIFICATION_TOKEN not set')
    return true
  }
  return tokenFromHeader === configuredToken
}
