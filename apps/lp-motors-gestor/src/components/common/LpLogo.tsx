import { cn } from '@/utils'
import { APP_SHORT } from '@/config/variant'
import { brandDisplayName } from '@/utils/brand'
import { useAppOptional } from '@/context/AppContext'

interface LpLogoProps {
  className?: string
  showText?: boolean
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Override when outside provider or for preview. */
  name?: string
  logoUrl?: string
  markOnly?: boolean
  accent?: string
  copper?: string
  ink?: string
}

function Mark({ size, accent, copper, ink }: { size: number; accent: string; copper: string; ink: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <rect width="48" height="48" rx="12" fill={ink} />
      <path
        d="M10 30 L18 18 L26 26 L38 14"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="14" r="3" fill={copper} />
      <path d="M10 34 H38" stroke={copper} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function LpLogo({
  className,
  showText = true,
  compact,
  size = 'md',
  name,
  logoUrl,
  markOnly,
  accent: accentProp,
  copper: copperProp,
  ink: inkProp,
}: LpLogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 48 }
  const s = iconSizes[size]
  const app = useAppOptional()
  const settings = app?.settings

  const label = name || (settings ? brandDisplayName(settings) : APP_SHORT)
  const logo = logoUrl !== undefined ? logoUrl : settings?.logo || ''
  const accent = accentProp || settings?.brand?.corPrimaria || '#0F766E'
  const copper = copperProp || settings?.brand?.corSecundaria || '#B45309'
  const ink = inkProp || settings?.brand?.corPainel || '#0C1222'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {logo ? (
        <img
          src={logo}
          alt={label}
          className="shrink-0 object-contain"
          style={{ width: s, height: s, borderRadius: 'var(--lp-radius)' }}
        />
      ) : (
        <Mark size={s} accent={accent} copper={copper} ink={ink} />
      )}
      {showText && !compact && !markOnly ? (
        <div className="min-w-0 leading-tight">
          <span className="block truncate font-display text-base font-bold tracking-tight text-lp-ink">
            {label}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-lp-accent">
            Gestor
          </span>
        </div>
      ) : null}
    </div>
  )
}
