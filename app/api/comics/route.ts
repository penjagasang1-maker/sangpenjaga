import { db } from '@/lib/db'
import { comics } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { eq, desc, like, and } from 'drizzle-orm'
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

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, slug, synopsis, coverUrl, genre, status: comicStatus } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Judul dan slug harus diisi' },
        { status: 400 }
      )
    }

    // Check duplicate slug
    const existing = await db
      .select()
      .from(comics)
      .where(eq(comics.slug, slug))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan' },
        { status: 400 }
      )
    }

    const result = await db.insert(comics).values({
      title,
      slug,
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
