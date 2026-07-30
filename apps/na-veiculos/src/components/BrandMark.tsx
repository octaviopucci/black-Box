import { Link } from 'react-router-dom'

type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'hero'
  wordmark?: boolean
  to?: string | null
}

/** Refined monogram — typographic NA, horizon line. No clip-art car. */
export function BrandMark({
  className = '',
  size = 'md',
  wordmark = true,
  to = '/',
}: Props) {
  const dims = {
    sm: { box: 'h-9 w-9', type: 'text-sm' },
    md: { box: 'h-11 w-11', type: 'text-base' },
    lg: { box: 'h-14 w-14', type: 'text-xl' },
    hero: { box: 'h-20 w-20 sm:h-24 sm:w-24', type: 'text-3xl sm:text-4xl' },
  }[size]

  const mark = (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <span
        className={`relative grid ${dims.box} place-items-center overflow-hidden rounded-[2px] border border-paper/20 bg-ink-lift`}
        aria-hidden
      >
        <span className="absolute inset-x-2 top-[38%] h-px bg-lamp/70" />
        <span
          className={`relative font-display font-bold tracking-[-0.08em] text-paper-soft ${dims.type}`}
        >
          NA
        </span>
        <span className="absolute inset-0 bg-gradient-to-br from-lamp/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </span>
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-[-0.04em] text-paper-soft sm:text-lg">
            NA Veículos
          </span>
          <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-paper-mute">
            Capão Bonito
          </span>
        </span>
      )}
    </span>
  )

  if (to == null) return mark
  return (
    <Link to={to} className="inline-flex" aria-label="NA Veículos — início">
      {mark}
    </Link>
  )
}

/** Large path logo for intro / hero artifact */
export function BrandLockup({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 120"
      className={className}
      role="img"
      aria-label="NA Veículos"
    >
      <defs>
        <linearGradient id="naMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7F8FA" />
          <stop offset="45%" stopColor="#ECEEF2" />
          <stop offset="100%" stopColor="#D4A25A" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="72"
        fill="url(#naMetal)"
        fontFamily="Syne, system-ui, sans-serif"
        fontSize="78"
        fontWeight="700"
        letterSpacing="-4"
      >
        NA
      </text>
      <line
        x1="148"
        y1="58"
        x2="410"
        y2="58"
        stroke="#D4A25A"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <text
        x="148"
        y="88"
        fill="#9BA1AD"
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        fontSize="14"
        letterSpacing="8"
      >
        VEÍCULOS
      </text>
    </svg>
  )
}
