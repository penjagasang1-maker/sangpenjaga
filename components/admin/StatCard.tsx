interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
}

export default function StatCard({ label, value, icon, change, changeType = 'neutral' }: StatCardProps) {
  const changeColor = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  }

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-5 transition-colors hover:border-gold/30">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-gold/10 p-2.5 text-gold">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium ${changeColor[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-400">{label}</p>
      </div>
    </div>
  )
}
