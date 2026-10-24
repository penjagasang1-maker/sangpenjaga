'use client'

import React, { useState } from 'react'
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
  ExternalLink,
} from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Pertanyaan Pembelian Koin',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
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
            Layanan Pengguna
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-3">
            Hubungi Kami
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Tim layanan pelanggan resmi Sang Penjaga siap membantu kendala akses komik digital, konfirmasi pembayaran koin, dan pertanyaan akun Anda.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Email */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-6 flex flex-col justify-between hover:border-gold/50 transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block">Email Resmi</span>
              <p className="text-sm font-bold text-white mt-1 break-all">
                mrizqi045@gmail.com
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Respon maksimal 1x24 jam kerja.
              </p>
            </div>
            <a
              href="mailto:mrizqi045@gmail.com"
              className="mt-5 text-xs font-bold text-gold hover:underline inline-flex items-center gap-1.5"
            >
              Kirim Pesan Email &rarr;
            </a>
          </div>

          {/* WhatsApp */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-6 flex flex-col justify-between hover:border-green-500/50 transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block">WhatsApp Bantuan</span>
              <p className="text-sm font-bold text-white mt-1">
                087880503974
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Respon cepat chat langsung via WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/6287880503974"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 text-xs font-bold text-green-400 hover:underline inline-flex items-center gap-1.5"
            >
              Chat WhatsApp <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Alamat Operasional */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-6 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block">Alamat Operasional</span>
              <p className="text-sm font-bold text-white mt-1 leading-snug">
                Cipinang Melayu, Jakarta Timur, 13620, Indonesia
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Setiap Hari 09.00 - 21.00 WIB
              </p>
            </div>
            <span className="mt-5 text-xs text-gray-400 font-medium">
              Operasional &amp; Distribusi
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8">
          <h2 className="text-lg font-heading font-bold text-white mb-2">
            Kirimkan Formulir Pengaduan
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Lengkapi formulir di bawah ini untuk bantuan konfirmasi koin atau pertanyaan seputar baca komik.
          </p>

          {submitted ? (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-base text-white mb-1">
                Pesan Berhasil Dikirim!
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Terima kasih telah menghubungi Sang Penjaga. Tim dukungan kami akan meninjau pesan Anda dan membalas melalui email secepatnya.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-dark border border-dark-border text-xs text-gray-300 hover:text-white"
              >
                Kirim Pesan Baru
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
                    Email Pengguna
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
                  Topik Pertanyaan
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-dark-border bg-dark px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-gold focus:outline-none"
                >
                  <option value="Pertanyaan Pembelian Koin">Pertanyaan Pembelian Koin</option>
                  <option value="Kendala Aktivasi VIP / Pembayaran">Kendala Aktivasi VIP / Pembayaran</option>
                  <option value="Kendala Membaca Episode Komik">Kendala Membaca Episode Komik</option>
                  <option value="Pertanyaan Akun & Sandi">Pertanyaan Akun &amp; Sandi</option>
                  <option value="Kerja Sama Kreator Komik">Kerja Sama Kreator Komik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Detail Pesan / Pengaduan
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan nomor referensi transaksi (jika ada), judul komik, atau pertanyaan Anda..."
                  className="w-full rounded-xl border border-dark-border bg-dark px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-dark font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-gold/20"
              >
                <Send className="w-4 h-4" />
                Kirimkan Pesan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
