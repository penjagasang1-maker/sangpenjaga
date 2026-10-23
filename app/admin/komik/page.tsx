'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react'
import Link from 'next/link'

interface ComicItem {
  id: number
  title: string
  slug: string
  synopsis: string | null
  coverUrl: string | null
  genre: string | null
  status: 'ongoing' | 'completed' | 'hiatus'
  viewCount: number
  createdAt: string
}

export default function AdminKomikPage() {
  const [comics, setComics] = useState<ComicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchComics = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/comics?limit=100')
      const data = await res.json()
      if (res.ok) {
        setComics(data.comics || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal memuat data komik' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal terhubung ke server' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComics()
  }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Hapus komik "${title}"? Semua episode dan lembaran komik ini akan ikut terhapus.`)) {
      return
    }

    try {
      setDeletingId(id)
      setMessage(null)

      const res = await fetch(`/api/comics?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.ok) {
        setComics((prev) => prev.filter((c) => c.id !== id))
        setMessage({ type: 'success', text: `Komik "${title}" berhasil dihapus` })
      } else {
        throw new Error(data.error || 'Gagal menghapus komik')
      }
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const filteredComics = comics.filter((c) => {
    const q = search.toLowerCase()
    return c.title.toLowerCase().includes(q) || (c.genre && c.genre.toLowerCase().includes(q))
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Kelola Komik</h1>
          <p className="mt-1 text-sm text-gray-400">
            Daftar serial komik dan manajemen episode/chapter
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchComics}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:border-gold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin/komik/baru"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gold-light shadow-md shadow-gold/10"
          >
            <Plus className="h-4 w-4" />
            Tambah Komik
          </Link>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-lg p-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-bold hover:underline ml-4">
            Tutup
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari judul komik atau genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-dark-border bg-dark-card py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Comics Table / Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="mt-3 text-sm text-gray-400">Memuat data komik...</p>
        </div>
      ) : filteredComics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16 text-center">
          <div className="rounded-full bg-gold/10 p-4">
            <BookOpen className="h-8 w-8 text-gold" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-white">
            {search ? 'Komik tidak ditemukan' : 'Belum ada komik terdaftar'}
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {search
              ? 'Coba kata kunci pencarian yang lain'
              : 'Mulai dengan menambahkan komik pertama'}
          </p>
          {!search && (
            <Link
              href="/admin/komik/baru"
              className="mt-4 rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light"
            >
              Tambah Komik Sekarang
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dark-border bg-dark-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border bg-dark/50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-4">Cover</th>
                <th className="px-5 py-4">Judul Komik</th>
                <th className="px-5 py-4">Slug (URL)</th>
                <th className="px-5 py-4">Genre</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Kelola / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-sm">
              {filteredComics.map((comic) => (
                <tr key={comic.id} className="hover:bg-dark-hover transition-colors">
                  {/* Cover */}
                  <td className="px-5 py-4">
                    <div className="h-18 w-12 overflow-hidden rounded-md border border-dark-border bg-dark shrink-0">
                      {comic.coverUrl ? (
                        <img
                          src={comic.coverUrl}
                          alt={comic.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">
                          No Cover
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-5 py-4">
                    <div className="font-heading font-bold text-white text-base">
                      {comic.title}
                    </div>
                    {comic.synopsis && (
                      <p className="text-xs text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                        {comic.synopsis}
                      </p>
                    )}
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-gray-400 bg-dark px-2 py-1 rounded border border-dark-border">
                      /komik/{comic.slug}
                    </span>
                  </td>

                  {/* Genre */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-gray-300 capitalize bg-dark-card border border-dark-border px-2.5 py-1 rounded-md">
                      {comic.genre || '-'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        comic.status === 'ongoing'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                          : comic.status === 'completed'
                          ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                          : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                      }`}
                    >
                      {comic.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Manage Chapters / Episodes button */}
                      <Link
                        href={`/admin/komik/${comic.id}/episode`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-black transition-colors"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Kelola Episode</span>
                      </Link>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(comic.id, comic.title)}
                        disabled={deletingId === comic.id}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Hapus Komik"
                      >
                        {deletingId === comic.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
