import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Kebijakan Refund - Sang Penjaga',
  description: 'Kebijakan pengembalian dana untuk layanan langganan digital Sang Penjaga.',
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
            Transparansi Layanan
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2">
            Kebijakan Pengembalian Dana (Refund Policy)
          </h1>
          <p className="text-xs text-gray-400 mb-8">
            Terakhir diperbarui: 24 Oktober 2026
          </p>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-white mb-2">1. Ketentuan Umum</h2>
              <p>
                Layanan pada platform Sang Penjaga (https://sang-penjaga.pages.dev) merupakan produk digital berbasis langganan (VIP Member) yang dapat langsung diakses secara instan setelah pembayaran terkonfirmasi.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">2. Kondisi yang Memenuhi Syarat Refund</h2>
              <p className="mb-2">
                Pengembalian dana (refund) dapat diajukan dalam kondisi-kondisi khusus berikut:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                <li>Terjadi duplikasi penagihan (terpotong dua kali untuk transaksi yang sama).</li>
                <li>Pembayaran telah berhasil terpotong namun status VIP tidak aktif setelah 1x24 jam dan tim bantuan tidak dapat menyelesaikannya secara teknis.</li>
                <li>Gangguan sistem menyeluruh yang menyebabkan seluruh layanan tidak dapat diakses selama lebih dari 7 hari berturut-turut.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">3. Prosedur Pengajuan Refund</h2>
              <p className="mb-2">
                Untuk mengajukan pengembalian dana, pengguna wajib menghubungi kontak resmi kami dalam waktu maksimal 7 (tujuh) hari kerja kalender sejak tanggal transaksi dengan melampirkan:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                <li>Bukti pembayaran resmi (Invoice Xendit / Bukti Transfer / Notifikasi Bank).</li>
                <li>Alamat email akun Sang Penjaga yang terdaftar.</li>
                <li>Deskripsi kendala yang dialami.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">4. Metode dan Waktu Pengembalian</h2>
              <p>
                Setelah pengajuan disetujui, dana akan dikembalikan ke rekening atau instrumen pembayaran asal pengguna dalam waktu 3 hingga 14 hari kerja, tergantung kebijakan bank atau penyedia gerbang pembayaran (Xendit).
              </p>
            </section>

            <section className="pt-4 border-t border-dark-border">
              <h2 className="text-base font-semibold text-white mb-3">5. Kontak Resmi Layanan Pelanggan</h2>
              <p className="mb-4 text-gray-400 text-xs">
                Hubungi kami melalui saluran resmi berikut untuk bantuan atau pertanyaan seputar transaksi dan refund:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark p-4 rounded-xl border border-dark-border">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Email</span>
                    <a href="mailto:mrizqi045@gmail.com" className="text-xs text-white hover:text-gold transition-colors break-all">
                      mrizqi045@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Telepon</span>
                    <a href="tel:087880503974" className="text-xs text-white hover:text-gold transition-colors">
                      087880503974
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Alamat</span>
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
