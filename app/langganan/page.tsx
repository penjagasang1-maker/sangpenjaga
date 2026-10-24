'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, Check, Zap, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface UserStatus {
  user: {
    id: string
    email: string
    username: string
    role: string
  } | null
  isVip?: boolean
  vipExpiresAt?: string
}

export default function LanggananPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<number>(1) // 1 = Bulanan, 2 = Tahunan
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setUserStatus(data)
      } catch (err) {
        setUserStatus(null)
      } finally {
        setCheckingUser(false)
      }
    }
    checkAuth()
  }, [])

  const handleCheckout = async (planId: number) => {
    if (!userStatus?.user) {
      router.push(`/login?redirect=/langganan`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Gagal memulai transaksi. Pastikan kunci pembayaran telah dikonfigurasi.')
        setLoading(false)
        return
      }

      if (data.invoiceUrl) {
        // Redirect directly to Xendit secure checkout
        window.location.href = data.invoiceUrl
      } else {
        alert('URL pembayaran tidak ditemukan.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      alert('Terjadi kesalahan koneksi saat memulai pembayaran.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
            <Crown className="w-4 h-4 text-gold" />
            VIP Member Sang Penjaga
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Buka Seluruh Episode Komik <span className="text-gold">Tanpa Batas</span>
          </h1>
          <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
            Dukung kreator Sang Penjaga dan nikmati akses penuh seluruh chapter VIP, kualitas HD tanpa watermark, dan rilis episode lebih awal.
          </p>

          {userStatus?.user && (
            <div className="mt-4 inline-block bg-dark-card border border-dark-border px-4 py-2 rounded-lg text-xs text-gray-300">
              Masuk sebagai: <span className="text-gold font-semibold">{userStatus.user.username}</span> ({userStatus.user.email})
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Paket Bulanan */}
          <div 
            onClick={() => setSelectedPlan(1)}
            className={`relative rounded-2xl bg-dark-card border p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
              selectedPlan === 1 
                ? 'border-gold shadow-lg shadow-gold/10 ring-1 ring-gold' 
                : 'border-dark-border hover:border-gray-700'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold tracking-wide uppercase text-gray-400">Paket Reguler</span>
                <span className="text-xs bg-dark px-2.5 py-1 rounded-full text-gray-400 border border-dark-border">30 Hari</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Langganan Bulanan</h2>
              <p className="text-xs text-gray-400 mb-6">Pilihan fleksibel untuk membaca setiap bulan.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xs text-gray-400 font-semibold">Rp</span>
                <span className="text-4xl font-extrabold text-white font-heading">1.000</span>
                <span className="text-xs text-gray-400">/ bulan</span>
              </div>

              <div className="border-t border-dark-border pt-6 space-y-3 mb-8">
                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Akses semua episode VIP komik Sang Penjaga</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Kualitas gambar WebP HD jernih tanpa batas</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Baca di web browser HP, tablet, maupun PC</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Masa aktif 30 hari penuh</span>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation()
                handleCheckout(1)
              }}
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                selectedPlan === 1
                  ? 'bg-gold hover:bg-gold-light text-dark shadow-md shadow-gold/20'
                  : 'bg-dark hover:bg-zinc-800 text-white border border-dark-border'
              }`}
            >
              {loading && selectedPlan === 1 ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Pilih Bulanan <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Paket Tahunan */}
          <div 
            onClick={() => setSelectedPlan(2)}
            className={`relative rounded-2xl bg-dark-card border p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
              selectedPlan === 2 
                ? 'border-gold shadow-lg shadow-gold/20 ring-2 ring-gold' 
                : 'border-dark-border hover:border-gray-700'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-dark font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-dark" />
              Paling Hemat
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold tracking-wide uppercase text-gold">Paket Spesial</span>
                <span className="text-xs bg-gold/10 px-2.5 py-1 rounded-full text-gold border border-gold/30">365 Hari</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Langganan Tahunan</h2>
              <p className="text-xs text-gray-400 mb-6">Hemat dan bebas repot perpanjangan selama 1 tahun.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xs text-gray-400 font-semibold">Rp</span>
                <span className="text-4xl font-extrabold text-gold font-heading">10.000</span>
                <span className="text-xs text-gray-400">/ tahun</span>
              </div>

              <div className="border-t border-dark-border pt-6 space-y-3 mb-8">
                <div className="flex items-start gap-3 text-xs text-white font-medium">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Semua fitur paket Bulanan</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-white font-medium">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Hemat 2 bulan biaya langganan</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-white font-medium">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Prioritas akses episode baru saat pertama rilis</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-white font-medium">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Masa aktif 365 hari penuh</span>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation()
                handleCheckout(2)
              }}
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-gold hover:bg-gold-light text-dark shadow-lg shadow-gold/25"
            >
              {loading && selectedPlan === 2 ? (
                <Loader2 className="w-4 h-4 animate-spin text-dark" />
              ) : (
                <>
                  Pilih Tahunan <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security & Payment Methods */}
        <div className="mt-16 text-center max-w-xl mx-auto border-t border-dark-border pt-8">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-3">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            Pembayaran Aman Didukung oleh <span className="text-white font-semibold">iPaymu Gateway</span>
          </div>
          <p className="text-[11px] text-gray-500">
            Mendukung QRIS (GoPay, OVO, Dana, ShopeePay), Transfer Bank Virtual Account (BCA, BRI, BNI, Mandiri), dan gerai retail.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
