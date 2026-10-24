import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { verifyAndConsumeResetToken } from '@/lib/password-reset'

export const runtime = 'edge'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )
  const hashArray = new Uint8Array(hash)
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('')
  const hashHex = Array.from(hashArray).map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${saltHex}:${hashHex}`
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token dan kata sandi baru wajib diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Kata sandi minimal 6 karakter' },
        { status: 400 }
      )
    }

    const verification = await verifyAndConsumeResetToken(token)

    if (!verification.valid || !verification.userId) {
      return NextResponse.json(
        { error: verification.error || 'Tautan reset tidak valid atau sudah kedaluwarsa' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    await db
      .update(users)
      .set({ hashedPassword })
      .where(eq(users.id, verification.userId))

    return NextResponse.json({
      success: true,
      message: 'Kata sandi Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru.',
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat mereset kata sandi' },
      { status: 500 }
    )
  }
}
