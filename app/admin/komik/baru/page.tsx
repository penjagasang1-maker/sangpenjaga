'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { compressImage } from '@/lib/compress'

export default function TambahKomikPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    synopsis: '',
    genre: '',
    status: 'ongoing',
    coverUrl: '',
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }))
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)

    try {
      // Auto-compress cover image
      const { file: compressedFile } = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 1200,
        quality: 0.85,
      })

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('folder', 'sang-penjaga/covers')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setForm(prev => ({ ...prev, coverUrl: data.url }))
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/comics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/komik')
      } else {
        alert(data.error || 'Gagal menyimpan komik')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/komik"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white">
          Tambah Komik Baru
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cover Upload */}
        <div className="lg:col-span-1">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Cover Komik
          </label>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-dashed border-dark-border bg-dark-card transition-colors hover:border-gold/50">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-500">
                <Upload className="mb-2 h-8 w-8" />
                <span className="text-sm">Upload Cover</span>
                <span className="mt-1 text-xs">JPG, PNG (3:4)</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 lg:col-span-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Judul Komik
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Masukkan judul komik"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Slug (URL)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
              required
              className="w-full rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="slug-komik"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Sinopsis
            </label>
            <textarea
              value={form.synopsis}
              onChange={(e) => setForm(prev => ({ ...prev, synopsis: e.target.value }))}
              rows={5}
              className="w-full rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="Tulis sinopsis komik..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Genre
              </label>
              <select
                value={form.genre}
                onChange={(e) => setForm(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="">Pilih Genre</option>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="fantasy">Fantasy</option>
                <option value="horror">Horror</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="slice-of-life">Slice of Life</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-gold-light disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Komik
            </button>
            <Link
              href="/admin/komik"
              className="rounded-lg border border-dark-border px-6 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-dark-hover hover:text-white"
            >
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
