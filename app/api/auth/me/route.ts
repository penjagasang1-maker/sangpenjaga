import { validateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ user: null })
  }
}
