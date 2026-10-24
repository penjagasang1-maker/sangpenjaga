'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  KeyRound,
  Mail,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // WhatsApp Admin number
  const adminWhatsApp = '6287880503974'

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!email.trim()) {
      setError('Silakan masukkan email akun Anda.')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/lupa-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage(data.message)
      } else {
        setError(data.error || 'Gagal mengirim email reset kata sandi.')
      }
    } catch {
      setError('Terjadi gangguan jaringan. Silakan coba lagi atau hubungi via WhatsApp.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppRedirect = () => {
    const encodedMsg = encodeURIComponent(
      `Halo Admin Sang Penjaga, saya lupa kata sandi akun saya.\n\nEmail akun: ${email.trim() || '[Belum diisi]'}\nMohon bantuannya untuk reset kata sandi. Terima kasih!`
    )
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodedMsg}`, '_blank')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back to Login */}
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Halaman Masuk
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="font-heading font-extrabold text-2xl sm:text-3xl text-gold tracking-wider inline-block mb-2"
          >
            SANG PENJAGA
          </Link>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-3 border border-gold/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Lupa Kata Sandi?
          </h1>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
            Masukkan alamat email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-sm text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
            <div>
              <p className="font-semibold text-white mb-1">Tautan Terkirim!</p>
              <p className="text-xs text-emerald-300 leading-relaxed">{message}</p>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
            >
              Email Akun
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gold hover:bg-gold-light text-black font-heading font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gold/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirim Email...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Kirim Tautan Reset ke Email</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border" />
          </div>
          <span className="relative bg-dark-card px-3 text-xs text-gray-500 uppercase tracking-wider">
            atau bantuan cepat
          </span>
        </div>

        {/* WhatsApp Option */}
        <button
          type="button"
          onClick={handleWhatsAppRedirect}
          className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-heading font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Hubungi Admin via WhatsApp</span>
        </button>

        {/* Security Note */}
        <div className="mt-5 p-3 rounded-lg bg-gold/5 border border-gold/15 flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
          <span>Data akun dan privasi Anda terenkripsi dengan aman.</span>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Sudah ingat kata sandi Anda?{' '}
          <Link
            href="/login"
            className="text-gold hover:text-gold-light font-medium transition-colors hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
