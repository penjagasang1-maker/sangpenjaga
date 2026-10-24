import Link from 'next/link'
import { ArrowLeft, BookOpen, Eye, Lock, Unlock, Crown } from 'lucide-react'
import { db } from '@/lib/db'
import { comics, chapters } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export const runtime = 'edge'
export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export default async function KomikDetailPage({ params }: PageProps) {
  let comic: any = null
  let chapterList: any[] = []

  try {
    const comicRows = await db
      .select()
      .from(comics)
      .where(eq(comics.slug, params.slug))
      .limit(1)

    comic = comicRows[0] || null

    if (comic) {
      chapterList = await db
        .select()
        .from(chapters)
        .where(eq(chapters.comicId, comic.id))
        .orderBy(asc(chapters.chapterNumber))
    }
  } catch (err) {
    console.error('Error fetching comic details:', err)
  }

  if (!comic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading text-2xl font-bold text-white">Komik tidak ditemukan</h1>
        <p className="text-gray-400 text-sm mt-2">Komik dengan alamat ini belum terbit atau telah dipindahkan.</p>
        <Link href="/komik" className="mt-4 inline-flex items-center gap-2 bg-gold px-5 py-2.5 rounded-lg text-sm font-semibold text-black hover:bg-gold-light">
          Kembali ke Daftar Komik
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/komik"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog Komik</span>
      </Link>

      {/* Comic Header Card */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8">
        {/* Cover */}
        <div className="w-full flex-shrink-0 sm:w-64 lg:w-80">
          <div className="aspect-[3/4] overflow-hidden rounded-xl border border-dark-border bg-dark">
            {comic.coverUrl ? (
              <img
                src={comic.coverUrl}
                alt={comic.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-dark">
                <span className="font-heading text-4xl font-black text-red-600/40">SANG PENJAGA</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {comic.genre && (
                <span className="rounded-full bg-gold/15 border border-gold/30 px-3 py-0.5 text-xs font-semibold text-gold uppercase tracking-wider">
                  {comic.genre}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                  comic.status === 'ongoing'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : comic.status === 'completed'
                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                    : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                }`}
              >
                {comic.status}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-wide">
              {comic.title}
            </h1>

            <div className="mt-4 flex items-center gap-6 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-gray-500" />
                {comic.viewCount} views
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-gold" />
                {chapterList.length} Episode
              </span>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-gray-400">
                Sinopsis Cerita
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-300 max-w-2xl">
                {comic.synopsis || 'Belum ada sinopsis untuk komik ini.'}
              </p>
            </div>
          </div>

          {chapterList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-dark-border">
              <Link
                href={`/komik/${params.slug}/${chapterList[0].chapterNumber}`}
                className="inline-flex items-center gap-2 rounded-lg bg-gold hover:bg-gold-light px-6 py-3 font-heading font-bold text-sm text-black transition-all shadow-lg shadow-gold/20"
              >
                <BookOpen className="h-4 w-4" />
                <span>Mulai Membaca Episode 1</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gold rounded-full" />
            Daftar Episode
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {chapterList.length} Episode Terbit
          </span>
        </div>

        {chapterList.length === 0 ? (
          <div className="rounded-xl border border-dark-border bg-dark-card p-12 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            <h3 className="text-white font-medium">Belum ada episode</h3>
            <p className="text-xs text-gray-500 mt-1">
              Episode untuk komik ini sedang dalam proses pengerjaan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {chapterList.map((chapter: any) => (
              <Link
                key={chapter.id}
                href={`/komik/${params.slug}/${chapter.chapterNumber}`}
                className="flex items-center justify-between rounded-xl border border-dark-border bg-dark-card p-4 hover:border-gold/50 hover:bg-dark-hover transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-dark text-sm font-bold text-gold border border-dark-border group-hover:border-gold/50">
                    {chapter.chapterNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-gold transition-colors">
                      {chapter.title || `Episode ${chapter.chapterNumber}`}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {chapter.publishedAt ? new Date(chapter.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {chapter.isFree ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-semibold text-green-400">
                      <Unlock className="h-3 w-3" />
                      Gratis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/40 px-3 py-1 text-xs font-semibold text-gold shadow-sm shadow-gold/10">
                      <Crown className="h-3.5 w-3.5 text-gold" />
                      Member VIP
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
