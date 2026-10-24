import { db } from '@/lib/db'
import { comics, chapters, pages } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// GET /api/comics/[id] - get comic detail
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comicId = parseInt(params.id)
    if (isNaN(comicId)) {
      return NextResponse.json({ error: 'ID komik tidak valid' }, { status: 400 })
    }

    const [comic] = await db
      .select()
      .from(comics)
      .where(eq(comics.id, comicId))
      .limit(1)

    if (!comic) {
      return NextResponse.json({ error: 'Komik tidak ditemukan' }, { status: 404 })
    }

    if (comic.slug && (comic.slug.includes(' ') || comic.slug.includes('%20'))) {
      const cleanSlug = comic.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      await db.update(comics).set({ slug: cleanSlug }).where(eq(comics.id, comicId)).catch(() => {})
      comic.slug = cleanSlug
    }

    return NextResponse.json({ comic })
  } catch (error: any) {
    console.error('Get comic error:', error)
    return NextResponse.json(
      { error: error?.message || 'Gagal mengambil data komik' },
      { status: 500 }
    )
  }
}

// PUT /api/comics/[id] - update comic detail (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const comicId = parseInt(params.id)
    if (isNaN(comicId)) {
      return NextResponse.json({ error: 'ID komik tidak valid' }, { status: 400 })
    }

    const body = await request.json()
    const { title, slug, synopsis, coverUrl, genre, status } = body

    const cleanSlug = (slug || title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    if (!title || !cleanSlug) {
      return NextResponse.json(
        { error: 'Judul dan slug komik wajib diisi' },
        { status: 400 }
      )
    }

    await db
      .update(comics)
      .set({
        title,
        slug: cleanSlug,
        synopsis: synopsis || '',
        coverUrl: coverUrl || null,
        genre: genre || '',
        status: status || 'ongoing',
      })
      .where(eq(comics.id, comicId))

    const [updatedComic] = await db
      .select()
      .from(comics)
      .where(eq(comics.id, comicId))
      .limit(1)

    return NextResponse.json({
      success: true,
      comic: updatedComic,
      message: 'Data komik berhasil diperbarui!',
    })
  } catch (error: any) {
    console.error('Update comic error:', error)
    return NextResponse.json(
      { error: error?.message || 'Gagal memperbarui data komik' },
      { status: 500 }
    )
  }
}

// DELETE /api/comics/[id] - delete comic and its chapters (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const comicId = parseInt(params.id)
    if (isNaN(comicId)) {
      return NextResponse.json({ error: 'ID komik tidak valid' }, { status: 400 })
    }

    // Cascade delete chapters & pages
    const comicChapters = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(eq(chapters.comicId, comicId))

    for (const chap of comicChapters) {
      await db.delete(pages).where(eq(pages.chapterId, chap.id))
    }

    await db.delete(chapters).where(eq(chapters.comicId, comicId))
    await db.delete(comics).where(eq(comics.id, comicId))

    return NextResponse.json({
      success: true,
      message: 'Komik dan seluruh episode berhasil dihapus!',
    })
  } catch (error: any) {
    console.error('Delete comic error:', error)
    return NextResponse.json(
      { error: error?.message || 'Gagal menghapus komik' },
      { status: 500 }
    )
  }
}
