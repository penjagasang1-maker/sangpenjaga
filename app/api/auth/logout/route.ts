import { lucia, validateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
export const runtime = 'edge'

export async function POST() {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return NextResponse.json(
        { error: 'Tidak ada sesi aktif' },
        { status: 401 }
      )
    }

    await lucia.invalidateSession(session.id)
    const blankCookie = lucia.createBlankSessionCookie()

    cookies().set(
      blankCookie.name,
      blankCookie.value,
      blankCookie.attributes
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
