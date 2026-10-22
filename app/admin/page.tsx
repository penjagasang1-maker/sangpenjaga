import StatCard from '@/components/admin/StatCard'
import { BookOpen, Users, CreditCard, Eye } from 'lucide-react'

export default function AdminDashboard() {
  // TODO: Fetch real data from DB
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Selamat datang di panel admin Sang Penjaga
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Komik"
          value={0}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          label="Total Pembaca"
          value={0}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pendapatan"
          value="Rp 0"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          label="Total Views"
          value={0}
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Comics */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <h2 className="font-heading text-lg font-semibold text-white">
            Komik Terbaru
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center py-8 text-gray-500">
            <BookOpen className="mb-2 h-10 w-10 opacity-50" />
            <p className="text-sm">Belum ada komik</p>
            <a
              href="/admin/komik/baru"
              className="mt-3 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gold-light"
            >
              Tambah Komik
            </a>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <h2 className="font-heading text-lg font-semibold text-white">
            Transaksi Terbaru
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center py-8 text-gray-500">
            <CreditCard className="mb-2 h-10 w-10 opacity-50" />
            <p className="text-sm">Belum ada transaksi</p>
          </div>
        </div>
      </div>
    </div>
  )
}
