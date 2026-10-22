export interface CreateTransactionParams {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
}

export interface CreateTransactionResult {
  token: string
  redirectUrl: string
}

export async function createTransaction(
  params: CreateTransactionParams
): Promise<CreateTransactionResult> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) {
    throw new Error('MIDTRANS_SERVER_KEY environment variable is not defined')
  }

  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'
  const endpoint = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

  const authString =
    typeof Buffer !== 'undefined'
      ? Buffer.from(`${serverKey}:`).toString('base64')
      : btoa(`${serverKey}:`)

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: Math.round(params.amount),
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
    },
  }

  const response = await fetch(endpoint, {
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
    const errorMsg = Array.isArray(data.error_messages)
      ? data.error_messages.join(', ')
      : data.message || 'Failed to create Midtrans transaction'
    throw new Error(errorMsg)
  }

  return {
    token: data.token,
    redirectUrl: data.redirect_url,
  }
}

export async function verifySignature(
  signatureKey: string,
  orderId: string,
  statusCode: string,
  grossAmount: string
): Promise<boolean> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) {
    return false
  }

  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`
  const encoder = new TextEncoder()
  const data = encoder.encode(payload)
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hash.toLowerCase() === signatureKey.toLowerCase()
}
