'use client'

import { useState } from 'react'
import { Plus, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminKomikPage() {
  const [search, setSearch] = useState('')

  // TODO: Fetch comics from API
  const comics: any[] = []

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Kelola Komik</h1>
          <p className="mt-1 text-sm text-gray-400">
            Tambah, edit, dan kelola komik
          </p>
        </div>
        <Link
          href="/admin/komik/baru"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-gold-light"
        >
          <Plus className="h-4 w-4" />
          Tambah Komik
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari komik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      {/* Comics Table */}
      {comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <div className="rounded-full bg-gold/10 p-4">
            <Plus className="h-8 w-8 text-gold" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-white">
            Belum ada komik
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Mulai dengan menambahkan komik pertama
          </p>
          <Link
            href="/admin/komik/baru"
            className="mt-4 rounded-lg bg-gold px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-gold-light"
          >
            Tambah Komik
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dark-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-card">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Cover</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Genre</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Views</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {comics.map((comic: any) => (
                <tr key={comic.id} className="border-b border-dark-border hover:bg-dark-hover">
                  <td className="px-4 py-3">
                    <div className="h-16 w-12 overflow-hidden rounded bg-dark-border">
                      {comic.coverUrl && (
                        <img src={comic.coverUrl} alt={comic.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{comic.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{comic.genre}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      comic.status === 'ongoing' ? 'bg-green-500/10 text-green-400' :
                      comic.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {comic.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{comic.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/komik/${comic.id}`}
                        className="rounded p-1 text-gray-400 hover:bg-dark-hover hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button className="rounded p-1 text-gray-400 hover:bg-dark-hover hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
