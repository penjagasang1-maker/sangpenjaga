import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import { comics, chapters, pages, subscriptions } from '@/lib/schema'
import { eq, and, asc, gt } from 'drizzle-orm'
import { validateRequest } from '@/lib/auth'
import ComicReaderView from '@/components/reader/ComicReaderView'

export const runtime = 'edge'
export const revalidate = 0

interface PageProps {
  params: { slug: string; chapter: string }
}

export default async function ReaderPage({ params }: PageProps) {
  const chapterNum = parseInt(params.chapter)
  const { user } = await validateRequest()

  let comic: any = null
  let currentChapter: any = null
  let chapterPages: any[] = []
  let prevChapter: number | null = null
  let nextChapter: number | null = null
  let hasVipAccess = false

  try {
    // 1. Fetch comic
    const [c] = await db
      .select()
      .from(comics)
      .where(eq(comics.slug, params.slug))
      .limit(1)

    comic = c || null

    if (comic) {
      // 2. Fetch current chapter
      const [chap] = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.comicId, comic.id),
            eq(chapters.chapterNumber, chapterNum)
          )
        )
        .limit(1)

      currentChapter = chap || null

      if (currentChapter) {
        // Check VIP access
        if (currentChapter.isFree) {
          hasVipAccess = true
        } else if (user) {
          if (user.role === 'admin' || user.role === 'superadmin') {
            hasVipAccess = true
          } else {
            // Check active subscription in DB
            const activeSubs = await db
              .select()
              .from(subscriptions)
              .where(
                and(
                  eq(subscriptions.userId, user.id),
                  eq(subscriptions.status, 'active'),
                  gt(subscriptions.expiresAt, new Date())
                )
              )
              .limit(1)

            if (activeSubs.length > 0) {
              hasVipAccess = true
            }
          }
        }

        // 3. If access allowed, fetch pages
        if (hasVipAccess) {
          chapterPages = await db
            .select()
            .from(pages)
            .where(eq(pages.chapterId, currentChapter.id))
            .orderBy(asc(pages.pageNumber))
        }

        // 4. Check prev & next chapter
        const allChapters = await db
          .select({ num: chapters.chapterNumber })
          .from(chapters)
          .where(eq(chapters.comicId, comic.id))
          .orderBy(asc(chapters.chapterNumber))

        const nums = allChapters.map((ch) => ch.num)
        const idx = nums.indexOf(chapterNum)
        if (idx > 0) prevChapter = nums[idx - 1]
        if (idx < nums.length - 1 && idx !== -1) nextChapter = nums[idx + 1]
      }
    }
  } catch (err) {
    console.error('Reader page error:', err)
  }

  if (!comic || !currentChapter) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-center px-4 text-white">
        <h1 className="font-heading text-2xl font-bold">Episode tidak ditemukan</h1>
        <p className="text-gray-400 text-sm mt-2">
          Episode {chapterNum} dari komik ini belum tersedia.
        </p>
        <Link
          href={`/komik/${params.slug}`}
          className="mt-6 inline-flex items-center gap-2 bg-gold px-5 py-2.5 rounded-lg text-sm font-semibold text-black hover:bg-gold-light"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Komik</span>
        </Link>
      </div>
    )
  }

  return (
    <ComicReaderView
      comic={comic}
      currentChapter={currentChapter}
      pages={chapterPages}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      hasVipAccess={hasVipAccess}
      user={user}
    />
  )
}
