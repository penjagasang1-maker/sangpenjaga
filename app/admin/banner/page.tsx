'use client'

import { useState, useEffect } from 'react'
import {
  Image as ImageIcon,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

import { compressImage } from '@/lib/compress'

interface BannerItem {
  id: number
  imageUrl: string
  linkUrl: string | null
  sortOrder: number
  isActive: boolean
}

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/banners')
      const data = await res.json()
      if (res.ok) {
        setBanners(data.banners || [])
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat data banner' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      // 1. Auto-compress client-side before sending to Cloudinary
      const { file: compressedFile, originalSize, compressedSize, savedPercent } = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 900,
        quality: 0.82,
      })

      // 2. Upload to Cloudinary via /api/upload
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('folder', 'sang-penjaga/banners')

      const resUpload = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await resUpload.json()

      if (!resUpload.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Gagal mengunggah gambar ke Cloudinary')
      }

      // 3. Save banner record to DB via /api/banners
      const resSave = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          linkUrl: '',
          sortOrder: banners.length,
        }),
      })

      const saveData = await resSave.json()

      if (!resSave.ok) {
        throw new Error(saveData.error || 'Gagal menyimpan data banner')
      }

      const infoSaved = savedPercent > 0 ? ` (Dikompres hemat ${savedPercent}%: ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB)` : ''
      setMessage({ type: 'success', text: `Banner berhasil diunggah${infoSaved}!` })
      fetchBanners()
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Gagal memproses banner',
      })
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return

    try {
      setDeletingId(id)
      setMessage(null)

      const res = await fetch(`/api/banners?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id))
        setMessage({ type: 'success', text: 'Banner berhasil dihapus' })
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menghapus banner')
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Kelola Banner</h1>
          <p className="mt-1 text-sm text-gray-400">
            Upload dan atur banner hero slider di halaman depan
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {uploading ? 'Mengunggah...' : 'Upload Banner Baru'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <p className="text-xs text-gray-400 bg-dark-card border border-dark-border p-3 rounded-lg">
        Rekomendasi rasio banner: <span className="text-gold font-medium">1455 x 650 px</span>. Gambar otomatis dikompresi dan di-hosting ke Cloudflare R2 CDN.
      </p>

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

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="mt-3 text-sm text-gray-400">Memuat daftar banner...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <div className="rounded-full bg-gold/10 p-4">
            <ImageIcon className="h-8 w-8 text-gold" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-white">
            Belum ada banner
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Klik tombol &quot;Upload Banner Baru&quot; di atas untuk menambahkan slide hero
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-dark-border bg-dark-card p-4 hover:border-gold/30 transition-colors"
            >
              <div className="h-28 sm:h-20 sm:w-36 overflow-hidden rounded-lg bg-dark border border-dark-border shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={`Banner ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-300 mb-1">
                  Slide {idx + 1}
                </p>
                <p className="text-xs text-gray-500 truncate">{banner.imageUrl}</p>
              </div>

              <button
                onClick={() => handleDelete(banner.id)}
                disabled={deletingId === banner.id}
                className="inline-flex items-center gap-1.5 self-end sm:self-auto rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {deletingId === banner.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span>Hapus</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
