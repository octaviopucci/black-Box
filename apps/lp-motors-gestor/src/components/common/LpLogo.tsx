import { cn } from '@/utils'
import { APP_SHORT } from '@/config/variant'

interface LpLogoProps {
  className?: string
  showText?: boolean
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LpLogo({ className, showText = true, compact, size = 'md' }: LpLogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 48 }
  const s = iconSizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <rect width="48" height="48" rx="12" fill="#0C1222" />
        <path
          d="M10 30 L18 18 L26 26 L38 14"
          stroke="#0F766E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="14" r="3" fill="#B45309" />
        <path
          d="M10 34 H38"
          stroke="#B45309"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      {showText && !compact ? (
        <div className="min-w-0 leading-tight">
          <span className="block font-display text-base font-bold tracking-tight text-lp-ink">
            {APP_SHORT}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-lp-accent">
            Gestor
          </span>
        </div>
      ) : null}
    </div>
  )
}
