import { db } from '@/lib/db'
import { comics, chapters, pages } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { eq, desc, like, and } from 'drizzle-orm'
import { deleteFromR2 } from '@/lib/r2'
import { NextResponse } from 'next/server'
export const runtime = 'edge'

// GET /api/comics - list comics (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''
    const status = searchParams.get('status') || ''
    const offset = (page - 1) * limit

    const conditions = []
    if (search) {
      conditions.push(like(comics.title, `%${search}%`))
    }
    if (genre) {
      conditions.push(eq(comics.genre, genre))
    }
    if (status) {
      conditions.push(eq(comics.status, status as 'ongoing' | 'completed' | 'hiatus'))
    }

    let result
    if (conditions.length > 0) {
      result = await db
        .select()
        .from(comics)
        .where(and(...conditions))
        .orderBy(desc(comics.createdAt))
        .limit(limit)
        .offset(offset)
    } else {
      result = await db
        .select()
        .from(comics)
        .orderBy(desc(comics.createdAt))
        .limit(limit)
        .offset(offset)
    }

    return NextResponse.json({ comics: result })
  } catch (error) {
    console.error('Get comics error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data komik' },
      { status: 500 }
    )
  }
}

// POST /api/comics - create comic (admin only)
export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, slug, synopsis, coverUrl, genre, status: comicStatus } = body

    const cleanSlug = (slug || title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    if (!title || !cleanSlug) {
      return NextResponse.json(
        { error: 'Judul dan slug harus diisi' },
        { status: 400 }
      )
    }

    // Check duplicate slug
    const existing = await db
      .select()
      .from(comics)
      .where(eq(comics.slug, cleanSlug))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan' },
        { status: 400 }
      )
    }

    const result = await db.insert(comics).values({
      title,
      slug: cleanSlug,
      synopsis: synopsis || '',
      coverUrl: coverUrl || '',
      genre: genre || '',
      status: comicStatus || 'ongoing',
    })

    return NextResponse.json({ success: true, id: (result as any)?.insertId })
  } catch (error) {
    console.error('Create comic error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat komik' },
      { status: 500 }
    )
  }
}

// DELETE /api/comics?id=123 (admin/superadmin)
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
        { error: 'ID komik tidak valid' },
        { status: 400 }
      )
    }

    // 1. Fetch comic details for coverUrl
    const [comic] = await db
      .select({ coverUrl: comics.coverUrl })
      .from(comics)
      .where(eq(comics.id, id))
      .limit(1)

    // 2. Fetch all chapters and pages to collect storage URLs
    const comicChapters = await db
      .select({ id: chapters.id, musicUrl: chapters.musicUrl })
      .from(chapters)
      .where(eq(chapters.comicId, id))

    const urlsToDelete: string[] = []
    if (comic?.coverUrl) urlsToDelete.push(comic.coverUrl)

    for (const chap of comicChapters) {
      if (chap.musicUrl) urlsToDelete.push(chap.musicUrl)

      const pageRows = await db
        .select({ imageUrl: pages.imageUrl })
        .from(pages)
        .where(eq(pages.chapterId, chap.id))

      for (const p of pageRows) {
        if (p.imageUrl) urlsToDelete.push(p.imageUrl)
      }

      await db.delete(pages).where(eq(pages.chapterId, chap.id))
    }

    // 3. Delete all files from Cloudflare R2
    if (urlsToDelete.length > 0) {
      await deleteFromR2(urlsToDelete).catch((err) =>
        console.error('R2 delete comic files error:', err)
      )
    }

    // 4. Cascade delete chapters & comic
    await db.delete(chapters).where(eq(chapters.comicId, id))
    await db.delete(comics).where(eq(comics.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comic error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus komik' },
      { status: 500 }
    )
  }
}
