'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HelpCircle, ChevronDown, Coins, Crown, ShieldAlert, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'Koin & Langganan',
    question: 'Apa perbedaan Koin Premium dan Paket Langganan VIP?',
    answer: 'Koin Premium digunakan untuk membuka chapter komik pilihan secara fleksibel tanpa batas waktu kedaluwarsa kepemilikan chapter. Sedangkan Paket Langganan VIP (Bulanan/Tahunan) memberikan akses bebas baca ke seluruh judul dan episode VIP selama masa aktif paket berlangganan Anda masih aktif.'
  },
  {
    category: 'Koin & Langganan',
    question: 'Bagaimana cara membeli koin atau langganan VIP di Sang Penjaga?',
    answer: 'Buka menu VIP Langganan di navigasi atas, pilih paket yang Anda inginkan (Bulanan atau Tahunan), lalu klik tombol bayar. Anda akan diarahkan ke gerbang pembayaran aman iPaymu untuk menyelesaikan pembayaran via QRIS (GoPay, OVO, Dana, ShopeePay), Transfer Bank (Virtual Account), atau retail.'
  },
  {
    category: 'Koin & Langganan',
    question: 'Apakah koin yang sudah dibeli memiliki masa kedaluwarsa?',
    answer: 'Koin digital Sang Penjaga tidak memiliki masa kedaluwarsa dan akan tetap tersimpan di saldo akun Anda sampai digunakan untuk membuka episode komik berbayar.'
  },
  {
    category: 'Membaca Komik',
    question: 'Apakah saya bisa membaca komik secara gratis?',
    answer: 'Ya! Seluruh episode pembuka atau teaser bertanda "GRATIS" dapat dibaca secara cuma-cuma tanpa perlu login maupun koin. Hanya episode khusus berlabel "VIP" yang membutuhkan koin atau paket langganan aktif.'
  },
  {
    category: 'Membaca Komik',
    question: 'Di perangkat apa saja saya dapat membaca komik Sang Penjaga?',
    answer: 'Website Sang Penjaga didesain responsif untuk segala perangkat: smartphone (Android & iOS), tablet, laptop, dan komputer desktop tanpa memerlukan instalasi aplikasi tambahan.'
  },
  {
    category: 'Transaksi & Masalah',
    question: 'Saya sudah bayar tapi koin atau VIP belum aktif, apa yang harus dilakukan?',
    answer: 'Biasanya sistem memperbarui status transaksi secara otomatis dalam 1-5 menit. Jika setelah 15 menit status belum berubah, silakan hubungi tim kami melalui menu Kontak Kami atau email ke mrizqi045@gmail.com dengan menyertakan bukti transfer dan ID pesanan Anda.'
  },
  {
    category: 'Transaksi & Masalah',
    question: 'Apakah pembelian koin atau langganan bisa di-refund?',
    answer: 'Produk digital bersifat final setelah diakses. Namun jika terjadi duplikasi pemotongan saldo atau kesalahan teknis sistem kami, Anda berhak mengajukan refund sesuai syarat di Kebijakan Refund.'
  },
  {
    category: 'Akun & Keamanan',
    question: 'Bagaimana jika saya lupa kata sandi akun?',
    answer: 'Anda dapat mengatur ulang kata sandi melalui tautan "Lupa Sandi" di halaman login atau menghubungi tim dukungan teknis kami dengan mengirim verifikasi identitas email terdaftar.'
  }
]

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [selectedCat, setSelectedCat] = useState<string>('Semua')

  const categories = ['Semua', 'Koin & Langganan', 'Membaca Komik', 'Transaksi & Masalah', 'Akun & Keamanan']

  const filteredFaqs = selectedCat === 'Semua' 
    ? faqs 
    : faqs.filter(f => f.category === selectedCat)

  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3 border border-gold/20">
            <HelpCircle className="w-4 h-4" />
            Pusat Bantuan
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-3">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban lengkap seputar pembelian koin premium, aktivasi langganan VIP, cara membaca komik, dan kendala transaksi di Sang Penjaga.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-gold text-dark shadow-md shadow-gold/20'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-dark-border bg-dark-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-zinc-900/50"
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-dark-border/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Need more help card */}
        <div className="mt-12 rounded-2xl border border-dark-border bg-gradient-to-b from-dark-card to-zinc-950 p-6 text-center">
          <MessageCircle className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-white mb-1">
            Belum menemukan solusi atas kendala Anda?
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-5 leading-relaxed">
            Tim layanan pelanggan Sang Penjaga siap mendampingi proses pembelian koin dan akses akun Anda setiap hari.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-dark font-bold text-xs transition-colors"
            >
              Hubungi Pusat Bantuan
            </Link>
            <Link
              href="/refund-policy"
              className="px-5 py-2.5 rounded-xl bg-dark hover:bg-zinc-800 border border-dark-border text-gray-300 text-xs font-medium transition-colors"
            >
              Kebijakan Refund
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
