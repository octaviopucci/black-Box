import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/asset'

type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  to?: string | null
}

const sizeClass = {
  sm: 'h-8 w-auto sm:h-9',
  md: 'h-10 w-auto sm:h-11',
  lg: 'h-12 w-auto',
} as const

/** Logo oficial PNG transparente — header / footer */
export function BrandMark({ className = '', size = 'md', to = '/' }: Props) {
  const mark = (
    <img
      src={assetUrl('brand/logo.png')}
      alt="N.A. Veículos"
      className={`${sizeClass[size]} object-contain ${className}`}
      width={296}
      height={101}
      decoding="async"
    />
  )

  if (to == null) return mark
  return (
    <Link to={to} className="inline-flex items-center" aria-label="N.A. Veículos — início">
      {mark}
    </Link>
  )
}

/** Logo oficial PNG transparente — banner / intro */
export function BrandLockup({
  className = '',
  banner = false,
}: {
  className?: string
  banner?: boolean
}) {
  return (
    <img
      src={assetUrl(banner ? 'brand/logo-banner.png' : 'brand/logo.png')}
      alt="N.A. Veículos"
      className={`h-auto w-auto object-contain ${className}`}
      width={banner ? 1184 : 296}
      height={banner ? 404 : 101}
      decoding="async"
    />
  )
}
