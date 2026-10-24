'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Kendala Pembelian Koin / VIP',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate inquiry submission
    setSubmitted(true)
  }

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-3 border border-gold/20">
            <MessageSquare className="w-4 h-4" />
            Layanan Pelanggan Resmi
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-3">
            Pusat Bantuan &amp; Kontak Kami
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan mengenai saldo koin premium, paket langganan VIP, atau mengalami kendala saat membaca komik? Tim dukungan Sang Penjaga siap membantu Anda.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Email */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">Email Bantuan</span>
              <p className="text-sm font-semibold text-white mt-1 break-all">
                mrizqi045@gmail.com
              </p>
            </div>
            <a
              href="mailto:mrizqi045@gmail.com"
              className="mt-4 text-xs font-semibold text-gold hover:underline inline-flex items-center gap-1"
            >
              Kirim Email &rarr;
            </a>
          </div>

          {/* Telepon */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">Telepon / WhatsApp</span>
              <p className="text-sm font-semibold text-white mt-1">
                087880503974
              </p>
            </div>
            <a
              href="https://wa.me/6287880503974"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-semibold text-green-400 hover:underline inline-flex items-center gap-1"
            >
              Chat WhatsApp &rarr;
            </a>
          </div>

          {/* Alamat */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">Alamat Kantor</span>
              <p className="text-sm font-semibold text-white mt-1">
                Cipinang melayu, 13620
              </p>
            </div>
            <span className="mt-4 text-xs text-gray-500">Jakarta Timur, Indonesia</span>
          </div>

          {/* Jam Kerja */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">Jam Operasional</span>
              <p className="text-sm font-semibold text-white mt-1">
                09.00 - 21.00 WIB
              </p>
            </div>
            <span className="mt-4 text-xs text-gray-500">Setiap Hari (Senin - Minggu)</span>
          </div>
        </div>

        {/* Contact Form & Side Help */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8">
            <h2 className="text-lg font-heading font-bold text-white mb-2">
              Kirim Tiket Bantuan
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Isi formulir di bawah ini jika transaksi koin atau langganan VIP Anda memerlukan konfirmasi manual.
            </p>

            {submitted ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-base text-white mb-1">
                  Pesan Anda Telah Terkirim!
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Terima kasih telah menghubungi kami. Tim layanan pelanggan Sang Penjaga akan meninjau kendala Anda dan membalas melalui email maksimal 1x24 jam kerja.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-dark border border-dark-border text-xs text-gray-300 hover:text-white"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full rounded-xl border border-dark-border bg-dark px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Email Akun
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@anda.com"
                      className="w-full rounded-xl border border-dark-border bg-dark px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Kategori Kendala
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-dark-border bg-dark px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-gold focus:outline-none"
                  >
                    <option value="Kendala Pembelian Koin / VIP">Kendala Pembelian Koin / VIP</option>
                    <option value="Koin Belum Masuk Setelah Bayar">Koin Belum Masuk Setelah Bayar</option>
                    <option value="Episode Komik Terkunci Padahal Sudah Beli">Episode Komik Terkunci Padahal Sudah Beli</option>
                    <option value="Permohonan Refund Transaksi">Permohonan Refund Transaksi</option>
                    <option value="Masalah Akun / Login">Masalah Akun / Login</option>
                    <option value="Kerja Sama Kreator / Lisensi">Kerja Sama Kreator / Lisensi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Deskripsi Kendala / Pesan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan nomor referensi / transaksi iPaymu (jika ada), judul komik, dan rincian kendala..."
                    className="w-full rounded-xl border border-dark-border bg-dark px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-dark font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-gold/20"
                >
                  <Send className="w-4 h-4" />
                  Kirim Pengaduan
                </button>
              </form>
            )}
          </div>

          {/* Quick Links Card */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-dark-border bg-dark-card p-6">
              <h3 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold" />
                Cek FAQ Terlebih Dahulu
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Jawaban instan untuk kendala umum pembelian koin dan cara membuka chapter komik dapat dilihat di halaman Tanya Jawab.
              </p>
              <Link
                href="/faq"
                className="block text-center py-2 px-3 rounded-xl bg-dark hover:bg-zinc-800 border border-dark-border text-gold font-semibold text-xs transition-colors"
              >
                Buka Halaman FAQ &rarr;
              </Link>
            </div>

            <div className="rounded-2xl border border-dark-border bg-dark-card p-6">
              <h3 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                Syarat &amp; Kebijakan
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Pelajari hak pengguna dan prosedur klaim pengembalian dana transaksi koin.
              </p>
              <div className="space-y-2">
                <Link
                  href="/terms-and-conditions"
                  className="block text-xs text-gray-300 hover:text-gold transition-colors"
                >
                  &bull; Syarat &amp; Ketentuan Layanan
                </Link>
                <Link
                  href="/refund-policy"
                  className="block text-xs text-gray-300 hover:text-gold transition-colors"
                >
                  &bull; Kebijakan Refund Resmi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
