'use client'

import { useState } from 'react'
import { Save, Key, AlertTriangle, Loader2, Plus, Trash2 } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export default function PengaturanPembayaranPage() {
  const [saving, setSaving] = useState(false)
  const [midtransConfig, setMidtransConfig] = useState({
    isProduction: false,
    serverKey: '',
    clientKey: '',
  })

  const [plans, setPlans] = useState([
    { id: 1, name: 'Per Chapter', price: 3000, durationDays: 0, isActive: true },
    { id: 2, name: 'Bulanan', price: 25000, durationDays: 30, isActive: true },
    { id: 3, name: 'Tahunan', price: 250000, durationDays: 365, isActive: true },
  ])

  const addPlan = () => {
    setPlans(prev => [...prev, {
      id: Date.now(),
      name: '',
      price: 0,
      durationDays: 30,
      isActive: true,
    }])
  }

  const removePlan = (id: number) => {
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: Save to DB
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Pengaturan Pembayaran</h1>
        <p className="mt-1 text-sm text-gray-400">
          Konfigurasi Midtrans dan paket langganan
        </p>
      </div>

      {/* Midtrans Config */}
      <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-gold" />
          <h2 className="font-heading text-lg font-semibold text-white">
            Konfigurasi Midtrans
          </h2>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
          <p className="text-xs text-yellow-300">
            API keys disimpan di environment variables server. Jangan expose di client.
            Ubah di Cloudflare Pages dashboard &gt; Settings &gt; Environment Variables.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={midtransConfig.isProduction}
                onChange={(e) => setMidtransConfig(prev => ({ ...prev, isProduction: e.target.checked }))}
                className="h-4 w-4 rounded border-dark-border accent-gold"
              />
              <span className="text-sm text-gray-300">Production Mode</span>
            </label>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              midtransConfig.isProduction
                ? 'bg-green-500/10 text-green-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {midtransConfig.isProduction ? 'LIVE' : 'SANDBOX'}
            </span>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Server Key</label>
            <input
              type="password"
              value={midtransConfig.serverKey}
              onChange={(e) => setMidtransConfig(prev => ({ ...prev, serverKey: e.target.value }))}
              placeholder="SB-Mid-server-xxxxx"
              className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Client Key</label>
            <input
              type="password"
              value={midtransConfig.clientKey}
              onChange={(e) => setMidtransConfig(prev => ({ ...prev, clientKey: e.target.value }))}
              placeholder="SB-Mid-client-xxxxx"
              className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">
            Paket Langganan
          </h2>
          <button
            onClick={addPlan}
            className="inline-flex items-center gap-1 rounded-lg bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20"
          >
            <Plus className="h-3 w-3" />
            Tambah Paket
          </button>
        </div>

        <div className="space-y-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className="flex flex-col gap-3 rounded-lg border border-dark-border bg-dark p-4 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={plan.name}
                onChange={(e) => {
                  const updated = [...plans]
                  updated[idx].name = e.target.value
                  setPlans(updated)
                }}
                placeholder="Nama paket"
                className="flex-1 rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Rp</span>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => {
                    const updated = [...plans]
                    updated[idx].price = parseInt(e.target.value) || 0
                    setPlans(updated)
                  }}
                  className="w-28 rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={plan.durationDays}
                  onChange={(e) => {
                    const updated = [...plans]
                    updated[idx].durationDays = parseInt(e.target.value) || 0
                    setPlans(updated)
                  }}
                  className="w-20 rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
                />
                <span className="text-sm text-gray-400">hari</span>
              </div>
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="checkbox"
                  checked={plan.isActive}
                  onChange={(e) => {
                    const updated = [...plans]
                    updated[idx].isActive = e.target.checked
                    setPlans(updated)
                  }}
                  className="h-4 w-4 rounded border-dark-border accent-gold"
                />
                <span className="text-xs text-gray-400">Aktif</span>
              </label>
              <button
                onClick={() => removePlan(plan.id)}
                className="rounded p-1 text-gray-400 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-gold-light disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Simpan Pengaturan
      </button>
    </div>
  )
}
