import Link from 'next/link'
import { ArrowLeft, FileText, Shield, AlertCircle, Coins, Crown } from 'lucide-react'

export const metadata = {
  title: 'Syarat & Ketentuan - Sang Penjaga',
  description: 'Syarat dan Ketentuan penggunaan platform baca komik digital dan transaksi koin Sang Penjaga.',
}

export default function TermsAndConditionsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-4 border border-gold/20">
            <FileText className="w-4 h-4" />
            Dokumen Hukum Resmi
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2">
            Syarat &amp; Ketentuan Layanan
          </h1>
          <p className="text-xs text-gray-400 mb-8">
            Berlaku efektif sejak: 24 Oktober 2026
          </p>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                1. Ketentuan Umum &amp; Penerimaan Layanan
              </h2>
              <p>
                Selamat datang di platform digital resmi <strong>Sang Penjaga</strong> (<span className="text-gold font-mono text-xs">https://sangpenjaga.com</span>). Dengan mengakses, mendaftar akun, membeli koin digital, atau berlangganan layanan VIP kami, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu klausul, mohon untuk tidak melanjutkan penggunaan platform.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">2. Pendaftaran dan Keamanan Akun</h2>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
                <li>Pengguna wajib memberikan informasi identitas berupa alamat email yang valid dan aktif saat melakukan registrasi.</li>
                <li>Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi dan seluruh aktivitas yang terjadi di bawah akun pribadi tersebut.</li>
                <li>Satu akun hanya diperuntukkan bagi penggunaan individu dan dilarang dialihkan, diperjualbelikan, atau dibagikan kepada pihak lain tanpa persetujuan tertulis dari manajemen Sang Penjaga.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-gold" />
                3. Sistem Koin Premium &amp; Langganan VIP
              </h2>
              <p className="mb-2">
                Platform Sang Penjaga menyediakan konten gratis dan konten berbayar berupa karya komik digital premium:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
                <li><strong>Koin Premium:</strong> Merupakan mata uang virtual resmi platform yang dapat dibeli untuk membuka chapter komik pilihan. Koin yang telah berhasil dibeli tidak dapat ditukarkan kembali menjadi uang tunai (fiat money).</li>
                <li><strong>Paket Langganan VIP:</strong> Paket berlangganan berbasis periode waktu (Bulanan / Tahunan) yang memberikan akses tak terbatas ke seluruh episode berbayar selama masa langganan aktif.</li>
                <li>Pembelian koin maupun paket langganan diproses secara instan melalui gerbang pembayaran resmi berizin (Xendit Gateway).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                4. Hak Kekayaan Intelektual &amp; Larangan Pembajakan
              </h2>
              <p className="mb-2">
                Seluruh karya komik, gambar ilustrasi, karakter, logo, nama merek, naskah cerita, dan aset multimedia di platform ini dilindungi oleh Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
                <li>Dilarang keras mengunduh, menangkap layar (screenshot/screen record), menggandakan, mendistribusikan ulang, atau mengunggah ulang (re-upload) konten komik ke situs web, media sosial, atau kanal digital lain tanpa izin resmi tertulis.</li>
                <li>Dilarang menggunakan perangkat lunak otomatis (bot, crawler, spider, scraper) untuk mengambil data dari peladen (server) kami.</li>
                <li>Pelanggaran hak cipta akan ditindaklanjuti melalui jalur hukum pidana dan perdata sesuai peraturan perundang-undangan yang berlaku di Republik Indonesia.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">5. Transaksi dan Gerbang Pembayaran</h2>
              <p>
                Seluruh pembayaran di platform diproses melalui rekanan gerbang pembayaran berlisensi Bank Indonesia (Xendit). Pengguna wajib memastikan nominal dan metode pembayaran yang dipilih (QRIS, Transfer Virtual Account, atau E-Wallet) sesuai dengan instruksi tagihan resmi. Platform tidak bertanggung jawab atas kelalaian pengguna dalam mentransfer ke rekening di luar instruksi sistem kami.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">6. Pembatalan dan Pengembalian Dana</h2>
              <p>
                Kebijakan pengembalian dana atas produk digital diatur secara khusus dan terperinci dalam dokumen <Link href="/refund-policy" className="text-gold underline hover:text-gold-light">Kebijakan Refund</Link> yang merupakan bagian yang tidak terpisahkan dari Syarat dan Ketentuan ini.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">7. Perubahan Ketentuan</h2>
              <p>
                Sang Penjaga berhak sewaktu-waktu memperbarui, memodifikasi, atau menyempurnakan Syarat dan Ketentuan ini. Perubahan akan diumumkan melalui pembaruan tanggal efektif di halaman ini. Penggunaan berkelanjutan atas platform menandakan persetujuan Anda terhadap perubahan tersebut.
              </p>
            </section>

            <section className="pt-4 border-t border-dark-border">
              <h2 className="text-base font-semibold text-white mb-2">8. Hubungi Kami</h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi tim kami melalui email resmi di <a href="mailto:mrizqi045@gmail.com" className="text-gold hover:underline">mrizqi045@gmail.com</a> atau kunjungi halaman <Link href="/contact" className="text-gold hover:underline">Pusat Bantuan &amp; Kontak</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
