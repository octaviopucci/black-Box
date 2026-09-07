import { cn } from '../../lib/cn'

type Props = {
  className?: string
  markOnly?: boolean
}

export function Logo({ className, markOnly = false }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-paper', className)}>
      <svg
        viewBox="0 0 40 40"
        width={36}
        height={36}
        className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="32" height="32" stroke="currentColor" strokeWidth="1.75" fill="none" />
        <rect
          x="10"
          y="10"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="1.25"
          fill="none"
          opacity="0.45"
        />
        <rect x="16" y="14" width="8" height="12" fill="currentColor" />
      </svg>
      {markOnly ? (
        <span className="sr-only">Black Box</span>
      ) : (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.18em]">
            Black Box
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-mute">
            Software Factory
          </span>
        </span>
      )}
    </span>
  )
}
