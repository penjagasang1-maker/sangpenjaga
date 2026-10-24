'use client'

import Link from 'next/link'
import { CheckCircle2, BookOpen, Crown } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LanggananSuksesPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5" />
            VIP Member Aktif
          </div>

          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            Pembayaran Berhasil!
          </h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Selamat, akun Anda telah berhasil ditingkatkan menjadi VIP Member Sang Penjaga. Sekarang Anda dapat membaca seluruh episode tanpa terkunci.
          </p>

          <div className="space-y-3">
            <Link
              href="/komik"
              className="w-full py-3 px-4 rounded-xl bg-gold hover:bg-gold-light text-dark font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Mulai Membaca Komik
            </Link>
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-dark hover:bg-zinc-800 text-gray-300 font-medium text-sm flex items-center justify-center border border-dark-border transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
