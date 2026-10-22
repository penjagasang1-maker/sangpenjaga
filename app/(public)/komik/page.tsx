import Link from 'next/link'
import { Search, Filter } from 'lucide-react'

// TODO: Fetch from DB
const comics: any[] = []

export default function KomikPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Semua Komik
        </h1>
        <p className="mt-2 text-gray-400">
          Jelajahi koleksi komik Sang Penjaga
        </p>
      </div>

      {/* Filters - TODO: make client component for interactivity */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Cari judul komik..."
            className="w-full rounded-lg border border-dark-border bg-dark-card py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border border-dark-border bg-dark-card px-4 py-3 text-sm text-white focus:border-gold focus:outline-none">
            <option value="">Semua Genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="fantasy">Fantasy</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
          </select>
          <select className="rounded-lg border border-dark-border bg-dark-card px-4 py-3 text-sm text-white focus:border-gold focus:outline-none">
            <option value="">Semua Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="hiatus">Hiatus</option>
          </select>
        </div>
      </div>

      {/* Comics Grid */}
      {comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-gold/10 p-6">
            <Search className="h-10 w-10 text-gold" />
          </div>
          <h3 className="mt-4 font-heading text-xl font-semibold text-white">
            Belum ada komik
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Komik akan segera hadir. Nantikan!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {comics.map((comic: any) => (
            <Link
              key={comic.id}
              href={`/komik/${comic.slug}`}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-dark-border transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-lg group-hover:shadow-gold/10">
                {comic.coverUrl ? (
                  <img
                    src={comic.coverUrl}
                    alt={comic.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-dark-card">
                    <span className="font-heading text-2xl font-bold text-gold/30">SP</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  {comic.genre && (
                    <span className="mb-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-gold">
                      {comic.genre}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-gold">
                {comic.title}
              </h3>
              <span className={`text-xs ${
                comic.status === 'ongoing' ? 'text-green-400' :
                comic.status === 'completed' ? 'text-blue-400' :
                'text-yellow-400'
              }`}>
                {comic.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
