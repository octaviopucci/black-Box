'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BadgeCheck, Building2 } from 'lucide-react'

import type { Company } from '@/types'
import { cn } from '@/lib/utils'
import { hoverLift } from '@/animations/variants'
import { Rating } from '@/components/ui/rating'
import { ROUTES } from '@/constants/brand'

export function CompanyCard({ company, className }: { company: Company; className?: string }) {
  const href = company.storeId ? ROUTES.loja(company.storeId) : ROUTES.empresas

  return (
    <motion.article
      className={cn(
        'group w-64 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm',
        className,
      )}
      whileHover={hoverLift}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <Link href={href} className="flex items-center gap-3 p-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
          {company.logo ? (
            <Image src={company.logo} alt={company.name} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="flex size-full items-center justify-center text-primary">
              <Building2 className="size-6" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{company.name}</h3>
            {company.verified && (
              <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="Empresa verificada" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{company.category}</p>
          <Rating value={company.rating} size="sm" className="mt-1.5" />
        </div>
      </Link>
    </motion.article>
  )
}
