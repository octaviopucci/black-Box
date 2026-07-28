import type { VehicleStatus } from '@/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/utils/constants'
import { cn } from '@/utils'

export function StatusBadge({ status, className }: { status: VehicleStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        STATUS_COLORS[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
