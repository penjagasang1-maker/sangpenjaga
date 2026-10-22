'use client'

import { useState } from 'react'
import { Search, Image, Trash2, Plus, GripVertical, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'sang-penjaga/banners')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        // TODO: Save banner to DB
        setBanners(prev => [...prev, {
          id: Date.now(),
          imageUrl: data.url,
          linkUrl: '',
          sortOrder: prev.length,
          isActive: true,
        }])
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Kelola Banner</h1>
          <p className="mt-1 text-sm text-gray-400">
            Upload dan atur banner hero di homepage
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-gold-light">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Upload Banner
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <p className="mb-4 text-sm text-gray-400">
        Ukuran rekomendasi: 1455 x 650 px (rasio ~2.2:1). Banner akan ditampilkan fullwidth di homepage.
      </p>

      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <div className="rounded-full bg-gold/10 p-4">
            <Image className="h-8 w-8 text-gold" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-white">
            Belum ada banner
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Upload banner untuk ditampilkan di homepage
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className="flex items-center gap-4 rounded-xl border border-dark-border bg-dark-card p-4"
            >
              <GripVertical className="h-5 w-5 cursor-grab text-gray-500" />
              <div className="h-20 w-36 overflow-hidden rounded-lg bg-dark-border">
                <img
                  src={banner.imageUrl}
                  alt={`Banner ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={banner.linkUrl}
                  onChange={(e) => {
                    const updated = [...banners]
                    updated[idx].linkUrl = e.target.value
                    setBanners(updated)
                  }}
                  placeholder="Link URL (opsional)"
                  className="w-full rounded-lg border border-dark-border bg-dark px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={banner.isActive}
                  onChange={(e) => {
                    const updated = [...banners]
                    updated[idx].isActive = e.target.checked
                    setBanners(updated)
                  }}
                  className="h-4 w-4 rounded border-dark-border accent-gold"
                />
                <span className="text-xs text-gray-400">Aktif</span>
              </label>
              <button
                onClick={() => setBanners(prev => prev.filter(b => b.id !== banner.id))}
                className="rounded p-1 text-gray-400 hover:bg-dark-hover hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
