'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/brand'

const LOGO_SRC = '/brand/logo.png'
const BANNER_SRC = '/brand/banner.png'

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
    <Image
      src={LOGO_SRC}
      alt="CBX — O Marketplace de Capão Bonito"
      width={size}
      height={size}
      className={cn('object-contain', className)}
      priority={priority}
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
      <Image
        src={BANNER_SRC}
        alt="CBX — O Marketplace de Capão Bonito. Tudo que você precisa, em um só lugar!"
        width={1536}
        height={1024}
        className="h-auto w-full object-cover"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 1152px"
      />
    </div>
  )
}

export { LOGO_SRC, BANNER_SRC }
