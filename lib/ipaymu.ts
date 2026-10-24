export interface CreateIpaymuTransactionParams {
  orderId: string
  amount: number
  description: string
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export interface CreateIpaymuTransactionResult {
  paymentUrl: string
  sessionId: string
  transactionId?: number | string
  referenceId: string
}

async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toLowerCase()
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createIpaymuTransaction(
  params: CreateIpaymuTransactionParams
): Promise<CreateIpaymuTransactionResult> {
  let cfEnv: any = null
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    cfEnv = getRequestContext()?.env
  } catch {}

  const va = cfEnv?.IPAYMU_VA || process.env.IPAYMU_VA
  const apiKey = cfEnv?.IPAYMU_API_KEY || process.env.IPAYMU_API_KEY
  const isProduction = (cfEnv?.IPAYMU_IS_PRODUCTION || process.env.IPAYMU_IS_PRODUCTION) !== 'false'

  if (!va || !apiKey) {
    throw new Error(
      'Kredensial iPaymu belum dikonfigurasi. Mohon isi IPAYMU_VA dan IPAYMU_API_KEY di Environment Variables Cloudflare Pages.'
    )
  }

  const endpoint = isProduction
    ? 'https://my.ipaymu.com/api/v2/payment'
    : 'https://sandbox.ipaymu.com/api/v2/payment'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sangpenjaga.com'

  const payload = {
    name: params.customerName || 'Pembaca',
    phone: params.customerPhone || '087880503974',
    email: params.customerEmail,
    amount: Math.round(params.amount),
    comments: params.description,
    notifyUrl: `${appUrl}/api/payment/webhook`,
    returnUrl: `${appUrl}/langganan/sukses?order_id=${params.orderId}`,
    cancelUrl: `${appUrl}/langganan/gagal?order_id=${params.orderId}`,
    expired: 24, // 24 hours
    referenceId: params.orderId,
    product: [params.description],
    qty: [1],
    price: [Math.round(params.amount)],
  }

  const jsonBody = JSON.stringify(payload)
  const bodyHash = await sha256(jsonBody)
  const stringToSign = `POST:${va}:${bodyHash}:${apiKey}`
  const signature = await hmacSha256(stringToSign, apiKey)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      va: va,
      signature: signature,
    },
    body: jsonBody,
  })

  const data = await response.json()

  if (!response.ok || data.Status !== 200 || !data.Data?.Url) {
    const errorMsg =
      data.Message ||
      data.message ||
      `Gagal membuat transaksi iPaymu (Status: ${data.Status || response.status})`
    console.error('iPaymu error response:', data)
    throw new Error(errorMsg)
  }

  return {
    paymentUrl: data.Data.Url,
    sessionId: data.Data.SessionID,
    transactionId: data.Data.TransactionId,
    referenceId: params.orderId,
  }
}
