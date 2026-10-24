'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Shield, Coins, AlertOctagon, Lock, CheckCircle2 } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-10 shadow-xl">
          {/* Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-4 border border-gold/20">
            <FileText className="w-4 h-4" />
            Ketentuan Pengguna
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2">
            Syarat dan Ketentuan Layanan Sang Penjaga
          </h1>
          <p className="text-xs text-gray-400 mb-8">
            Terakhir diperbarui: 24 Oktober 2026
          </p>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
            {/* 1. Layanan Digital */}
            <section className="border-b border-dark-border/60 pb-6">
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-heading">
                <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                1. Layanan Digital
              </h2>
              <p className="text-gray-300 mb-3">
                Platform <strong>Sang Penjaga</strong> (<span className="text-gold font-mono text-xs">https://sangpenjaga.com</span>) adalah portal resmi penyedia konten baca komik digital karya kreator Indonesia. Layanan mencakup penyediaan episode komik berformat gambar digital berkualitas tinggi (WebP/HD) yang dapat diakses secara langsung melalui penjelajah web (web browser).
              </p>
              <p className="text-gray-400 text-xs">
                Seluruh karya komik, karakter, ilustrasi, dan cerita di platform ini dilindungi oleh hak cipta. Pengguna hanya diberikan hak akses non-eksklusif untuk membaca secara pribadi dan dilarang mengunduh, menyalin, membagikan, atau menyebarluaskan konten tanpa izin tertulis dari manajemen Sang Penjaga.
              </p>
            </section>

            {/* 2. Pembelian Koin */}
            <section className="border-b border-dark-border/60 pb-6">
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-heading">
                <Coins className="w-4 h-4 text-gold flex-shrink-0" />
                2. Aturan Pembelian Koin Digital
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 pl-1">
                <li>
                  <strong>Fungsi Koin:</strong> Koin digital merupakan mata uang virtual khusus di dalam platform Sang Penjaga yang digunakan oleh pembaca untuk membuka kunci episode komik premium / berbayar.
                </li>
                <li>
                  <strong>Nilai &amp; Penetapan Harga:</strong> Harga paket koin tercantum secara transparan dalam mata uang Rupiah (IDR) pada halaman transaksi dan dapat disesuaikan sewaktu-waktu sesuai kebijakan platform.
                </li>
                <li>
                  <strong>Metode Pembayaran:</strong> Pembelian koin diproses secara otomatis melalui payment gateway berlisensi resmi (iPaymu) dengan metode pembayaran QRIS, Virtual Account bank, dan gerai retail.
                </li>
                <li>
                  <strong>Masa Berlaku Koin:</strong> Saldo koin yang telah dibeli tidak memiliki masa kedaluwarsa dan tetap tersimpan di akun pengguna hingga digunakan.
                </li>
              </ul>
            </section>

            {/* 3. Kebijakan Refund (Tegas: Tidak Dapat Di-refund) */}
            <section className="border-b border-dark-border/60 pb-6">
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-heading">
                <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0" />
                3. Kebijakan Pengembalian Dana (Refund Policy)
              </h2>
              
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-4">
                <p className="text-xs sm:text-sm text-red-200 font-semibold leading-relaxed">
                  PERNYATAAN TEGAS: Mengingat sifat produk yang berupa barang digital instan, seluruh transaksi pembelian Koin Digital bersifat FINAL dan TIDAK DAPAT DI-REFUND (TIDAK DAPAT DIKEMBALIKAN ATAU DITUKARKAN KEMBALI MENJADI UANG TUNAI) dengan alasan apa pun setelah pembayaran berhasil terkonfirmasi.
                </p>
              </div>

              <ul className="list-disc list-inside space-y-2 text-gray-400 text-xs pl-1">
                <li>
                  Koin yang telah masuk ke saldo akun pengguna tidak dapat ditransfer ke akun lain maupun ditarik kembali ke rekening bank pribadi.
                </li>
                <li>
                  Pengguna bertanggung jawab penuh untuk memeriksa jumlah koin dan nominal tagihan sebelum menyelesaikan transaksi pembayaran.
                </li>
                <li>
                  Pengecualian penanganan khusus hanya berlaku apabila terjadi kegagalan teknis murni pada gerbang pembayaran (seperti pemotongan saldo rekening ganda akibat gangguan jaringan gateway) yang dapat dibuktikan dengan nomor transaksi resmi.
                </li>
              </ul>
            </section>

            {/* 4. Keamanan Akun */}
            <section className="border-b border-dark-border/60 pb-6">
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-heading">
                <Lock className="w-4 h-4 text-gold flex-shrink-0" />
                4. Keamanan Akun Pengguna
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 pl-1">
                <li>
                  <strong>Kerahasiaan Kredensial:</strong> Pengguna wajib menjaga kerahasiaan alamat email dan kata sandi (password) akun masing-masing. Segala aktivitas transaksi yang dilakukan melalui akun pengguna dianggap sah dilakukan oleh pemilik akun.
                </li>
                <li>
                  <strong>Larangan Berbagi Akun:</strong> Akun Sang Penjaga bersifat personal. Penyalahgunaan berupa peminjaman atau penjualan akun kepada pihak lain dapat mengakibatkan penangguhan akses akun secara permanen.
                </li>
                <li>
                  <strong>Pemberitahuan Pelanggaran:</strong> Jika pengguna mencurigai adanya akses tidak sah terhadap akun miliknya, pengguna wajib segera menghubungi tim dukungan pelanggan kami untuk dilakukan tindakan pengamanan.
                </li>
              </ul>
            </section>

            {/* Hubungi Kami */}
            <section className="pt-2">
              <h2 className="text-base font-semibold text-white mb-2 font-heading">
                5. Pertanyaan &amp; Informasi Layanan
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Apabila Anda memiliki pertanyaan lebih lanjut seputar Syarat dan Ketentuan ini, silakan hubungi saluran resmi kami di halaman <Link href="/kontak" className="text-gold underline hover:text-gold-light">Hubungi Kami</Link> atau email ke <a href="mailto:mrizqi045@gmail.com" className="text-gold hover:underline">mrizqi045@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
