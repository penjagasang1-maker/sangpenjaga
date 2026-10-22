'use client'

import { useState } from 'react'
import { CreditCard, Search, Filter, Download } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export default function AdminPembayaranPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // TODO: Fetch payments from API
  const payments: any[] = []

  const statusColors: Record<string, string> = {
    success: 'bg-green-500/10 text-green-400',
    pending: 'bg-yellow-500/10 text-yellow-400',
    failed: 'bg-red-500/10 text-red-400',
    expired: 'bg-gray-500/10 text-gray-400',
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Pembayaran</h1>
          <p className="mt-1 text-sm text-gray-400">
            Riwayat transaksi dan pembayaran pembaca
          </p>
        </div>
        <a
          href="/admin/pembayaran/pengaturan"
          className="inline-flex items-center gap-2 rounded-lg border border-dark-border px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-dark-hover hover:text-white"
        >
          Pengaturan Midtrans
        </a>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-dark-border bg-dark-card p-4">
          <p className="text-sm text-gray-400">Total Pendapatan</p>
          <p className="mt-1 text-xl font-bold text-white">Rp 0</p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-4">
          <p className="text-sm text-gray-400">Transaksi Sukses</p>
          <p className="mt-1 text-xl font-bold text-green-400">0</p>
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-card p-4">
          <p className="text-sm text-gray-400">Transaksi Pending</p>
          <p className="mt-1 text-xl font-bold text-yellow-400">0</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari order ID atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="success">Sukses</option>
          <option value="pending">Pending</option>
          <option value="failed">Gagal</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Payment Table */}
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-16">
          <CreditCard className="mb-2 h-10 w-10 text-gray-500 opacity-50" />
          <h3 className="mt-2 font-heading text-lg font-semibold text-white">
            Belum ada transaksi
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Transaksi akan muncul saat pembaca melakukan pembelian
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dark-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border bg-dark-card">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Tipe</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Jumlah</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-400">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: any) => (
                <tr key={payment.id} className="border-b border-dark-border hover:bg-dark-hover">
                  <td className="px-4 py-3 text-sm font-mono text-white">{payment.midtransOrderId}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{payment.userId}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400">
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{formatRupiah(payment.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[payment.status] || ''}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(payment.createdAt).toLocaleDateString('id-ID')}
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
