import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ComicCard, { Comic } from './ComicCard'

interface ComicSectionProps {
  title: string
  comics?: Comic[]
  showViewAll?: boolean
  viewAllLink?: string
}

export default function ComicSection({
  title,
  comics = [],
  showViewAll = false,
  viewAllLink = '/komik',
}: ComicSectionProps) {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-7 bg-gold rounded-full" />
            <h2 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight">
              {title}
            </h2>
          </div>

          {showViewAll && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center text-sm font-medium text-gold hover:text-gold-light transition-colors group"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Content Grid or Empty Placeholder */}
        {comics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {comics.map((comic) => (
              <ComicCard key={comic.id} {...comic} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-dark-border bg-dark-card/50 p-8 sm:p-12 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Belum ada komik yang tersedia pada bagian ini.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
