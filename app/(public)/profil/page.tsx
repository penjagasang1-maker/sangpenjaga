'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Calendar,
  LogOut,
  Sparkles,
} from 'lucide-react'

interface CurrentUserData {
  id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'superadmin'
  avatarUrl?: string | null
  createdAt?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<CurrentUserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Password Change Form State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [savingPassword, setSavingPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
          } else {
            router.push('/login?redirect=/profil')
          }
        } else {
          router.push('/login?redirect=/profil')
        }
      } catch {
        router.push('/login?redirect=/profil')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru harus minimal 6 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.')
      return
    }

    try {
      setSavingPassword(true)
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Kata sandi berhasil diperbarui!')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setErrorMsg(data.error || 'Gagal mengubah kata sandi.')
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch {
      window.location.href = '/'
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 pb-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
        <p className="mt-3 text-sm text-gray-400">Memuat profil akun...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Profil & Pengaturan Akun
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Kelola informasi profil dan keamanan kata sandi akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl text-center">
            <div className="relative inline-block mx-auto mb-4">
              <div className="w-20 h-20 rounded-full bg-gold/20 text-gold border-2 border-gold/40 flex items-center justify-center font-heading font-extrabold text-3xl shadow-lg shadow-gold/10">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-dark rounded-full" />
            </div>

            <h2 className="text-lg font-bold text-white font-heading">
              {user.username}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 break-all">{user.email}</p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase">{user.role}</span>
            </div>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-dark-border space-y-2 text-left">
              {user.role !== 'user' && (
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gold bg-gold/10 hover:bg-gold/20 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Dashboard Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password Section */}
        <div className="md:col-span-2">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-5 border-b border-dark-border mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-white">
                  Ganti Kata Sandi
                </h2>
                <p className="text-xs text-gray-400">
                  Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun
                </p>
              </div>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-sm text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-sm text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">{successMsg}</p>
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-dark border border-dark-border rounded-lg pl-4 pr-11 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-1"
                    aria-label={showNew ? 'Sembunyikan' : 'Lihat'}
                  >
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full bg-dark border border-dark-border rounded-lg pl-4 pr-11 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors p-1"
                    aria-label={showConfirm ? 'Sembunyikan' : 'Lihat'}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full bg-gold hover:bg-gold-light text-black font-heading font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-gold/10"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Perbarui Kata Sandi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
