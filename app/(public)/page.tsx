import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import HeroBanner from '@/components/home/HeroBanner'
import ComicSection from '@/components/home/ComicSection'
import { db } from '@/lib/db'
import { banners, comics } from '@/lib/schema'
import { getSiteSettings, defaultSettings } from '@/lib/settings'
import { desc, eq, asc } from 'drizzle-orm'

export const revalidate = 30

export default async function HomePage() {
  let heroSlides: { id: number; imageUrl: string; linkUrl?: string }[] = []
  let latestComics: any[] = []
  let popularComics: any[] = []
  let settings = defaultSettings

  try {
    const [siteSettingsData, bannerRows, latestRows, popularRows] = await Promise.all([
      getSiteSettings(),
      db
        .select({
          id: banners.id,
          imageUrl: banners.imageUrl,
          linkUrl: banners.linkUrl,
        })
        .from(banners)
        .where(eq(banners.isActive, true))
        .orderBy(asc(banners.sortOrder)),
      db
        .select()
        .from(comics)
        .orderBy(desc(comics.createdAt))
        .limit(8),
      db
        .select()
        .from(comics)
        .orderBy(desc(comics.viewCount))
        .limit(8),
    ])

    settings = siteSettingsData

    heroSlides = bannerRows.map((b) => ({
      id: b.id,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl || undefined,
    }))
    latestComics = latestRows
    popularComics = popularRows
  } catch (e) {
    console.error('Error fetching homepage data:', e)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-8 pb-16">
      {/* Hero Banner Slider */}
      <HeroBanner slides={heroSlides} />

      {/* Komik Terbaru Section */}
      <ComicSection
        title="Komik Terbaru"
        comics={latestComics}
        showViewAll
        viewAllLink="/komik?sort=latest"
      />

      {/* Komik Populer Section */}
      <ComicSection
        title="Komik Populer"
        comics={popularComics}
        showViewAll
        viewAllLink="/komik?sort=popular"
      />

      {/* About Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-gradient-to-br from-dark-card to-dark border border-dark-border p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-6">
                <span className="text-white">{settings.logoPrefix} </span>
                <span className="text-red-600">{settings.logoSuffix}</span>
              </h2>

              <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                {settings.aboutParagraph1 && <p>{settings.aboutParagraph1}</p>}
                {settings.aboutParagraph2 && <p>{settings.aboutParagraph2}</p>}
                {settings.aboutHighlight && (
                  <p className="text-gold font-medium italic">
                    {settings.aboutHighlight}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/komik"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black font-heading font-semibold text-sm sm:text-base px-6 py-3 rounded-lg transition-colors shadow-lg shadow-gold/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mulai Membaca</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
