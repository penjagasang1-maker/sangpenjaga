'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Share2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

export default function AdminPengaturanPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [form, setForm] = useState({
    siteName: 'Sang Penjaga',
    logoPrefix: 'SANG',
    logoSuffix: 'PENJAGA',
    footerDescription: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    socialInstagram: '',
    socialTwitter: '',
    socialYoutube: '',
    socialTiktok: '',
    copyrightText: '',
    aboutTitle: '',
    aboutParagraph1: '',
    aboutParagraph2: '',
    aboutHighlight: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/settings')
        const data = await res.json()
        if (data?.settings) {
          setForm({
            siteName: data.settings.siteName || '',
            logoPrefix: data.settings.logoPrefix || 'SANG',
            logoSuffix: data.settings.logoSuffix || 'PENJAGA',
            footerDescription: data.settings.footerDescription || '',
            contactEmail: data.settings.contactEmail || '',
            contactPhone: data.settings.contactPhone || '',
            contactAddress: data.settings.contactAddress || '',
            socialInstagram: data.settings.socialInstagram || '',
            socialTwitter: data.settings.socialTwitter || '',
            socialYoutube: data.settings.socialYoutube || '',
            socialTiktok: data.settings.socialTiktok || '',
            copyrightText: data.settings.copyrightText || '',
            aboutTitle: data.settings.aboutTitle || '',
            aboutParagraph1: data.settings.aboutParagraph1 || '',
            aboutParagraph2: data.settings.aboutParagraph2 || '',
            aboutHighlight: data.settings.aboutHighlight || '',
          })
        }
      } catch {
        setMessage({ type: 'error', text: 'Gagal memuat pengaturan tersimpan' })
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan pengaturan')
      }

      setMessage({
        type: 'success',
        text: 'Pengaturan berhasil disimpan! Halaman beranda dan footer otomatis diperbarui.',
      })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl pb-16">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Pengaturan Umum</h1>
          <p className="mt-1 text-sm text-gray-400">
            Kelola teks beranda, identitas website, kontak, dan link media sosial tanpa perlu coding
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm ${
            message.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identitas & Logo */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-lg font-semibold text-white">
              Identitas Website &amp; Logo Teks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Nama Situs (Title Tab)
              </label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="Sang Penjaga"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Logo Kata 1 (Putih)
                </label>
                <input
                  type="text"
                  value={form.logoPrefix}
                  onChange={(e) => handleChange('logoPrefix', e.target.value)}
                  placeholder="SANG"
                  className="w-full rounded-lg border border-dark-border bg-dark px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Logo Kata 2 (Merah)
                </label>
                <input
                  type="text"
                  value={form.logoSuffix}
                  onChange={(e) => handleChange('logoSuffix', e.target.value)}
                  placeholder="PENJAGA"
                  className="w-full rounded-lg border border-dark-border bg-dark px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Preview Logo */}
            <div className="sm:col-span-2 rounded-lg bg-dark p-3 border border-dark-border flex items-center justify-between">
              <span className="text-xs text-gray-400">Pratinjau Logo Teks:</span>
              <div className="font-heading font-extrabold text-lg tracking-wider">
                <span className="text-white">{form.logoPrefix || 'SANG'} </span>
                <span className="text-red-600">{form.logoSuffix || 'PENJAGA'}</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Deskripsi Footer Website
              </label>
              <textarea
                rows={2}
                value={form.footerDescription}
                onChange={(e) => handleChange('footerDescription', e.target.value)}
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Teks Hak Cipta (Pojok Bawah Footer)
              </label>
              <input
                type="text"
                value={form.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                placeholder="© 2026 Sang Penjaga. Mond Bhasinato"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cerita / Tentang di Beranda */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-lg font-semibold text-white">
              Konten &quot;Tentang Cerita&quot; di Beranda
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Judul Bagian Cerita
              </label>
              <input
                type="text"
                value={form.aboutTitle}
                onChange={(e) => handleChange('aboutTitle', e.target.value)}
                placeholder="SANG PENJAGA"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Paragraf Pertama (Pengantar Mitos/Legenda)
              </label>
              <textarea
                rows={3}
                value={form.aboutParagraph1}
                onChange={(e) => handleChange('aboutParagraph1', e.target.value)}
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Paragraf Kedua (Kisah Para Kesatria)
              </label>
              <textarea
                rows={3}
                value={form.aboutParagraph2}
                onChange={(e) => handleChange('aboutParagraph2', e.target.value)}
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Kalimat Sorotan (Teks Miring / Italic Warna Emas)
              </label>
              <input
                type="text"
                value={form.aboutHighlight}
                onChange={(e) => handleChange('aboutHighlight', e.target.value)}
                placeholder="Terinspirasi dari kekayaan mitos, legenda, dan kisah mistis Nusantara."
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Kontak Kami */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-lg font-semibold text-white">
              Kontak Kami (Muncul di Footer)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Alamat Email Resmi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="mrizqi045@gmail.com"
                  className="w-full rounded-lg border border-dark-border bg-dark py-2 pl-9 pr-3 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Nomor Telepon / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="087880503974"
                  className="w-full rounded-lg border border-dark-border bg-dark py-2 pl-9 pr-3 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Alamat Kantor / Operasional
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <textarea
                  rows={2}
                  value={form.contactAddress}
                  onChange={(e) => handleChange('contactAddress', e.target.value)}
                  placeholder="Cipinang melayu, 13620"
                  className="w-full rounded-lg border border-dark-border bg-dark py-2 pl-9 pr-3 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Social Media */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-lg font-semibold text-white">
              Tautan Media Sosial (Ikon di Footer)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.socialInstagram}
                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                placeholder="https://instagram.com/sangpenjaga"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={form.socialTwitter}
                onChange={(e) => handleChange('socialTwitter', e.target.value)}
                placeholder="https://x.com/sangpenjaga"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                YouTube URL
              </label>
              <input
                type="url"
                value={form.socialYoutube}
                onChange={(e) => handleChange('socialYoutube', e.target.value)}
                placeholder="https://youtube.com/@sangpenjaga"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-300">
                TikTok URL
              </label>
              <input
                type="url"
                value={form.socialTiktok}
                onChange={(e) => handleChange('socialTiktok', e.target.value)}
                placeholder="https://tiktok.com/@sangpenjaga"
                className="w-full rounded-lg border border-dark-border bg-dark px-3.5 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-dark transition-colors hover:bg-gold-light disabled:opacity-50 shadow-lg shadow-gold/20"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  )
}
