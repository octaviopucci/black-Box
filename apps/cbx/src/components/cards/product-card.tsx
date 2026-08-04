'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MapPin } from 'lucide-react'

import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import { hoverLift } from '@/animations/variants'
import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { PriceTag } from '@/components/ui/price-tag'

export interface ProductCardData {
  id: string
  title: string
  slug?: string
  price: number
  oldPrice?: number
  images: string[]
  city: string
  neighborhood?: string
  sponsored?: boolean
}

export interface ProductCardProps {
  product: Product | ProductCardData
  href?: string
  favorited?: boolean
  onFavoriteToggle?: (id: string) => void
  className?: string
}

function ProductCard({
  product,
  href,
  favorited = false,
  onFavoriteToggle,
  className,
}: ProductCardProps) {
  const linkHref = href ?? `/produto/${product.id}`
  const location = product.neighborhood
    ? `${product.neighborhood}, ${product.city}`
    : product.city
  const imageSrc = product.images[0]

  return (
    <motion.article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm',
        className,
      )}
      whileHover={hoverLift}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <Link href={linkHref} className="flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              Sem imagem
            </div>
          )}

          {product.sponsored && (
            <Badge
              variant="sponsored"
              className="absolute left-2 top-2 shadow-sm"
            >
              Patrocinado
            </Badge>
          )}

          {onFavoriteToggle && (
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'absolute right-2 top-2 bg-card/80 backdrop-blur-sm hover:bg-card',
                favorited && 'text-danger hover:text-danger',
              )}
              aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFavoriteToggle(product.id)
              }}
            >
              <Heart className={cn(favorited && 'fill-current')} />
            </IconButton>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {product.title}
          </h3>
          <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />
          <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export { ProductCard }
