import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/utils'
import { cn } from '@/utils'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  hint?: string
  accent?: boolean
  currency?: boolean
  index?: number
  onClick?: () => void
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  hint,
  accent,
  currency,
  index = 0,
  onClick,
}: DashboardCardProps) {
  const display =
    typeof value === 'number'
      ? currency
        ? formatCurrency(value)
        : formatNumber(Math.round(value))
      : value

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'panel relative overflow-hidden p-4 text-left',
        accent && 'ring-1 ring-brand-red/30',
        onClick && 'cursor-pointer transition hover:border-brand-red/50 hover:shadow-glow',
        !onClick && 'cursor-default',
      )}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-brand-red/10 blur-2xl" />
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-white/45">{title}</p>
        <div className="rounded-xl bg-brand-black/60 p-2 text-brand-red">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p
        className={cn(
          'font-display text-2xl font-bold tracking-wide',
          currency && typeof value === 'number' && value < 0 && 'text-red-400',
          currency && typeof value === 'number' && value > 0 && title.toLowerCase().includes('lucro') && 'text-emerald-400',
        )}
      >
        {display}
      </p>
      {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
    </motion.button>
  )
}
