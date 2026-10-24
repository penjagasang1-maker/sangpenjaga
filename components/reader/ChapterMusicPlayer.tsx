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

function isDirectAudioFile(url: string): boolean {
  if (!url) return false
  const clean = url.toLowerCase().split('?')[0]
  return (
    clean.endsWith('.mp3') ||
    clean.endsWith('.wav') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.m4a') ||
    clean.endsWith('.aac') ||
    url.includes('/music/') ||
    url.includes('audio')
  )
}

export default function ChapterMusicPlayer({ musicUrl }: ChapterMusicPlayerProps) {
  const isAudio = musicUrl ? isDirectAudioFile(musicUrl) : false
  const videoId = !isAudio && musicUrl ? extractYouTubeId(musicUrl) : null

  const audioRef = useRef<HTMLAudioElement>(null)
  const playerRef = useRef<any>(null)
  const isReadyRef = useRef(false)
  const isPlayingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Sync ref with state
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // --- Engine 1: Native HTML5 Audio (Direct MP3 / WAV / OGG) ---
  useEffect(() => {
    if (!isAudio || !musicUrl) return

    const audio = audioRef.current
    if (!audio) return

    const handleAutoPlay = () => {
      if (isPlayingRef.current) return
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsMuted(false)
        })
        .catch(() => {
          // Browser may require another gesture
        })
    }

    window.addEventListener('scroll', handleAutoPlay, { passive: true })
    window.addEventListener('touchstart', handleAutoPlay, { passive: true })
    window.addEventListener('touchmove', handleAutoPlay, { passive: true })
    window.addEventListener('pointerdown', handleAutoPlay, { passive: true })
    window.addEventListener('click', handleAutoPlay, { passive: true })
    window.addEventListener('wheel', handleAutoPlay, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleAutoPlay)
      window.removeEventListener('touchstart', handleAutoPlay)
      window.removeEventListener('touchmove', handleAutoPlay)
      window.removeEventListener('pointerdown', handleAutoPlay)
      window.removeEventListener('click', handleAutoPlay)
      window.removeEventListener('wheel', handleAutoPlay)
      audio.pause()
    }
  }, [isAudio, musicUrl])

  // --- Engine 2: YouTube IFrame API (Muted Autoplay + Scroll Unmute) ---
  useEffect(() => {
    if (isAudio || !videoId) return

    let isMounted = true

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return
      if (playerRef.current) return

      try {
        playerRef.current = new window.YT.Player('yt-bgm-element', {
          videoId,
          playerVars: {
            autoplay: 1, // Start autoplaying muted immediately
            mute: 1,     // Mobile browsers allow autoplay when muted!
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
              try {
                event.target.playVideo()
              } catch {}
            },
            onStateChange: (event: any) => {
              if (!isMounted) return
              // 1 = PLAYING
              if (event.data === 1) {
                // If audio is unmuted and volume > 0, consider it active
                setIsPlaying(true)
              } else if (event.data === 2) {
                setIsPlaying(false)
              } else if (event.data === 0) {
                try {
                  event.target.playVideo()
                } catch {}
              }
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

    // Scroll & touch listener to UNMUTE and ensure playback with sound
    const handleUnmuteOnScroll = () => {
      if (playerRef.current && isReadyRef.current) {
        try {
          playerRef.current.unMute()
          playerRef.current.setVolume(75)
          playerRef.current.playVideo()
          setIsPlaying(true)
          setIsMuted(false)
        } catch {}
      }
    }

    window.addEventListener('scroll', handleUnmuteOnScroll, { passive: true })
    window.addEventListener('touchstart', handleUnmuteOnScroll, { passive: true })
    window.addEventListener('touchmove', handleUnmuteOnScroll, { passive: true })
    window.addEventListener('pointerdown', handleUnmuteOnScroll, { passive: true })
    window.addEventListener('wheel', handleUnmuteOnScroll, { passive: true })
    window.addEventListener('click', handleUnmuteOnScroll, { passive: true })

    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleUnmuteOnScroll)
      window.removeEventListener('touchstart', handleUnmuteOnScroll)
      window.removeEventListener('touchmove', handleUnmuteOnScroll)
      window.removeEventListener('pointerdown', handleUnmuteOnScroll)
      window.removeEventListener('wheel', handleUnmuteOnScroll)
      window.removeEventListener('click', handleUnmuteOnScroll)

      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy()
        } catch {}
        playerRef.current = null
      }
    }
  }, [isAudio, videoId])

  if (!isAudio && !videoId) return null

  // Universal Toggle Play / Pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      }
      return
    }

    if (playerRef.current && isReadyRef.current) {
      if (isPlaying) {
        try {
          playerRef.current.pauseVideo()
          setIsPlaying(false)
        } catch {}
      } else {
        try {
          playerRef.current.unMute()
          playerRef.current.setVolume(75)
          playerRef.current.playVideo()
          setIsPlaying(true)
          setIsMuted(false)
        } catch {}
      }
    }
  }

  // Universal Toggle Mute / Unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isAudio && audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      return
    }

    if (playerRef.current && isReadyRef.current) {
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
  }

  return (
    <>
      {/* Engine 1: Native HTML5 Audio */}
      {isAudio && musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
          playsInline
        />
      )}

      {/* Engine 2: YouTube Container with safe active dimensions for mobile browser permission */}
      {!isAudio && videoId && (
        <div
          className="fixed bottom-2 right-2 w-12 h-12 opacity-[0.01] overflow-hidden pointer-events-auto z-10"
          aria-hidden="true"
        >
          <div id="yt-bgm-element" />
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
