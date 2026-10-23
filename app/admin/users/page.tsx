'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Crown,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

interface UserItem {
  id: string
  email: string
  username: string
  role: 'user' | 'admin' | 'superadmin'
  avatarUrl: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string>('admin')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users || [])
        setCurrentUserRole(data.currentUserRole || 'admin')
        setCurrentUserId(data.currentUserId || '')
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal memuat pengguna' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, targetRole: 'admin' | 'user') => {
    const actionText = targetRole === 'admin' ? 'menjadikan pengguna ini sebagai Admin' : 'menurunkan peran pengguna ini menjadi User biasa'
    if (!confirm(`Apakah Anda yakin ingin ${actionText}?`)) {
      return
    }

    try {
      setActionLoading(userId)
      setMessage(null)

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole: targetRole }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: data.message })
        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
        )
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengubah peran' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menghubungi server' })
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase()
    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const isSuperAdmin = currentUserRole === 'superadmin'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-white">Kelola Pengguna</h1>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                <Crown className="w-3.5 h-3.5" /> Superadmin Mode
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Daftar pengguna terdaftar dan manajemen wewenang akun
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-dark-border bg-dark-card px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:border-gold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-lg p-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs font-bold hover:underline ml-4"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-dark-border bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Akun</span>
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Administrator</span>
            <ShieldCheck className="w-4 h-4 text-gold" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gold">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Superadmin</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">
            {users.filter((u) => u.role === 'superadmin').length}
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-dark-border bg-dark-card py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="mt-3 text-sm text-gray-400">Memuat data pengguna...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16 text-center">
          <Shield className="h-10 w-10 text-gray-500 opacity-50" />
          <h3 className="mt-2 font-heading text-lg font-semibold text-white">
            Pengguna tidak ditemukan
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {search ? 'Tidak ada akun yang cocok dengan kata kunci pencarian.' : 'Belum ada pengguna terdaftar.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dark-border bg-dark-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark-border bg-dark/50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Peran (Role)</th>
                <th className="px-6 py-4">Terdaftar</th>
                <th className="px-6 py-4 text-right">Wewenang / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-sm">
              {filteredUsers.map((u) => {
                const isTargetSelf = u.id === currentUserId
                const isTargetSuperAdmin = u.role === 'superadmin'
                const isTargetAdmin = u.role === 'admin'
                const isProcessing = actionLoading === u.id

                return (
                  <tr key={u.id} className="hover:bg-dark-hover transition-colors">
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                            isTargetSuperAdmin
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : isTargetAdmin
                              ? 'bg-gold/20 text-gold border border-gold/40'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                        >
                          {u.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-1.5">
                            {u.username}
                            {isTargetSelf && (
                              <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">
                                Anda
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-300">{u.email}</td>

                    {/* Role badge */}
                    <td className="px-6 py-4">
                      {isTargetSuperAdmin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
                          <Crown className="w-3.5 h-3.5" /> Superadmin
                        </span>
                      ) : isTargetAdmin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 border border-gold/30 px-3 py-1 text-xs font-semibold text-gold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-400">
                          <User className="w-3.5 h-3.5" /> User Biasa
                        </span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {isTargetSuperAdmin ? (
                        <span className="text-xs text-gray-500 italic">
                          Pemilik Utama
                        </span>
                      ) : isSuperAdmin ? (
                        isTargetAdmin ? (
                          <button
                            onClick={() => handleRoleChange(u.id, 'user')}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                            Turunkan ke User
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(u.id, 'admin')}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-black transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                            Jadikan Admin
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-gray-500">
                          Hanya Superadmin
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
