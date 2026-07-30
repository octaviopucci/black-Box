import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/asset'

type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'hero'
  wordmark?: boolean
  to?: string | null
}

const sizeClass = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
  hero: 'h-20 w-20 sm:h-24 sm:w-24',
} as const

/** Logo oficial N.A. Veículos */
export function BrandMark({
  className = '',
  size = 'md',
  wordmark = true,
  to = '/',
}: Props) {
  const mark = (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <img
        src={assetUrl('brand/logo.jpg')}
        alt=""
        className={`${sizeClass[size]} rounded-[2px] object-cover`}
        width={96}
        height={96}
      />
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-[-0.04em] text-paper-soft sm:text-lg">
            N.A. Veículos
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
    <Link to={to} className="inline-flex" aria-label="N.A. Veículos — início">
      {mark}
    </Link>
  )
}

/** Logo oficial em destaque (intro / hero) */
export function BrandLockup({ className = '' }: { className?: string }) {
  return (
    <img
      src={assetUrl('brand/logo.jpg')}
      alt="N.A. Veículos"
      className={`h-auto object-contain ${className}`}
      width={420}
      height={420}
    />
  )
}
