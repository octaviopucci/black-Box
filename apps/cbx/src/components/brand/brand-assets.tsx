'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { assetPath } from '@/lib/asset-path'
import { ROUTES } from '@/constants/brand'

const LOGO_SRC = assetPath('/brand/logo.png')
const BANNER_SRC = assetPath('/brand/banner.png')

export function BrandLogo({
  className,
  size = 40,
  href = ROUTES.home,
  priority = false,
}: {
  className?: string
  size?: number
  href?: string | null
  priority?: boolean
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- explicit basePath for static export
    <img
      src={LOGO_SRC}
      alt="CBX — O Marketplace de Capão Bonito"
      width={size}
      height={size}
      className={cn('object-contain', className)}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  )

  if (href === null) return img
  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="CBX início">
      {img}
    </Link>
  )
}

export function BrandBanner({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-white/10',
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- explicit basePath for static export */}
      <img
        src={BANNER_SRC}
        alt="CBX — O Marketplace de Capão Bonito. Tudo que você precisa, em um só lugar!"
        width={1536}
        height={1024}
        className="h-auto w-full object-cover"
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </div>
  )
}

export { LOGO_SRC, BANNER_SRC }
