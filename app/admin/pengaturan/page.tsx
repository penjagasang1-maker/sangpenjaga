'use client'

import { useState } from 'react'
import { Save, Loader2, Upload } from 'lucide-react'

export default function AdminPengaturanPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Sang Penjaga',
    siteDescription: 'Komik web Sang Penjaga - Baca komik online',
    logoUrl: '',
    socialInstagram: '',
    socialTwitter: '',
    socialYoutube: '',
    socialTiktok: '',
  })

  const handleSave = async () => {
    setSaving(true)
    // TODO: Save to DB or config
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Pengaturan Umum</h1>
        <p className="mt-1 text-sm text-gray-400">
          Konfigurasi dasar website
        </p>
      </div>

      <div className="space-y-6">
        {/* Site Info */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-white">Informasi Situs</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Nama Situs</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Deskripsi</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Logo</label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dark-border bg-dark">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="h-full w-full rounded-lg object-contain" />
                  ) : (
                    <span className="font-heading text-xs font-bold text-gold">SP</span>
                  )}
                </div>
                <label className="cursor-pointer rounded-lg border border-dark-border px-4 py-2 text-sm text-gray-300 hover:bg-dark-hover">
                  <Upload className="mr-1 inline-block h-4 w-4" />
                  Upload Logo
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-white">Social Media</h2>
          <div className="space-y-4">
            {[
              { key: 'socialInstagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
              { key: 'socialTwitter', label: 'Twitter / X', placeholder: 'https://x.com/...' },
              { key: 'socialYoutube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
              { key: 'socialTiktok', label: 'TikTok', placeholder: 'https://tiktok.com/...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
                <input
                  type="url"
                  value={(settings as any)[key]}
                  onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Pengaturan
        </button>
      </div>
    </div>
  )
}
