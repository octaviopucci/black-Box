import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/asset'

type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  to?: string | null
}

/** Header/footer sizes already -30% vs previous */
const sizeClass = {
  sm: 'h-[1.4rem] w-auto sm:h-[1.575rem]',
  md: 'h-[1.75rem] w-auto sm:h-[1.925rem]',
  lg: 'h-[2.1rem] w-auto',
} as const

/** Logo oficial vetorizada (SVG) — header / footer */
export function BrandMark({ className = '', size = 'md', to = '/' }: Props) {
  const mark = (
    <img
      src={assetUrl('brand/logo.svg')}
      alt="N.A. Veículos"
      className={`${sizeClass[size]} object-contain ${className}`}
      width={800}
      height={230}
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

/** Logo oficial vetorizada — banner / intro (−30%) */
export function BrandLockup({
  className = '',
}: {
  className?: string
  banner?: boolean
}) {
  return (
    <img
      src={assetUrl('brand/logo.svg')}
      alt="N.A. Veículos"
      className={`h-auto w-auto object-contain ${className}`}
      width={1600}
      height={460}
      decoding="async"
    />
  )
}
