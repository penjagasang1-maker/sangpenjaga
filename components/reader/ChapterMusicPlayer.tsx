'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Music, Volume2, VolumeX, Play, Pause, Disc3, Sparkles, X } from 'lucide-react'

interface ChapterMusicPlayerProps {
  musicUrl?: string | null
  chapterTitle?: string
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch|shorts)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/
  const match = url.match(regExp)
  return match ? match[1] : null
}

export default function ChapterMusicPlayer({ musicUrl }: ChapterMusicPlayerProps) {
  const videoId = musicUrl ? extractYouTubeId(musicUrl) : null
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [origin, setOrigin] = useState('https://sangpenjaga.com')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  // Send command to YouTube iframe via postMessage
  const sendCommand = (func: string, args: any = '') => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      )
    }
  }

  const startPlaying = () => {
    sendCommand('unMute')
    sendCommand('setVolume', 70)
    sendCommand('playVideo')
    setIsPlaying(true)
    setIsMuted(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3500)
  }

  // Attempt first user tap/click on page to start music if not yet playing
  useEffect(() => {
    if (!videoId) return

    const handleFirstClick = (e: MouseEvent | TouchEvent) => {
      // Don't auto-trigger if user tapped close or links
      const target = e.target as HTMLElement
      if (target?.closest('button') || target?.closest('a') || target?.closest('input')) {
        return
      }
      if (!isPlaying && !isDismissed) {
        startPlaying()
      }
    }

    window.addEventListener('click', handleFirstClick, { passive: true })
    return () => {
      window.removeEventListener('click', handleFirstClick)
    }
  }, [videoId, isPlaying, isDismissed])

  if (!videoId) return null

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPlaying) {
      sendCommand('pauseVideo')
      setIsPlaying(false)
    } else {
      startPlaying()
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isMuted) {
      sendCommand('unMute')
      setIsMuted(false)
    } else {
      sendCommand('mute')
      setIsMuted(true)
    }
  }

  return (
    <>
      {/* Hidden YouTube IFrame with 1px size to avoid mobile background suspension */}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${videoId}&origin=${origin}&controls=0&playsinline=1`}
        title="Chapter Background Music"
        className="fixed bottom-0 right-0 w-[1px] h-[1px] opacity-1 pointer-events-none z-[-1] overflow-hidden"
        allow="autoplay; encrypted-media"
      />

      {/* Webtoon-style Prompt Banner (Mobile & Desktop) when music is not yet playing */}
      {!isPlaying && !isDismissed && (
        <aside
          aria-label="Notifikasi musik chapter"
          className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-md w-full px-3"
        >
          <div className="bg-dark/95 border border-gold/50 backdrop-blur-xl rounded-2xl p-3 sm:px-4 sm:py-3 shadow-2xl shadow-black flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0 animate-pulse">
                <Music className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Musik Pengiring Bab</p>
                <p className="text-[11px] text-gray-300 truncate">Ketuk tombol untuk memutar musik</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={startPlaying}
                className="bg-gold hover:bg-gold-light active:scale-95 text-black text-xs font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-md shadow-gold/20"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Putar</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 text-gray-400 hover:text-white rounded-md"
                aria-label="Tutup notifikasi musik"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Autoplay Feedback Toast */}
      {showToast && (
        <aside
          aria-label="Status musik latar"
          className="fixed bottom-20 right-4 z-50 animate-bounce duration-1000 max-w-xs bg-dark-card/95 border border-gold/40 backdrop-blur-md rounded-xl p-3 shadow-2xl flex items-center gap-3 text-xs text-white"
        >
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-gold">Musik Latar Berjalan</p>
            <p className="text-[11px] text-gray-300">Gunakan kontrol di pojok kanan bawah.</p>
          </div>
        </aside>
      )}

      {/* Floating Mini Player Widget (Bottom-Right) */}
      <aside aria-label="Pemutar musik latar chapter" className="fixed bottom-5 right-5 z-40">
        <div className="flex items-center gap-2 bg-dark/90 border border-gold/30 hover:border-gold/60 backdrop-blur-lg px-3.5 py-2 rounded-full shadow-2xl shadow-black/80 transition-all">
          {/* Animated vinyl / soundwave */}
          <div className="flex items-center gap-2">
            <Disc3
              className={`w-4 h-4 text-gold ${
                isPlaying ? 'animate-spin duration-3000' : 'opacity-60'
              }`}
            />
            <div className="hidden sm:flex items-center gap-0.5 h-3">
              <span className={`w-0.5 bg-gold rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-gold rounded-full transition-all ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1'}`} />
              <span className={`w-0.5 bg-gold rounded-full transition-all ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1'}`} />
            </div>
            <span className="text-[11px] font-mono text-gray-300 font-semibold uppercase tracking-wider hidden md:inline">
              BGM
            </span>
          </div>

          <div className="h-3 w-[1px] bg-dark-border mx-1" />

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            className="p-1 text-gold hover:text-gold-light hover:scale-110 active:scale-95 transition-transform"
            title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Mute/Unmute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Bunyikan suara musik" : "Bisukan suara musik"}
            className="p-1 text-gray-400 hover:text-white hover:scale-110 active:scale-95 transition-transform"
            title={isMuted ? 'Bunyikan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  )
}

