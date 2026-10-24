'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  List,
  Home,
  Maximize,
  Minimize,
  Crown,
  Lock,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import ChapterMusicPlayer from './ChapterMusicPlayer'

interface PageItem {
  id: number
  pageNumber: number
  imageUrl: string
  width?: number | null
  height?: number | null
}

interface ChapterData {
  id: number
  chapterNumber: number
  title: string
  isFree: boolean
  musicUrl?: string | null
}

interface ComicData {
  id: number
  title: string
  slug: string
}

interface ComicReaderViewProps {
  comic: ComicData
  currentChapter: ChapterData
  pages: PageItem[]
  prevChapter: number | null
  nextChapter: number | null
  hasVipAccess: boolean
  user: any
}

export default function ComicReaderView({
  comic,
  currentChapter,
  pages,
  prevChapter,
  nextChapter,
  hasVipAccess,
  user,
}: ComicReaderViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  // Listen for fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // Toggle fullscreen mode
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        }
      }
    } catch (err) {
      console.warn('Fullscreen error:', err)
    }
  }

  // Track reading progress and auto-hide header
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
        setScrollProgress(progress)
      }

      const currentScrollY = window.scrollY
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 10) {
          // Scrolling down -> hide header for full immersion
          setHeaderVisible(false)
        } else if (currentScrollY < lastScrollY.current - 10) {
          // Scrolling up -> show header
          setHeaderVisible(true)
        }
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      {/* Top Reading Progress Bar (Gold Line) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-dark z-[60]">
        <div
          className="h-full bg-gold transition-all duration-150 ease-out shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Reader Header Bar (Auto-hides on scroll down for full immersion) */}
      <header
        className={`fixed top-1 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-3xl px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between bg-dark/90 border border-dark-border/80 backdrop-blur-xl px-3 sm:px-4 py-2 rounded-xl shadow-2xl shadow-black/80">
            {/* Left Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href={`/komik/${comic.slug}`}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-card transition-colors flex-shrink-0"
                title="Kembali ke Detail Komik"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <p className="text-[10px] text-gold font-mono font-bold uppercase tracking-wider truncate">
                  {comic.title} &bull; Ep {currentChapter.chapterNumber}
                </p>
                <h1 className="text-xs sm:text-sm font-heading font-bold text-white truncate max-w-[150px] sm:max-w-xs">
                  {currentChapter.title}
                </h1>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-gray-300 hover:text-gold hover:bg-dark-card transition-colors flex items-center gap-1 text-xs"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 text-gold" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
                <span className="hidden sm:inline font-mono text-[11px]">
                  {isFullscreen ? 'Keluar' : 'Layar Penuh'}
                </span>
              </button>

              {/* Episode List Link */}
              <Link
                href={`/komik/${comic.slug}`}
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-dark-card transition-colors"
                title="Daftar Episode"
              >
                <List className="w-4 h-4" />
              </Link>

              {/* Home Link */}
              <Link
                href="/"
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-dark-card transition-colors"
                title="Beranda"
              >
                <Home className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Comic Pages Stream */}
      <main className="mx-auto max-w-2xl sm:max-w-3xl min-h-screen pt-14 pb-10">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-8">
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

              <div className="rounded-xl border border-gold/40 bg-dark-card p-5 text-left hover:border-gold transition-all flex flex-col justify-between shadow-lg shadow-gold/5">
                <div>
                  <span className="text-xs text-gold uppercase font-bold">Hemat 30%</span>
                  <h3 className="font-heading font-bold text-lg text-white">Tahunan</h3>
                  <p className="text-2xl font-black text-gold mt-2">
                    Rp 10.000 <span className="text-xs font-normal text-gray-400">/ 365 Hari</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Akses VIP 1 tahun penuh tanpa gangguan
                  </p>
                </div>
                <Link
                  href="/langganan"
                  className="mt-4 w-full text-center py-2 px-3 rounded-lg bg-gold hover:bg-gold-light text-black text-xs font-bold transition-colors"
                >
                  Pilih Tahunan
                </Link>
              </div>
            </div>

            {!user && (
              <p className="text-xs text-gray-400 mt-6">
                Sudah punya akun member?{' '}
                <Link
                  href={`/login?redirect=/komik/${comic.slug}/${currentChapter.chapterNumber}`}
                  className="text-gold underline hover:text-gold-light"
                >
                  Masuk di sini
                </Link>
              </p>
            )}
          </div>
        ) : pages.length === 0 ? (
          /* Empty pages state */
          <div className="flex min-h-[65vh] flex-col items-center justify-center p-8 text-center text-gray-400">
            <BookOpen className="w-12 h-12 text-gold mb-3 opacity-60 animate-pulse" />
            <h3 className="text-white font-medium text-lg">Halaman sedang diproses</h3>
            <p className="text-xs text-gray-500 mt-1.5 max-w-xs leading-relaxed">
              Lembaran komik untuk episode ini belum tersedia atau sedang diunggah.
            </p>
            <Link
              href={`/komik/${comic.slug}`}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-card border border-dark-border text-xs text-gray-300 hover:text-gold hover:border-gold/40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Episode</span>
            </Link>
          </div>
        ) : (
          /* Continuous Seamless Webtoon Stream */
          <div className="flex flex-col items-center bg-black shadow-2xl">
            {pages.map((page, idx) => (
              <div key={page.id || idx} className="w-full bg-black relative">
                <img
                  src={page.imageUrl}
                  alt={`Lembar ${page.pageNumber}`}
                  className="w-full h-auto block select-none"
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.dataset.fallback && page.imageUrl.includes('cdn.sangpenjaga.com/')) {
                      target.dataset.fallback = 'true'
                      target.src = page.imageUrl.replace('https://cdn.sangpenjaga.com/', '/api/cdn/')
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Chapter Navigation */}
        <div className="border-t border-dark-border bg-dark-card/90 backdrop-blur-md p-5 sm:p-6 mt-6 rounded-2xl mx-3 sm:mx-0 flex items-center justify-between gap-3 shadow-xl">
          {prevChapter ? (
            <Link
              href={`/komik/${comic.slug}/${prevChapter}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-dark-border text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:border-gold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Episode</span> Sebelumnya
            </Link>
          ) : (
            <span className="text-xs text-gray-600 font-mono">Episode 1</span>
          )}

          <Link
            href={`/komik/${comic.slug}`}
            className="text-xs text-gold hover:underline font-mono"
          >
            Daftar Episode
          </Link>

          {nextChapter ? (
            <Link
              href={`/komik/${comic.slug}/${nextChapter}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black text-xs sm:text-sm font-bold transition-colors shadow-md shadow-gold/10"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="text-xs text-gray-600 font-mono">Episode Terakhir</span>
          )}
        </div>
      </main>

      {/* Floating Reading Progress Pill (Bottom Left) */}
      {pages.length > 0 && hasVipAccess && (
        <div className="fixed bottom-5 left-5 z-40 bg-dark/85 backdrop-blur-md border border-dark-border px-3 py-1.5 rounded-full shadow-lg text-[11px] font-mono text-gray-400">
          <span>{Math.round(scrollProgress)}%</span>
        </div>
      )}

      {/* Background YouTube Music Player */}
      <ChapterMusicPlayer
        musicUrl={currentChapter?.musicUrl}
        chapterTitle={currentChapter?.title}
      />
    </div>
  )
}
