'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!token) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mb-4 border border-red-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Tautan Tidak Valid</h2>
        <p className="text-sm text-gray-400 mb-6">
          Tautan reset kata sandi tidak ditemukan atau formatnya salah.
        </p>
        <Link
          href="/lupa-password"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          Minta Tautan Baru
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Kata sandi harus terdiri dari minimal 6 karakter.')
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsSuccess(true)
      } else {
        setError(data.error || 'Gagal mengatur ulang kata sandi.')
      }
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-heading text-white mb-2">
          Kata Sandi Berhasil Diperbarui!
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Kata sandi baru Anda telah aktif. Silakan masuk kembali ke akun Anda.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-gold hover:bg-gold-light text-black font-heading font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-md shadow-gold/20"
        >
          Masuk ke Akun
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-sm text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">{error}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
        >
          Kata Sandi Baru
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full bg-dark border border-dark-border rounded-lg pl-4 pr-11 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-1"
            aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
        >
          Konfirmasi Kata Sandi Baru
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            className="w-full bg-dark border border-dark-border rounded-lg pl-4 pr-11 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-1"
            aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 bg-gold hover:bg-gold-light text-black font-heading font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gold/10"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Menyimpan Sandi...</span>
          </>
        ) : (
          <span>Simpan Kata Sandi Baru</span>
        )}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Halaman Masuk
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Link
            href="/"
            className="font-heading font-extrabold text-2xl sm:text-3xl text-gold tracking-wider inline-block mb-2"
          >
            SANG PENJAGA
          </Link>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-3 border border-gold/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Buat Kata Sandi Baru
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Masukkan kata sandi baru untuk akun Anda
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
