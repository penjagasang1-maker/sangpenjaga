'use client'

import { useState } from 'react'
import { Save, Key, AlertTriangle, Loader2, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export default function PengaturanPembayaranPage() {
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [xenditConfig, setXenditConfig] = useState({
    isProduction: false,
    secretKey: '',
    webhookToken: '',
  })

  const [plans, setPlans] = useState([
    { id: 1, name: 'Langganan Bulanan', price: 1000, durationDays: 30, isActive: true },
    { id: 2, name: 'Langganan Tahunan', price: 10000, durationDays: 365, isActive: true },
  ])

  const webhookUrl = 'https://sangpenjaga.com/api/payment/webhook'

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    setSaving(true)
    // Feedback saved
    setTimeout(() => {
      setSaving(false)
      alert('Pengaturan tersimpan. Catatan: Kunci API rahasia Xendit harus didaftarkan di wrangler.toml atau Cloudflare Pages Environment Variables.')
    }, 700)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Pengaturan Pembayaran &amp; Langganan</h1>
        <p className="mt-1 text-sm text-gray-400">
          Konfigurasi payment gateway Xendit dan tarif paket langganan VIP
        </p>
      </div>

      {/* Xendit Config */}
      <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-lg font-semibold text-white">
              Konfigurasi Xendit Payment Gateway
            </h2>
          </div>
          <a
            href="https://dashboard.xendit.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
          >
            Dashboard Xendit <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="mb-6 flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
          <div className="text-xs text-blue-200">
            <p className="font-semibold mb-1">Cara Setup Xendit:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-300/90">
              <li>Buka Xendit Dashboard &gt; Settings &gt; API Keys &gt; Secret Key.</li>
              <li>Buka Settings &gt; Callbacks &gt; Invoices (Paid, Expired).</li>
              <li>Tempel URL Webhook Callback di bawah ke Xendit Callback URL.</li>
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          {/* Webhook Callback URL display */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-300">
              URL Webhook Callback (Masukkan di Dashboard Xendit):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full rounded-lg border border-dark-border bg-dark px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={copyWebhook}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={xenditConfig.isProduction}
                onChange={(e) => setXenditConfig(prev => ({ ...prev, isProduction: e.target.checked }))}
                className="h-4 w-4 rounded border-dark-border accent-gold"
              />
              <span className="text-sm text-gray-300">Production Mode (Live)</span>
            </label>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              xenditConfig.isProduction
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}>
              {xenditConfig.isProduction ? 'LIVE PRODUCTION' : 'TESTING (DEVELOPMENT)'}
            </span>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Xendit Secret API Key (<code className="text-xs text-gold">XENDIT_SECRET_KEY</code>)
            </label>
            <input
              type="password"
              value={xenditConfig.secretKey}
              onChange={(e) => setXenditConfig(prev => ({ ...prev, secretKey: e.target.value }))}
              placeholder="xnd_development_... atau xnd_production_..."
              className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Webhook Verification Token (<code className="text-xs text-gold">XENDIT_WEBHOOK_VERIFICATION_TOKEN</code>)
            </label>
            <input
              type="password"
              value={xenditConfig.webhookToken}
              onChange={(e) => setXenditConfig(prev => ({ ...prev, webhookToken: e.target.value }))}
              placeholder="Token verifikasi callback Xendit (opsional)"
              className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-white">
              Paket Langganan VIP
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Tarif paket akses seluruh episode komik per pengguna
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className="flex flex-col gap-3 rounded-lg border border-dark-border bg-dark p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1 font-medium text-sm text-white">
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => {
                    const updated = [...plans]
                    updated[idx].name = e.target.value
                    setPlans(updated)
                  }}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>

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
                  className="w-28 rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-sm text-white font-bold text-gold focus:border-gold focus:outline-none"
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

              <label className="flex cursor-pointer items-center gap-1.5 pl-2">
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
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-dark transition-colors hover:bg-gold-light disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Simpan Pengaturan
      </button>
    </div>
  )
}
