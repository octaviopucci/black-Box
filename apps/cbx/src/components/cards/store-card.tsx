'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BadgeCheck, MapPin } from 'lucide-react'

import type { Store } from '@/types'
import { cn } from '@/lib/utils'
import { hoverLift } from '@/animations/variants'
import { Rating } from '@/components/ui/rating'

export interface StoreCardData {
  id: string
  name: string
  slug?: string
  logo: string
  cover?: string
  city: string
  verified?: boolean
  rating: number
  reviewCount?: number
  productCount?: number
  category?: string
}

export interface StoreCardProps {
  store: Store | StoreCardData
  href?: string
  className?: string
}

function StoreCard({ store, href, className }: StoreCardProps) {
  const linkHref = href ?? `/lojas/${store.id}`

  return (
    <motion.article
      className={cn(
        'group overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm',
        className,
      )}
      whileHover={hoverLift}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <Link href={linkHref} className="block">
        <div className="relative h-24 overflow-hidden bg-muted">
          {store.cover ? (
            <Image
              src={store.cover}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          ) : (
            <div className="size-full bg-gradient-to-r from-primary/20 to-accent/20" />
          )}
        </div>

        <div className="relative px-4 pb-4">
          <div className="relative -mt-8 mb-3 inline-block">
            <div className="relative size-16 overflow-hidden rounded-xl border-2 border-card bg-card shadow-sm">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted text-lg font-bold text-primary">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <h3 className="line-clamp-1 text-base font-semibold text-foreground">
              {store.name}
            </h3>
            {store.verified && (
              <BadgeCheck
                className="size-4 shrink-0 text-primary"
                aria-label="Loja verificada"
              />
            )}
          </div>

          {store.category && (
            <p className="mt-0.5 text-xs text-muted-foreground">{store.category}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating
              value={store.rating}
              count={store.reviewCount}
              size="sm"
            />
            {store.productCount !== undefined && (
              <span className="text-xs text-muted-foreground">
                {store.productCount} produtos
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span>{store.city}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export { StoreCard }
