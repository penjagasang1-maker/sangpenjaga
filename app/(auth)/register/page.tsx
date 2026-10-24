'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    if (password.length < 6) {
      setError('Kata sandi harus terdiri dari minimal 6 karakter.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Pendaftaran gagal. Silakan coba kembali.')
      }

      router.push('/login?registered=true')
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

      {/* Register Card */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="font-heading font-extrabold text-2xl sm:text-3xl text-gold tracking-wider inline-block mb-2"
          >
            SANG PENJAGA
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Bergabunglah untuk membaca dan menyimpan komik
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-sm text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
            >
              Nama Pengguna
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="sangpenjaga12"
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
              autoComplete="username"
            />
          </div>

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
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
            >
              Kata Sandi
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
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
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
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full bg-dark border border-dark-border rounded-lg pl-4 pr-11 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-1"
                aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
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
                <span>Mendaftarkan...</span>
              </>
            ) : (
              <span>Daftar</span>
            )}
          </button>
        </form>

        {/* Login Footer */}
        <div className="mt-6 pt-6 border-t border-dark-border text-center text-sm text-gray-400">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-gold font-medium hover:underline hover:text-gold-light transition-colors"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  )
}
