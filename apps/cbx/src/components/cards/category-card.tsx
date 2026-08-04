'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

import type { Category } from '@/types'
import { cn, formatCompact } from '@/lib/utils'
import { hoverLift } from '@/animations/variants'

export interface CategoryCardData {
  id: string
  name: string
  slug: string
  icon: string
  color?: string
  productCount?: number
  image?: string
}

export interface CategoryCardProps {
  category: Category | CategoryCardData
  href?: string
  className?: string
}

function resolveIcon(iconName: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  const pascalCase = iconName
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return icons[pascalCase] ?? icons[pascalCase.charAt(0).toUpperCase() + pascalCase.slice(1)] ?? LucideIcons.LayoutGrid
}

function CategoryCard({ category, href, className }: CategoryCardProps) {
  const linkHref = href ?? `/categorias/${category.slug}`
  const Icon = resolveIcon(category.icon)
  const accentColor = category.color ?? 'var(--primary)'

  return (
    <motion.article
      className={cn(
        'group overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm',
        className,
      )}
      whileHover={hoverLift}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <Link
        href={linkHref}
        className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/30"
      >
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          {category.image ? (
            <Image
              src={category.image}
              alt=""
              width={28}
              height={28}
              className="object-contain"
            />
          ) : (
            <Icon className="size-6" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {category.name}
          </h3>
          {category.productCount !== undefined && (
            <p className="text-xs text-muted-foreground">
              {formatCompact(category.productCount)} anúncios
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

export { CategoryCard }
