import Link from 'next/link'
import { ArrowLeft, BookOpen, Eye, Clock, Lock, Unlock } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export default async function KomikDetailPage({ params }: PageProps) {
  // TODO: Fetch comic by slug from DB
  const comic = null as any
  const chapters: any[] = []

  if (!comic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="font-heading text-2xl font-bold text-white">Komik tidak ditemukan</h1>
        <Link href="/komik" className="mt-4 text-gold hover:underline">
          Kembali ke daftar komik
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/komik"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>

      {/* Comic Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Cover */}
        <div className="w-full flex-shrink-0 sm:w-64 lg:w-80">
          <div className="aspect-[3/4] overflow-hidden rounded-xl border border-dark-border">
            {comic?.coverUrl ? (
              <img
                src={comic.coverUrl}
                alt={comic.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-dark-card">
                <span className="font-heading text-4xl font-bold text-gold/30">SP</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {comic?.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {comic?.genre && (
              <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                {comic.genre}
              </span>
            )}
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              comic?.status === 'ongoing' ? 'bg-green-500/10 text-green-400' :
              comic?.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
              'bg-yellow-500/10 text-yellow-400'
            }`}>
              {comic?.status}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {comic?.viewCount || 0} views
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {chapters.length} chapter
            </span>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-heading text-sm font-semibold uppercase text-gray-300">
              Sinopsis
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-400">
              {comic?.synopsis || 'Belum ada sinopsis.'}
            </p>
          </div>

          {chapters.length > 0 && (
            <Link
              href={`/komik/${params.slug}/1`}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-medium text-dark transition-colors hover:bg-gold-light"
            >
              <BookOpen className="h-5 w-5" />
              Mulai Baca
            </Link>
          )}
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-white">
          Daftar Chapter
        </h2>

        {chapters.length === 0 ? (
          <div className="rounded-xl border border-dark-border bg-dark-card p-8 text-center">
            <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-500" />
            <p className="text-sm text-gray-400">Belum ada chapter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((chapter: any) => (
              <Link
                key={chapter.id}
                href={chapter.isFree ? `/komik/${params.slug}/${chapter.chapterNumber}` : '#'}
                className={`flex items-center justify-between rounded-xl border border-dark-border bg-dark-card p-4 transition-colors ${
                  chapter.isFree ? 'hover:border-gold/30 hover:bg-dark-hover' : 'opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark text-sm font-bold text-gold">
                    {chapter.chapterNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-white">
                      {chapter.title || `Chapter ${chapter.chapterNumber}`}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(chapter.publishedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chapter.isFree ? (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <Unlock className="h-3 w-3" />
                      Gratis
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <Lock className="h-3 w-3" />
                      Premium
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
