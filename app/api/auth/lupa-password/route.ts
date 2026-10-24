import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/lib/password-reset'
import { sendEmail } from '@/lib/email'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email wajib diisi' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1)

    // For security, don't disclose whether email exists or not
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          'Jika email terdaftar, tautan reset kata sandi telah dikirim. Silakan cek kotak masuk / folder spam Anda.',
      })
    }

    const token = await createPasswordResetToken(user.id)

    // App URL
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || 'https://sangpenjaga.com'
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Kata Sandi - Sang Penjaga</title>
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560px" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#141414;border:1px solid #262626;border-radius:12px;overflow:hidden;padding:32px;">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <h1 style="margin:0;font-size:24px;font-weight:900;letter-spacing:2px;color:#D4AF37;">
                      SANG PENJAGA
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;border-bottom:1px solid #262626;">
                    <h2 style="margin:0 0 8px 0;font-size:18px;color:#ffffff;">
                      Permintaan Reset Kata Sandi
                    </h2>
                    <p style="margin:0;font-size:14px;color:#a3a3a3;line-height:1.6;">
                      Halo <strong style="color:#ffffff;">${user.username}</strong>, kami menerima permintaan untuk mereset kata sandi akun Anda.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:32px 0;">
                    <a href="${resetUrl}" style="background-color:#D4AF37;color:#000000;font-weight:700;font-size:14px;padding:14px 32px;text-decoration:none;border-radius:8px;display:inline-block;letter-spacing:0.5px;">
                      Reset Kata Sandi Saya
                    </a>
                    <p style="margin:16px 0 0 0;font-size:12px;color:#737373;">
                      Tautan ini hanya berlaku selama <strong>1 jam</strong>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;border-top:1px solid #262626;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:#737373;line-height:1.5;">
                      Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:
                    </p>
                    <p style="margin:0;font-size:11px;color:#D4AF37;word-break:break-all;">
                      ${resetUrl}
                    </p>
                    <p style="margin:16px 0 0 0;font-size:11px;color:#525252;line-height:1.4;">
                      Jika Anda tidak pernah meminta reset ini, silakan abaikan email ini. Akun Anda tetap aman.
                    </p>
                  </td>
                </tr>
              </table>
              <table width="100%" max-width="560px" cellpadding="0" cellspacing="0" style="max-width:560px;margin-top:20px;">
                <tr>
                  <td align="center" style="font-size:11px;color:#525252;">
                    &copy; ${new Date().getFullYear()} Sang Penjaga. Hak Cipta Dilindungi.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    const sendResult = await sendEmail({
      to: cleanEmail,
      subject: 'Reset Kata Sandi Akun - Sang Penjaga',
      html: emailHtml,
    })

    if (!sendResult.success) {
      console.error('Failed to send reset email:', sendResult.error)
      return NextResponse.json(
        {
          error:
            sendResult.error ||
            'Gagal mengirim email reset. Silakan coba beberapa saat lagi atau hubungi Admin via WhatsApp.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        'Tautan reset kata sandi telah dikirim ke email Anda! Silakan cek kotak masuk atau folder spam Anda.',
    })
  } catch (error: any) {
    console.error('Lupa password route error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses permintaan' },
      { status: 500 }
    )
  }
}
