import { db } from '@/lib/db'
import { comics, chapters, pages } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { eq, asc, desc, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// GET /api/comics/[id]/chapters - list chapters of a comic
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

    const chapterList = await db
      .select()
      .from(chapters)
      .where(eq(chapters.comicId, comicId))
      .orderBy(asc(chapters.chapterNumber))

    // Fetch pages count for each chapter
    const chaptersWithPages = await Promise.all(
      chapterList.map(async (chap) => {
        const pageList = await db
          .select({ id: pages.id })
          .from(pages)
          .where(eq(pages.chapterId, chap.id))

        return {
          ...chap,
          pageCount: pageList.length,
        }
      })
    )

    return NextResponse.json({
      comic,
      chapters: chaptersWithPages,
    })
  } catch (error) {
    console.error('Fetch chapters error:', error)
    return NextResponse.json({ error: 'Gagal memuat chapter' }, { status: 500 })
  }
}

// POST /api/comics/[id]/chapters - create new chapter with pages
export async function POST(
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
    const { chapterNumber, title, isFree, price, pageImages, musicUrl } = body

    if (!title || chapterNumber === undefined) {
      return NextResponse.json(
        { error: 'Nomor episode dan judul episode harus diisi' },
        { status: 400 }
      )
    }

    if (!pageImages || !Array.isArray(pageImages) || pageImages.length === 0) {
      return NextResponse.json(
        { error: 'Minimal harus ada 1 lembar gambar komik yang diunggah' },
        { status: 400 }
      )
    }

    // Ensure music_url column exists in TiDB
    await db.execute(sql`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS music_url VARCHAR(500);`).catch(() => {})

    const parsedChapNum = parseInt(chapterNumber)

    // Check if this chapter number already exists for this comic
    const [existingChapter] = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(
        and(
          eq(chapters.comicId, comicId),
          eq(chapters.chapterNumber, parsedChapNum)
        )
      )
      .limit(1)

    let chapterId: number

    if (existingChapter) {
      chapterId = existingChapter.id
      await db
        .update(chapters)
        .set({
          title,
          isFree: isFree !== false,
          price: isFree ? 0 : parseInt(price || '0'),
          musicUrl: musicUrl ? String(musicUrl).trim() : null,
        })
        .where(eq(chapters.id, chapterId))

      // Clean old pages if any exist
      await db.delete(pages).where(eq(pages.chapterId, chapterId))
    } else {
      // 1. Insert New Chapter
      const result = await db.insert(chapters).values({
        comicId,
        chapterNumber: parsedChapNum,
        title,
        isFree: isFree !== false,
        price: isFree ? 0 : parseInt(price || '0'),
        musicUrl: musicUrl ? String(musicUrl).trim() : null,
      })

      chapterId = (result as any)?.[0]?.insertId || (result as any)?.insertId

      if (!chapterId) {
        const [latest] = await db
          .select({ id: chapters.id })
          .from(chapters)
          .where(eq(chapters.comicId, comicId))
          .orderBy(desc(chapters.id))
          .limit(1)
        chapterId = latest?.id
      }
    }

    if (!chapterId) {
      throw new Error('Gagal mendapatkan ID chapter database')
    }

    // 2. Insert Pages
    for (let i = 0; i < pageImages.length; i++) {
      const p = pageImages[i]
      const imageUrl = typeof p === 'string' ? p : p.imageUrl || p.url
      if (!imageUrl) continue

      await db.insert(pages).values({
        chapterId: Number(chapterId),
        pageNumber: i + 1,
        imageUrl,
        width: typeof p === 'object' ? p.width || null : null,
        height: typeof p === 'object' ? p.height || null : null,
      })
    }

    return NextResponse.json({
      success: true,
      chapterId,
      message: `Episode ${parsedChapNum}: "${title}" dengan ${pageImages.length} lembar berhasil disimpan!`,
    })
  } catch (error: any) {
    console.error('Create chapter error:', error)
    return NextResponse.json(
      { error: error?.message || 'Gagal membuat episode/chapter' },
      { status: 500 }
    )
  }
}

// DELETE /api/comics/[id]/chapters?chapterId=123
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const chapterId = parseInt(searchParams.get('chapterId') || '')

    if (!chapterId) {
      return NextResponse.json({ error: 'ID chapter tidak valid' }, { status: 400 })
    }

    await db.delete(chapters).where(eq(chapters.id, chapterId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chapter error:', error)
    return NextResponse.json({ error: 'Gagal menghapus chapter' }, { status: 500 })
  }
}
