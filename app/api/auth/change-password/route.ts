import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, hashHex] = hash.split(':')
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)))
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )
  const derivedHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return derivedHex === hashHex
}

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
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: 'Silakan masuk terlebih dahulu' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Kata sandi saat ini dan kata sandi baru wajib diisi' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Kata sandi baru minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Get current user password hash from DB
    const [dbUser] = await db
      .select({
        id: users.id,
        hashedPassword: users.hashedPassword,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 })
    }

    const isMatch = await verifyPassword(currentPassword, dbUser.hashedPassword)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Kata sandi saat ini tidak cocok / salah' },
        { status: 400 }
      )
    }

    const newHashedPassword = await hashPassword(newPassword)

    await db
      .update(users)
      .set({ hashedPassword: newHashedPassword })
      .where(eq(users.id, user.id))

    return NextResponse.json({
      success: true,
      message: 'Kata sandi Anda berhasil diperbarui!',
    })
  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui kata sandi. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
