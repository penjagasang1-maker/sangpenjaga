interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey =
    process.env.RESEND_API_KEY ||
    (typeof atob !== 'undefined'
      ? atob('cmVfMjlQSlZ0NlRfUGZxeEJCQmdncnQ1RXBEbjlyWTdqUGtM')
      : '')
  const fromEmail =
    process.env.EMAIL_FROM || 'Sang Penjaga <noreply@sangpenjaga.com>'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    })

    const data = (await res.json()) as any

    if (!res.ok) {
      console.warn('Resend primary send failed:', data)

      // If domain not yet verified in Resend dashboard, try fallback test sender
      const retryRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'Sang Penjaga <onboarding@resend.dev>',
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      })

      const retryData = (await retryRes.json()) as any
      if (retryRes.ok) {
        return { success: true }
      }

      return {
        success: false,
        error:
          data.message || retryData.message || 'Gagal mengirim email reset sandi',
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Send email network error:', err)
    return {
      success: false,
      error: err.message || 'Gagal menghubungi server email',
    }
  }
}
