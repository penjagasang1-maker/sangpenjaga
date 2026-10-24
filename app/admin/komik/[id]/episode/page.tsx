'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Eye,
  Lock,
  Unlock,
  Music,
} from 'lucide-react'
import { compressImage } from '@/lib/compress'

interface ComicDetail {
  id: number
  title: string
  slug: string
  coverUrl: string | null
}

interface ChapterItem {
  id: number
  chapterNumber: number
  title: string
  isFree: boolean
  price: number
  pageCount: number
  publishedAt: string
  musicUrl?: string | null
}

export default function AdminEpisodePage() {
  const params = useParams()
  const router = useRouter()
  const comicId = params?.id as string

  const [comic, setComic] = useState<ComicDetail | null>(null)
  const [chapters, setChapters] = useState<ChapterItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // New chapter form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [chapterNumber, setChapterNumber] = useState<number>(1)
  const [chapterTitle, setChapterTitle] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState('0')
  const [musicUrl, setMusicUrl] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)

  const fetchComicAndChapters = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/comics/${comicId}/chapters`)
      const data = await res.json()
      if (res.ok) {
        setComic(data.comic)
        setChapters(data.chapters || [])
        setChapterNumber((data.chapters?.length || 0) + 1)
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
    if (comicId) {
      fetchComicAndChapters()
    }
  }, [comicId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setSelectedFiles((prev) => [...prev, ...files])

    // Generate local preview URLs
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmitChapter = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      alert('Pilih minimal 1 gambar lembar komik untuk episode ini!')
      return
    }

    setSubmitting(true)
    setMessage(null)
    setUploadProgress({ current: 0, total: selectedFiles.length })

    try {
      const uploadedPages: { url: string; width?: number; height?: number }[] = []

      // Upload each page sequentially with auto-compression
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: selectedFiles.length })
        const file = selectedFiles[i]

        // 1. Auto compress client-side
        const { file: compressedFile } = await compressImage(file, {
          maxWidth: 1440,
          maxHeight: 2560,
          quality: 0.82,
        })

        // 2. Upload to Cloudinary
        const formData = new FormData()
        formData.append('file', compressedFile)
        formData.append('folder', `sang-penjaga/chapters/${comicId}/${chapterNumber}`)

        const resUpload = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await resUpload.json()
        if (!resUpload.ok || !uploadData.url) {
          throw new Error(uploadData.error || `Gagal mengunggah lembar halaman ${i + 1}`)
        }

        uploadedPages.push({
          url: uploadData.url,
          width: uploadData.width,
          height: uploadData.height,
        })
      }

      // 3. Save Chapter & Pages to DB
      const resSave = await fetch(`/api/comics/${comicId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterNumber,
          title: chapterTitle || `Chapter ${chapterNumber}`,
          isFree,
          price: isFree ? 0 : parseInt(price || '0'),
          musicUrl: musicUrl.trim() || null,
          pageImages: uploadedPages,
        }),
      })

      const saveData = await resSave.json()
      if (!resSave.ok) {
        throw new Error(saveData.error || 'Gagal menyimpan episode ke database')
      }

      setMessage({ type: 'success', text: saveData.message })
      // Reset form
      setShowAddForm(false)
      setSelectedFiles([])
      setPreviews([])
      setChapterTitle('')
      setPrice('0')
      setMusicUrl('')
      fetchComicAndChapters()
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Terjadi kegagalan unggah',
      })
    } finally {
      setSubmitting(false)
      setUploadProgress(null)
    }
  }

  const handleDeleteChapter = async (chapId: number, chapNum: number) => {
    if (!confirm(`Hapus Episode ${chapNum}? Semua lembar halaman episode ini akan ikut dihapus.`)) {
      return
    }

    try {
      const res = await fetch(`/api/comics/${comicId}/chapters?chapterId=${chapId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setChapters((prev) => prev.filter((c) => c.id !== chapId))
        setMessage({ type: 'success', text: `Episode ${chapNum} berhasil dihapus` })
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menghapus episode')
      }
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Gagal menghapus episode',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/admin/komik"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Komik</span>
        </Link>
      </div>

      {/* Comic Header Info Card */}
      {comic && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-dark-border bg-dark-card p-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-14 overflow-hidden rounded-md border border-dark-border bg-dark shrink-0">
              {comic.coverUrl ? (
                <img src={comic.coverUrl} alt={comic.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">
                  No Cover
                </div>
              )}
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-gold tracking-wider">
                Kelola Episode Komik
              </span>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                {comic.title}
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Total {chapters.length} Episode Terbit
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-light shrink-0 shadow-md shadow-gold/10"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form Upload' : 'Upload Episode Baru'}</span>
          </button>
        </div>
      )}

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

      {/* Upload New Episode Form Drawer */}
      {showAddForm && (
        <div className="rounded-xl border border-gold/40 bg-dark-card p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-dark-border pb-4">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-gold" />
              Upload Lembaran Episode Baru
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              File gambar otomatis dikompresi dan di-hosting ke Cloudflare R2 CDN agar cepat dibaca di HP
            </p>
          </div>

          <form onSubmit={handleSubmitChapter} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
                  Nomor Episode / Chapter *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-dark border border-dark-border rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
                  Judul Episode *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Awal Petualangan Sang Penjaga"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full bg-dark border border-dark-border rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Subscription vs Free Access */}
            <div className="p-4 rounded-xl bg-dark border border-dark-border space-y-3">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Ketentuan Akses Pembaca
                </span>
                <span className="text-xs text-gray-400">
                  Pilih apakah episode ini bisa dibaca gratis oleh siapa saja, atau khusus member yang berlangganan (Bulanan / Tahunan)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label
                  onClick={() => setIsFree(true)}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isFree
                      ? 'border-green-500 bg-green-500/10 text-white'
                      : 'border-dark-border bg-dark-card text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="accessType"
                    checked={isFree}
                    onChange={() => setIsFree(true)}
                    className="mt-1 accent-green-500"
                  />
                  <div>
                    <span className="text-sm font-bold block text-green-400">
                      Gratis (Free Preview)
                    </span>
                    <span className="text-xs text-gray-400">
                      Bisa dibaca oleh semua pengunjung & pembaca tanpa perlu berlangganan
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setIsFree(false)}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    !isFree
                      ? 'border-gold bg-gold/10 text-white'
                      : 'border-dark-border bg-dark-card text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="accessType"
                    checked={!isFree}
                    onChange={() => setIsFree(false)}
                    className="mt-1 accent-gold"
                  />
                  <div>
                    <span className="text-sm font-bold block text-gold">
                      Khusus Member VIP (Langganan)
                    </span>
                    <span className="text-xs text-gray-400">
                      Halaman terkunci. Hanya user dengan paket langganan aktif yang dapat membaca
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* YouTube BGM / Music */}
            <div className="p-4 rounded-xl bg-dark border border-dark-border space-y-2">
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                Musik Latar / BGM YouTube (Opsional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-gold focus:outline-none pl-10"
                />
                <Music className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-gray-400">
                Musik akan diputar otomatis saat pembaca pertama kali mengklik atau menggulir (scroll) halaman komik.
              </p>
            </div>

            {/* Multi-page Image Uploader */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                Pilih File Gambar Lembaran Episode (Bisa pilih banyak sekaligus)
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-dark-border hover:border-gold/60 rounded-xl p-8 bg-dark cursor-pointer transition-colors group">
                <FileImage className="w-10 h-10 text-gray-500 group-hover:text-gold transition-colors mb-2" />
                <span className="text-sm font-semibold text-white">
                  Klik untuk Memilih Lembaran Komik
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Format: JPG, PNG, WebP. Urutan nomor lembar akan mengikuti urutan file.
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={submitting}
                />
              </label>
            </div>

            {/* Thumbnail Preview of Selected Pages */}
            {previews.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-300">
                    {previews.length} Lembar Dipilih (Urutan Halaman 1 s/d {previews.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles([])
                      setPreviews([])
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Hapus Semua Lembar
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-72 overflow-y-auto p-3 bg-dark rounded-xl border border-dark-border">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-dark-border bg-dark-card aspect-[2/3]">
                      <img src={src} alt={`Hal ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-black/80 text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                        #{i + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(i)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus lembar ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress indicator during upload */}
            {uploadProgress && (
              <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-gold space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengompres & Mengunggah Lembaran ke Cloudflare R2...
                  </span>
                  <span>
                    Lembar {uploadProgress.current} dari {uploadProgress.total}
                  </span>
                </div>
                <div className="w-full bg-dark h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{
                      width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
                className="px-4 py-2.5 rounded-lg border border-dark-border text-sm font-medium text-gray-300 hover:bg-dark hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || selectedFiles.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-black font-semibold text-sm transition-colors disabled:opacity-50 shadow-md shadow-gold/10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Episode & Lembaran</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chapters Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="mt-3 text-sm text-gray-400">Memuat episode komik...</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16 text-center">
          <FileImage className="w-12 h-12 text-gray-500 opacity-40 mb-3" />
          <h3 className="font-heading text-lg font-semibold text-white">
            Belum ada episode terbit
          </h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            Komik ini belum memiliki episode/chapter. Klik tombol di bawah untuk mengunggah lembaran episode 1.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Episode 1 Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dark-border bg-dark-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border bg-dark/50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-5 py-4">Ep / Chapter</th>
                <th className="px-5 py-4">Judul Episode</th>
                <th className="px-5 py-4">Jumlah Lembar</th>
                <th className="px-5 py-4">Akses Pembaca</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-sm">
              {chapters.map((chap) => (
                <tr key={chap.id} className="hover:bg-dark-hover transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-gold">
                    Episode {chap.chapterNumber}
                  </td>
                  <td className="px-5 py-4 font-medium text-white">
                    {chap.title}
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    <span className="bg-dark px-2.5 py-1 rounded border border-dark-border text-xs font-mono">
                      {chap.pageCount} Halaman
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {chap.isFree ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                        <Unlock className="w-3 h-3" /> Gratis
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 border border-gold/40 px-2.5 py-0.5 text-xs font-semibold text-gold">
                        <Lock className="w-3 h-3" /> Khusus Member VIP
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {comic && (
                        <Link
                          href={`/komik/${comic.slug}/${chap.chapterNumber}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-dark-border bg-dark px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-gold hover:border-gold transition-colors"
                          title="Lihat Tampilan Baca"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview Baca</span>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteChapter(chap.id, chap.chapterNumber)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Hapus Episode"
                      >
                        <Trash2 className="w-4 h-4" />
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
