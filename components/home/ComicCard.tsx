import Link from 'next/link'
import Image from 'next/image'

export interface Comic {
  id: number | string
  title: string
  slug: string
  coverUrl: string
  genre: string
  status: 'ongoing' | 'completed' | 'hiatus' | string
}

interface ComicCardProps extends Comic {}

export default function ComicCard({
  title,
  slug,
  coverUrl,
  genre,
  status,
}: ComicCardProps) {
  const getStatusBadge = (statusStr: string) => {
    const s = statusStr.toLowerCase()
    if (s === 'ongoing' || s === 'berjalan') {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Berjalan
        </span>
      )
    }
    if (s === 'completed' || s === 'tamat') {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
          Tamat
        </span>
      )
    }
    return (
      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
        Hiatus
      </span>
    )
  }

  return (
    <Link
      href={`/komik/${slug}`}
      className="group flex flex-col focus:outline-none"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-dark-card border border-dark-border group-hover:border-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300">
        <Image
          src={coverUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges on Cover */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
          <span className="bg-gold text-black font-semibold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow">
            {genre}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 z-10">
          {getStatusBadge(status)}
        </div>

        {/* Subtle bottom gradient on cover */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Comic Title */}
      <div className="mt-2.5">
        <h3 className="font-heading font-semibold text-sm sm:text-base text-white group-hover:text-gold transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </Link>
  )
}
