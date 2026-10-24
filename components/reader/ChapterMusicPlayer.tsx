'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause, Disc3 } from 'lucide-react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: any
  }
}

interface ChapterMusicPlayerProps {
  musicUrl?: string | null
  chapterTitle?: string
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch|shorts)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/
  const match = trimmed.match(regExp)
  return match ? match[1] : null
}

export default function ChapterMusicPlayer({ musicUrl }: ChapterMusicPlayerProps) {
  const videoId = musicUrl ? extractYouTubeId(musicUrl) : null
  const playerRef = useRef<any>(null)
  const isReadyRef = useRef(false)
  const hasTriggeredRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Start video playback
  const startPlaying = () => {
    hasTriggeredRef.current = true
    if (playerRef.current && isReadyRef.current) {
      try {
        playerRef.current.unMute()
        playerRef.current.setVolume(75)
        playerRef.current.playVideo()
        setIsPlaying(true)
        setIsMuted(false)
      } catch (err) {
        console.warn('Play video failed:', err)
      }
    }
  }

  // Initialize YouTube IFrame Player
  useEffect(() => {
    if (!videoId) return

    let isMounted = true

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return
      if (playerRef.current) return

      try {
        playerRef.current = new window.YT.Player('yt-bgm-element', {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            disablekb: 1,
            fs: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return
              isReadyRef.current = true
              // If user already scrolled or touched while loading, play immediately
              if (hasTriggeredRef.current) {
                try {
                  event.target.unMute()
                  event.target.setVolume(75)
                  event.target.playVideo()
                  setIsPlaying(true)
                } catch (e) {
                  console.warn(e)
                }
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true)
              } else if (event.data === 2) {
                setIsPlaying(false)
              } else if (event.data === 0) {
                // Loop
                try {
                  event.target.playVideo()
                } catch {}
              }
            },
            onError: (event: any) => {
              console.warn('YouTube BGM Player error:', event.data)
            },
          },
        })
      } catch (err) {
        console.warn('Error creating YT player:', err)
      }
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback()
        createPlayer()
      }

      if (!document.getElementById('yt-iframe-api-script')) {
        const script = document.createElement('script')
        script.id = 'yt-iframe-api-script'
        script.src = 'https://www.youtube.com/iframe_api'
        script.async = true
        document.head.appendChild(script)
      }
    }

    // Scroll & touch listeners to start music automatically
    const handleScrollTrigger = () => {
      if (!hasTriggeredRef.current) {
        startPlaying()
      }
    }

    window.addEventListener('scroll', handleScrollTrigger, { passive: true })
    window.addEventListener('touchmove', handleScrollTrigger, { passive: true })
    window.addEventListener('touchstart', handleScrollTrigger, { passive: true })
    window.addEventListener('pointerdown', handleScrollTrigger, { passive: true })
    window.addEventListener('wheel', handleScrollTrigger, { passive: true })

    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScrollTrigger)
      window.removeEventListener('touchmove', handleScrollTrigger)
      window.removeEventListener('touchstart', handleScrollTrigger)
      window.removeEventListener('pointerdown', handleScrollTrigger)
      window.removeEventListener('wheel', handleScrollTrigger)

      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy()
        } catch {}
        playerRef.current = null
      }
    }
  }, [videoId])

  if (!videoId) return null

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!playerRef.current || !isReadyRef.current) {
      startPlaying()
      return
    }

    if (isPlaying) {
      try {
        playerRef.current.pauseVideo()
        setIsPlaying(false)
      } catch {}
    } else {
      startPlaying()
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!playerRef.current || !isReadyRef.current) return

    if (isMuted) {
      try {
        playerRef.current.unMute()
        setIsMuted(false)
      } catch {}
    } else {
      try {
        playerRef.current.mute()
        setIsMuted(true)
      } catch {}
    }
  }

  return (
    <>
      {/* Active YouTube Container with minimal dimensions so mobile browsers don't suspend playback */}
      <div
        className="fixed bottom-0 right-0 w-8 h-8 pointer-events-none opacity-[0.01] overflow-hidden z-[-1]"
        aria-hidden="true"
      >
        <div id="yt-bgm-element" />
      </div>

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
