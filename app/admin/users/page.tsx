'use client'

import { useState } from 'react'
import { Search, Shield, Ban, Eye } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')

  // TODO: Fetch users from API
  const users: any[] = []

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Kelola Users</h1>
        <p className="mt-1 text-sm text-gray-400">
          Daftar pembaca terdaftar dan status langganan
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <Shield className="mb-2 h-10 w-10 text-gray-500 opacity-50" />
          <h3 className="mt-2 font-heading text-lg font-semibold text-white">
            Belum ada user
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            User akan muncul setelah ada yang mendaftar
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dark-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-card">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Langganan</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Terdaftar</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b border-dark-border hover:bg-dark-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm font-medium text-gold">
                        {user.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium text-white">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      user.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">-</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1 text-gray-400 hover:bg-dark-hover hover:text-gold">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-gray-400 hover:bg-dark-hover hover:text-red-400">
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
