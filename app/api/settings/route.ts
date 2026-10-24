import { getSiteSettings } from '@/lib/settings'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Get public settings error:', error)
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 })
  }
}
