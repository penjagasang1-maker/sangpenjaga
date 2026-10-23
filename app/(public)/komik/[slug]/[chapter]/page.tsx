import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Crown,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { db } from '@/lib/db'
import { comics, chapters, pages, subscriptions } from '@/lib/schema'
import { eq, and, asc, gt } from 'drizzle-orm'
import { validateRequest } from '@/lib/auth'

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
    <div className="relative min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      {/* Sticky Reader Navigation Bar */}
      <div className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-dark-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/komik/${params.slug}`}
              className="rounded-lg p-2 text-gray-400 hover:bg-dark-card hover:text-white transition-colors"
              title="Kembali ke Daftar Episode"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-[11px] text-gold font-mono font-bold uppercase tracking-wider">
                Episode {chapterNum}
              </p>
              <h2 className="text-sm font-heading font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {currentChapter.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/komik/${params.slug}`}
              className="rounded-lg p-2 text-gray-400 hover:bg-dark-card hover:text-white transition-colors"
              title="Daftar Episode"
            >
              <List className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="rounded-lg p-2 text-gray-400 hover:bg-dark-card hover:text-white transition-colors"
              title="Beranda"
            >
              <Home className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Webtoon Reader Content */}
      <main className="mx-auto max-w-2xl">
        {!hasVipAccess ? (
          /* VIP Lock Paywall Screen */
          <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold shadow-lg shadow-gold/20">
                <Crown className="w-10 h-10 text-amber-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-dark-card p-1.5 rounded-full border border-dark-border text-gold">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full mb-3">
              Konten Eksklusif
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Episode Khusus Member VIP
            </h2>
            <p className="text-gray-400 text-sm max-w-md mt-2 leading-relaxed">
              Episode ini dikunci khusus untuk pembaca dengan paket langganan aktif.
              Aktifkan langganan Anda untuk membaca semua episode tanpa batas!
            </p>

            {/* Subscription Plans Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-8">
              {/* Monthly */}
              <div className="rounded-xl border border-dark-border bg-dark-card p-5 text-left hover:border-gold/50 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-medium">Paket</span>
                  <h3 className="font-heading font-bold text-lg text-white">Bulanan</h3>
                  <p className="text-2xl font-black text-gold mt-2">
                    Rp 1.000 <span className="text-xs font-normal text-gray-400">/ 30 Hari</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Akses semua chapter komik selama 1 bulan penuh
                  </p>
                </div>
                <Link
                  href="/langganan"
                  className="mt-4 w-full text-center py-2 px-3 rounded-lg bg-gold hover:bg-gold-light text-black text-xs font-bold transition-colors"
                >
                  Pilih Bulanan
                </Link>
              </div>

              {/* Yearly */}
              <div className="relative rounded-xl border-2 border-gold bg-gold/10 p-5 text-left hover:bg-gold/15 transition-all flex flex-col justify-between">
                <span className="absolute -top-2.5 right-4 bg-gold text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hemat 2 Bulan
                </span>
                <div>
                  <span className="text-xs text-gold uppercase font-semibold">Paket Terbaik</span>
                  <h3 className="font-heading font-bold text-lg text-white">Tahunan</h3>
                  <p className="text-2xl font-black text-gold mt-2">
                    Rp 10.000 <span className="text-xs font-normal text-gray-400">/ Tahun</span>
                  </p>
                  <p className="text-xs text-gray-300 mt-2">
                    Akses tanpa batas 365 hari untuk semua seri komik
                  </p>
                </div>
                <Link
                  href="/langganan"
                  className="mt-4 w-full text-center py-2 px-3 rounded-lg bg-gold hover:bg-gold-light text-black text-xs font-bold transition-colors shadow-md shadow-gold/20"
                >
                  Pilih Tahunan
                </Link>
              </div>
            </div>

            {!user && (
              <p className="text-xs text-gray-400 mt-6">
                Sudah punya akun member?{' '}
                <Link href={`/login?redirect=/komik/${params.slug}/${chapterNum}`} className="text-gold underline hover:text-gold-light">
                  Masuk di sini
                </Link>
              </p>
            )}
          </div>
        ) : chapterPages.length === 0 ? (
          /* Empty pages state */
          <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center text-gray-400">
            <Sparkles className="w-10 h-10 text-gold mb-3 opacity-60" />
            <h3 className="text-white font-medium text-lg">Halaman sedang diproses</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Lembaran komik untuk episode ini belum diunggah oleh admin.
            </p>
          </div>
        ) : (
          /* Vertical Webtoon Pages Stream */
          <div className="flex flex-col items-center bg-black">
            {chapterPages.map((page, idx) => (
              <img
                key={page.id || idx}
                src={page.imageUrl}
                alt={`Lembar ${page.pageNumber}`}
                className="w-full h-auto block select-none pointer-events-none"
                loading={idx < 3 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        )}

        {/* Bottom Chapter Navigation Bar */}
        <div className="border-t border-dark-border bg-dark-card p-6 mt-8 flex items-center justify-between gap-4">
          {prevChapter ? (
            <Link
              href={`/komik/${params.slug}/${prevChapter}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-dark-border text-sm font-medium text-gray-300 hover:text-white hover:border-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Episode Sebelumnya</span>
            </Link>
          ) : (
            <span className="text-xs text-gray-600">Episode Pertama</span>
          )}

          <Link
            href={`/komik/${params.slug}`}
            className="text-xs text-gold hover:underline font-mono"
          >
            Daftar Episode
          </Link>

          {nextChapter ? (
            <Link
              href={`/komik/${params.slug}/${nextChapter}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black text-sm font-bold transition-colors"
            >
              <span>Episode Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="text-xs text-gray-600">Episode Terakhir</span>
          )}
        </div>
      </main>
    </div>
  )
}
