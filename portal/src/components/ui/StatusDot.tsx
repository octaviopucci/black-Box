import { cn } from '../../lib/cn'

type Props = {
  label?: string
  className?: string
}

export function StatusDot({ label = 'OPERACIONAL', className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-silver', className)}>
      <span className="bb-status-pulse relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-status/40" />
        <span className="relative h-2 w-2 rounded-full bg-status" />
      </span>
      {label}
    </span>
  )
}
