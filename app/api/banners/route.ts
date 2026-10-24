import { db } from '@/lib/db'
import { banners } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { eq, asc } from 'drizzle-orm'
import { deleteFromR2 } from '@/lib/r2'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// GET /api/banners - list banners
export async function GET() {
  try {
    const list = await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(asc(banners.sortOrder))

    return NextResponse.json({ banners: list })
  } catch (error) {
    console.error('Get banners error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil banner' },
      { status: 500 }
    )
  }
}

// POST /api/banners - create banner (admin/superadmin)
export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const { imageUrl, linkUrl, sortOrder } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL gambar banner harus diisi' },
        { status: 400 }
      )
    }

    const result = await db.insert(banners).values({
      imageUrl,
      linkUrl: linkUrl || null,
      sortOrder: sortOrder || 0,
      isActive: true,
    })

    return NextResponse.json({
      success: true,
      banner: {
        id: (result as any)?.insertId,
        imageUrl,
        linkUrl,
      },
    })
  } catch (error) {
    console.error('Create banner error:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan banner' },
      { status: 500 }
    )
  }
}

// DELETE /api/banners?id=123 (admin/superadmin)
export async function DELETE(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '')

    if (!id) {
      return NextResponse.json(
        { error: 'ID banner tidak valid' },
        { status: 400 }
      )
    }

    // 1. Fetch banner to get image URL
    const [banner] = await db
      .select({ imageUrl: banners.imageUrl })
      .from(banners)
      .where(eq(banners.id, id))
      .limit(1)

    // 2. Delete file from R2
    if (banner?.imageUrl) {
      await deleteFromR2(banner.imageUrl).catch((err) =>
        console.error('R2 delete banner err:', err)
      )
    }

    // 3. Delete from database
    await db.delete(banners).where(eq(banners.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete banner error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus banner' },
      { status: 500 }
    )
  }
}
