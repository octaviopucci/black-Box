import { cn } from '@/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  compact?: boolean
}

export function MacielLogo({ className, showText = true, compact }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        viewBox="0 0 64 64"
        className={cn('shrink-0', compact ? 'h-9 w-9' : 'h-12 w-12')}
        aria-hidden
      >
        <defs>
          <linearGradient id="mmChrome" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#D0D0D0" />
            <stop offset="100%" stopColor="#6A6A6A" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="22" fill="none" stroke="url(#mmChrome)" strokeWidth="3" />
        <path
          d="M17 44 L32 12 L47 44 L38.5 44 L32 28.5 L25.5 44 Z"
          fill="url(#mmChrome)"
        />
      </svg>
      {showText ? (
        <div className="leading-none">
          <div
            className={cn(
              'font-display font-bold tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500',
              compact ? 'text-lg' : 'text-2xl',
            )}
          >
            MACIEL
          </div>
          <div
            className={cn(
              'font-display font-semibold tracking-[0.35em] text-zinc-400',
              compact ? 'text-[10px]' : 'text-xs',
            )}
          >
            MOTORS
          </div>
        </div>
      ) : null}
    </div>
  )
}
