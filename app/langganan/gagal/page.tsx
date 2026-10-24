'use client'

import Link from 'next/link'
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LanggananGagalPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            Pembayaran Belum Berhasil
          </h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Transaksi belum diselesaikan atau waktu pembayaran telah kedaluwarsa. Anda dapat mencoba kembali kapan saja.
          </p>

          <div className="space-y-3">
            <Link
              href="/langganan"
              className="w-full py-3 px-4 rounded-xl bg-gold hover:bg-gold-light text-dark font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Link>
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-dark hover:bg-zinc-800 text-gray-300 font-medium text-sm flex items-center justify-center border border-dark-border transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
