'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Music, Volume2, VolumeX, Play, Pause, Disc3, Sparkles } from 'lucide-react'

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

export default function ChapterMusicPlayer({ musicUrl, chapterTitle }: ChapterMusicPlayerProps) {
  const videoId = musicUrl ? extractYouTubeId(musicUrl) : null
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Send command to YouTube iframe via postMessage
  const sendCommand = (func: string, args: any = '') => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      )
    }
  }

  // Handle first user interaction (click, scroll, touch) to trigger autoplay
  useEffect(() => {
    if (!videoId) return

    const handleFirstInteraction = () => {
      if (hasInteracted) return
      setHasInteracted(true)

      // Start playing
      sendCommand('playVideo')
      sendCommand('unMute')
      sendCommand('setVolume', 65)
      setIsPlaying(true)
      setShowToast(true)

      setTimeout(() => setShowToast(false), 4000)

      // Remove listeners once activated
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('scroll', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('wheel', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction, { passive: true })
    window.addEventListener('scroll', handleFirstInteraction, { passive: true })
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
    window.addEventListener('wheel', handleFirstInteraction, { passive: true })
    window.addEventListener('keydown', handleFirstInteraction, { passive: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('scroll', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('wheel', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [videoId, hasInteracted])

  if (!videoId) return null

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPlaying) {
      sendCommand('pauseVideo')
      setIsPlaying(false)
    } else {
      sendCommand('playVideo')
      setIsPlaying(true)
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

  const embedOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://sangpenjaga.com'

  return (
    <>
      {/* Hidden YouTube IFrame */}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${videoId}&origin=${embedOrigin}&controls=0&playsinline=1`}
        title="Chapter Background Music"
        className="fixed -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none"
        allow="autoplay; encrypted-media"
      />

      {/* Autoplay First-Interaction Notification Toast */}
      {showToast && (
        <div className="fixed bottom-20 right-4 z-50 animate-bounce duration-1000 max-w-xs bg-dark-card/95 border border-gold/40 backdrop-blur-md rounded-xl p-3 shadow-2xl flex items-center gap-3 text-xs text-white">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-gold">Musik Latar Diputar</p>
            <p className="text-[11px] text-gray-300">Klik widget musik untuk jeda/bisu.</p>
          </div>
        </div>
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
              BGM Chapter
            </span>
          </div>

          <div className="h-3 w-[1px] bg-dark-border mx-1" />

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            className="p-1 text-gold hover:text-gold-light hover:scale-110 transition-transform"
            title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Mute/Unmute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Bunyikan suara musik" : "Bisukan suara musik"}
            className="p-1 text-gray-400 hover:text-white hover:scale-110 transition-transform"
            title={isMuted ? 'Bunyikan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  )
}
