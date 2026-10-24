import { db } from '@/lib/db'
import { siteSettings } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { defaultSettings, invalidateSettingsCache } from '@/lib/settings'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function ensureTableAndDefault() {
  try {
    // 1. Create table if not exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        site_name VARCHAR(255) NOT NULL DEFAULT 'Sang Penjaga',
        logo_prefix VARCHAR(100) NOT NULL DEFAULT 'SANG',
        logo_suffix VARCHAR(100) NOT NULL DEFAULT 'PENJAGA',
        footer_description TEXT,
        contact_email VARCHAR(255) NOT NULL DEFAULT 'mrizqi045@gmail.com',
        contact_phone VARCHAR(100) NOT NULL DEFAULT '087880503974',
        contact_address VARCHAR(500) NOT NULL DEFAULT 'Cipinang melayu, 13620',
        social_instagram VARCHAR(500) DEFAULT 'https://instagram.com',
        social_twitter VARCHAR(500) DEFAULT 'https://x.com',
        social_youtube VARCHAR(500) DEFAULT 'https://youtube.com',
        social_tiktok VARCHAR(500) DEFAULT '',
        copyright_text VARCHAR(255) NOT NULL DEFAULT '© 2026 Sang Penjaga. Mond Bhasinato',
        about_title VARCHAR(255) NOT NULL DEFAULT 'SANG PENJAGA',
        about_paragraph_1 TEXT,
        about_paragraph_2 TEXT,
        about_highlight TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // 2. Check if row 1 exists
    const [existing] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1)

    if (!existing) {
      await db.insert(siteSettings).values({
        id: 1,
        ...defaultSettings,
      })
    }
  } catch (e) {
    console.error('Error ensuring site_settings table:', e)
  }
}

// GET: fetch current settings for admin
export async function GET() {
  try {
    const { user } = await validateRequest()
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    await ensureTableAndDefault()

    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1)

    return NextResponse.json({
      settings: row || defaultSettings,
    })
  } catch (error) {
    console.error('Get admin settings error:', error)
    return NextResponse.json({ settings: defaultSettings })
  }
}

// POST: update settings
export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    await ensureTableAndDefault()

    const body = await request.json()

    const updateData = {
      siteName: body.siteName || defaultSettings.siteName,
      logoPrefix: body.logoPrefix || defaultSettings.logoPrefix,
      logoSuffix: body.logoSuffix || defaultSettings.logoSuffix,
      footerDescription: body.footerDescription ?? defaultSettings.footerDescription,
      contactEmail: body.contactEmail || defaultSettings.contactEmail,
      contactPhone: body.contactPhone || defaultSettings.contactPhone,
      contactAddress: body.contactAddress || defaultSettings.contactAddress,
      socialInstagram: body.socialInstagram ?? '',
      socialTwitter: body.socialTwitter ?? '',
      socialYoutube: body.socialYoutube ?? '',
      socialTiktok: body.socialTiktok ?? '',
      copyrightText: body.copyrightText || defaultSettings.copyrightText,
      aboutTitle: body.aboutTitle || defaultSettings.aboutTitle,
      aboutParagraph1: body.aboutParagraph1 ?? defaultSettings.aboutParagraph1,
      aboutParagraph2: body.aboutParagraph2 ?? defaultSettings.aboutParagraph2,
      aboutHighlight: body.aboutHighlight ?? defaultSettings.aboutHighlight,
    }

    await db
      .insert(siteSettings)
      .values({
        id: 1,
        ...updateData,
      })
      .onDuplicateKeyUpdate({
        set: updateData,
      })

    invalidateSettingsCache()

    return NextResponse.json({
      success: true,
      message: 'Pengaturan berhasil disimpan',
      settings: updateData,
    })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: error?.message || 'Gagal menyimpan pengaturan' },
      { status: 500 }
    )
  }
}
