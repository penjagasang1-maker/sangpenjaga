'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronLeft, Home, List, Settings } from 'lucide-react'

export const runtime = 'edge'

interface PageProps {
  params: { slug: string; chapter: string }
}

export default function ReaderPage({ params }: PageProps) {
  const [pages, setPages] = useState<any[]>([])
  const [showControls, setShowControls] = useState(true)
  const [loading, setLoading] = useState(true)

  // TODO: Fetch chapter pages from API
  useEffect(() => {
    // Simulated loading
    setLoading(false)
  }, [])

  const chapterNum = parseInt(params.chapter)

  return (
    <div
      className="relative min-h-screen bg-black"
      onClick={() => setShowControls(!showControls)}
    >
      {/* Top Bar */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 bg-dark/95 backdrop-blur-sm transition-transform duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/komik/${params.slug}`}
              className="rounded-lg p-2 text-gray-400 hover:bg-dark-hover hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs text-gray-400">Chapter {chapterNum}</p>
              <p className="text-sm font-medium text-white">{params.slug.replace(/-/g, ' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg p-2 text-gray-400 hover:bg-dark-hover hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Home className="h-4 w-4" />
            </Link>
            <Link
              href={`/komik/${params.slug}`}
              className="rounded-lg p-2 text-gray-400 hover:bg-dark-hover hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <List className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Reader Content - Vertical Scroll (Webtoon style) */}
      <div className="mx-auto max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : pages.length === 0 ? (
          <div className="flex h-screen flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-white">Belum ada halaman</p>
            <p className="mt-2 text-sm text-gray-400">
              Chapter ini belum memiliki konten
            </p>
            <Link
              href={`/komik/${params.slug}`}
              className="mt-4 rounded-lg bg-gold px-6 py-2 text-sm font-medium text-dark hover:bg-gold-light"
            >
              Kembali ke Detail
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {pages.map((page: any) => (
              <img
                key={page.id}
                src={page.imageUrl}
                alt={`Halaman ${page.pageNumber}`}
                className="w-full"
                loading="lazy"
                style={{
                  aspectRatio: page.width && page.height
                    ? `${page.width}/${page.height}`
                    : undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm transition-transform duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href={chapterNum > 1 ? `/komik/${params.slug}/${chapterNum - 1}` : '#'}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              chapterNum > 1
                ? 'bg-dark-card text-white hover:bg-dark-hover'
                : 'cursor-not-allowed bg-dark-card/50 text-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              if (chapterNum <= 1) e.preventDefault()
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Sebelumnya
          </Link>

          <span className="text-sm text-gray-400">
            Chapter {chapterNum}
          </span>

          <Link
            href={`/komik/${params.slug}/${chapterNum + 1}`}
            className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gold-light"
            onClick={(e) => e.stopPropagation()}
          >
            Selanjutnya
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
