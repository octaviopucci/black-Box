import type { PayableStatus, VehicleStatus } from '@/types'
import { PAYABLE_STATUS_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/utils/constants'
import { cn } from '@/utils'

const PAYABLE_COLORS: Record<PayableStatus, string> = {
  pendente: 'bg-amber-50 text-amber-800 border-amber-200',
  pago: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  vencido: 'bg-red-50 text-red-800 border-red-200',
  cancelado: 'bg-slate-50 text-slate-500 border-slate-200',
}

const SEVERITY_COLORS = {
  critico: 'bg-red-50 text-red-800 border-red-200',
  atencao: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  oportunidade: 'bg-teal-50 text-teal-800 border-teal-200',
} as const

export function StatusBadge({
  status,
  className,
}: {
  status: VehicleStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'chip border',
        STATUS_COLORS[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function PayableStatusBadge({
  status,
  className,
}: {
  status: PayableStatus
  className?: string
}) {
  return (
    <span className={cn('chip border', PAYABLE_COLORS[status], className)}>
      {PAYABLE_STATUS_LABELS[status]}
    </span>
  )
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: keyof typeof SEVERITY_COLORS
  className?: string
}) {
  const labels = {
    critico: 'Crítico',
    atencao: 'Atenção',
    info: 'Info',
    oportunidade: 'Oportunidade',
  }
  return (
    <span className={cn('chip border', SEVERITY_COLORS[severity], className)}>
      {labels[severity]}
    </span>
  )
}
