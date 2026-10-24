'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  KeyRound,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // WhatsApp Admin number (consistent with site contacts)
  const adminWhatsApp = '6287880503974'

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const encodedMsg = encodeURIComponent(
      `Halo Admin Sang Penjaga, saya lupa kata sandi akun saya.\n\nEmail akun: ${email.trim() || '[Belum diisi]'}\nMohon bantuannya untuk reset kata sandi sementara. Terima kasih!`
    )
    const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMsg}`
    window.open(waUrl, '_blank')
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
            Ketik alamat email Anda di bawah untuk mendapatkan bantuan reset kata sandi langsung dari Admin kami.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
            >
              Email Akun Anda
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
            className="w-full mt-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-heading font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-[#25D366]/20"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Hubungi Admin via WhatsApp</span>
          </button>
        </form>

        {submitted && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              WhatsApp telah dibuka! Kirim pesan tersebut ke Admin, dan Admin akan memberikan kata sandi baru untuk akun Anda.
            </p>
          </div>
        )}

        {/* Step Guide */}
        <div className="mt-6 pt-6 border-t border-dark-border">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-gold" />
            Cara Kerja Pemulihan Akun
          </h4>
          <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              Masukkan email Anda dan klik tombol WhatsApp.
            </li>
            <li>
              Kirim pesan verifikasi otomatis yang telah disiapkan ke Admin.
            </li>
            <li>
              Admin akan mereset kata sandi sementara untuk akun Anda.
            </li>
            <li>
              Masuk dengan kata sandi sementara, lalu ganti dengan sandi baru di menu profil.
            </li>
          </ol>
        </div>

        {/* Security Note */}
        <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/15 flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
          <span>Privasi dan data akun Anda dijamin aman.</span>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Ingat kata sandi Anda?{' '}
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
