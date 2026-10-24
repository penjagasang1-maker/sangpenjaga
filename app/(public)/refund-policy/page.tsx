import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Coins, RefreshCw } from 'lucide-react'

export const metadata = {
  title: 'Kebijakan Refund - Sang Penjaga',
  description: 'Kebijakan pengembalian dana untuk layanan penjualan koin premium dan langganan digital Sang Penjaga.',
}

export default function RefundPolicyPage() {
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
            <ShieldCheck className="w-4 h-4" />
            Transparansi &amp; Jaminan Layanan
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2">
            Kebijakan Pengembalian Dana (Refund Policy)
          </h1>
          <p className="text-xs text-gray-400 mb-8">
            Berlaku efektif sejak: 24 Oktober 2026
          </p>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-white mb-2">1. Ketentuan Umum Produk Digital</h2>
              <p>
                Layanan pada platform Sang Penjaga (<span className="text-gold font-mono text-xs">https://sang-penjaga.pages.dev</span>) mencakup konten digital berupa <strong>Koin Premium</strong> dan <strong>Paket Langganan VIP Member</strong>. Sesuai sifat alami produk digital yang langsung dapat diakses seketika setelah pembayaran terkonfirmasi, pada prinsipnya seluruh transaksi bersifat final dan tidak dapat dibatalkan secara sepihak.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-gold" />
                2. Kebijakan Refund Koin Premium &amp; Langganan VIP
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
                <li><strong>Koin Belum Digunakan:</strong> Permohonan refund atas pembelian saldo koin hanya dapat dipertimbangkan jika seluruh koin dalam paket transaksi terkait sama sekali belum pernah digunakan untuk membuka chapter komik.</li>
                <li><strong>Koin yang Sudah Digunakan:</strong> Koin yang telah terpakai untuk membuka akses chapter komik tidak dapat dikembalikan dalam bentuk apa pun.</li>
                <li><strong>Langganan VIP:</strong> Pengembalian dana untuk paket langganan VIP (Bulanan / Tahunan) hanya berlaku jika terjadi kegagalan sistem aktivasi dari pihak platform dan tidak dapat dipulihkan dalam batas waktu wajar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-gold" />
                3. Kondisi Khusus yang Memenuhi Syarat Refund
              </h2>
              <p className="mb-2">
                Pengguna berhak menerima pengembalian dana 100% (penuh) dalam kondisi berikut:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
                <li><strong>Duplikasi Pembayaran:</strong> Terjadi pemotongan ganda atau lebih untuk satu nomor tagihan / invoice yang sama akibat gangguan jaringan gateway.</li>
                <li><strong>Kegagalan Pengiriman Produk:</strong> Saldo koin atau status VIP tidak bertambah di akun pengguna dalam 1x24 jam setelah pembayaran dinyatakan berhasil oleh Xendit dan tim teknis tidak dapat mengaktifkannya secara manual.</li>
                <li><strong>Gangguan Teknis Permanen:</strong> Platform mengalami kendala teknis fatal yang menyebabkan konten yang telah dibeli tidak dapat diakses sama sekali selama lebih dari 7 (tujuh) hari berturut-turut.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">4. Batas Waktu &amp; Prosedur Klaim</h2>
              <p className="mb-2">
                Pengajuan pengembalian dana wajib disampaikan paling lambat <strong>7 (tujuh) hari kalender</strong> sejak waktu transaksi tercatat. Langkah pengajuan:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-400 pl-2">
                <li>Hubungi layanan pelanggan kami melalui email <a href="mailto:mrizqi045@gmail.com" className="text-gold hover:underline">mrizqi045@gmail.com</a> atau WhatsApp di <strong>087880503974</strong>.</li>
                <li>Sertakan bukti transaksi resmi (Invoice ID Xendit / Bukti Notifikasi Bank).</li>
                <li>Sertakan alamat email akun Sang Penjaga Anda dan penjelasan singkat kendala yang terjadi.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">5. Metode Pengembalian Dana</h2>
              <p>
                Setelah tim verifikasi menyetujui permohonan refund, pengembalian dana akan diproses kembali ke metode pembayaran asal pengguna (rekening bank asal, akun e-wallet, atau mekanisme void invoice) dalam waktu 3 hingga 14 hari kerja bank.
              </p>
            </section>

            {/* Official Contact Info Box */}
            <section className="pt-4 border-t border-dark-border">
              <h2 className="text-base font-semibold text-white mb-3">6. Saluran Bantuan Resmi</h2>
              <p className="mb-4 text-gray-400 text-xs">
                Untuk pertanyaan atau pendampingan pengajuan refund, hubungi kontak resmi kami:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark p-4 rounded-xl border border-dark-border">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Email Dukungan</span>
                    <a href="mailto:mrizqi045@gmail.com" className="text-xs text-white hover:text-gold transition-colors break-all">
                      mrizqi045@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Telepon / WhatsApp</span>
                    <a href="tel:087880503974" className="text-xs text-white hover:text-gold transition-colors">
                      087880503974
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Alamat Operasional</span>
                    <span className="text-xs text-white">
                      Cipinang melayu, 13620
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
