'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Shield,
  BookOpen,
  Crown,
  CheckCircle2,
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // State when admin/superadmin logs in to choose destination
  const [adminChoice, setAdminChoice] = useState<{
    role: 'admin' | 'superadmin'
  } | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (adminChoice) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
      } else {
        // Auto-redirect to admin when countdown hits 0
        window.location.href = redirectParam || '/admin'
      }
    }
    return () => clearTimeout(timer)
  }, [adminChoice, countdown, redirectParam, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.')
      }

      // Check if user is admin or superadmin
      if (data.role === 'admin' || data.role === 'superadmin') {
        if (redirectParam) {
          window.location.href = redirectParam
        } else {
          setAdminChoice({ role: data.role })
        }
      } else {
        window.location.href = redirectParam || '/'
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back to Home Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl">
        {adminChoice ? (
          /* Choice screen for Admin & Superadmin */
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 text-gold mx-auto">
              {adminChoice.role === 'superadmin' ? (
                <Crown className="w-7 h-7 text-amber-400" />
              ) : (
                <Shield className="w-7 h-7 text-gold" />
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-gold/15 text-gold border border-gold/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Login Berhasil: {adminChoice.role === 'superadmin' ? 'Superadmin' : 'Admin'}
              </div>
              <h2 className="text-xl font-bold font-heading text-white">
                Pilih Ruang Masuk
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Otomatis masuk ke Admin Dashboard dalam{' '}
                <span className="font-bold text-gold">{countdown} detik</span>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: Admin Dashboard */}
              <button
                onClick={() => {
                  router.push('/admin')
                  router.refresh()
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gold bg-gold/10 hover:bg-gold/20 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gold text-black group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">
                      Dashboard Admin
                    </h3>
                    <p className="text-xs text-gray-400">
                      Kelola komik, banner, pengguna, dan data
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gold bg-dark px-2.5 py-1 rounded-md border border-gold/30">
                  Utama
                </span>
              </button>

              {/* Option 2: Reader View */}
              <button
                onClick={() => {
                  router.push('/')
                  router.refresh()
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-dark-border bg-dark hover:border-gold/50 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border text-gray-300 group-hover:text-gold transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-white">
                      Halaman Pembaca (User)
                    </h3>
                    <p className="text-xs text-gray-400">
                      Jelajahi dan baca komik seperti pengunjung
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Login Form */
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <Link
                href="/"
                className="font-heading font-extrabold text-2xl sm:text-3xl text-gold tracking-wider inline-block mb-2"
              >
                SANG PENJAGA
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Masuk ke Akun
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Lanjutkan membaca komik favorit Anda
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-sm text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Kata Sandi
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gold hover:bg-gold-light text-black font-heading font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gold/10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk</span>
                )}
              </button>
            </form>

            {/* Register Footer */}
            <div className="mt-6 pt-6 border-t border-dark-border text-center text-sm text-gray-400">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-gold font-medium hover:underline hover:text-gold-light transition-colors"
              >
                Daftar sekarang
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
