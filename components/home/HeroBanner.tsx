'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/pagination'

export interface BannerSlide {
  id: number
  imageUrl: string
  linkUrl?: string
  title?: string
}

interface HeroBannerProps {
  slides?: BannerSlide[]
}

export default function HeroBanner({ slides = [] }: HeroBannerProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Empty placeholder fallback
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-52 sm:h-[400px] lg:h-[550px] xl:h-[650px] bg-dark-card border-b border-dark-border flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent z-10" />
        <div className="relative z-20 text-center px-4 max-w-2xl">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-gold uppercase bg-gold/10 border border-gold/30 rounded-full">
            Komik Resmi
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide mb-3">
            SANG <span className="text-red-600">PENJAGA</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
            Petualangan aksi dan misteri sang pelindung kota. Nantikan rilisan episode terbaru segera!
          </p>
        </div>
      </div>
    )
  }

  const currentDisplay = String(activeIndex + 1).padStart(2, '0')
  const totalDisplay = String(slides.length).padStart(2, '0')

  return (
    <div className="relative w-full h-52 sm:h-[400px] lg:h-[550px] xl:h-[650px] overflow-hidden group select-none">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        pagination={{
          type: 'progressbar',
          el: '.hero-progress-bar',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={slides.length > 1}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-swiper w-full h-full"
      >
        {slides.map((slide) => {
          const content = (
            <div className="relative w-full h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.title || `Slide ${slide.id}`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Dark overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-dark/40" />

              {slide.title && (
                <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-12 z-20 max-w-xl">
                  <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white drop-shadow-md">
                    {slide.title}
                  </h2>
                </div>
              )}
            </div>
          )

          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {slide.linkUrl ? (
                <Link href={slide.linkUrl} className="block w-full h-full">
                  {content}
                </Link>
              ) : (
                content
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Gold Progress Bar at bottom */}
      <div className="hero-progress-bar absolute bottom-0 left-0 right-0 z-30 h-1 bg-dark-border" />

      {/* Navigation Controls bottom-right */}
      <div className="absolute bottom-6 right-4 sm:right-10 z-30 flex items-center gap-3 bg-dark/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-dark-border">
        {/* Slide Counter */}
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-gray-300">
          <span className="text-gold font-bold">{currentDisplay}</span>
          <span className="text-gray-500 mx-1">/</span>
          {totalDisplay}
        </span>

        <div className="h-4 w-px bg-dark-border mx-1" />

        {/* Arrow Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            className="p-1 rounded text-gray-300 hover:text-gold hover:bg-white/5 transition-colors"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            className="p-1 rounded text-gray-300 hover:text-gold hover:bg-white/5 transition-colors"
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
