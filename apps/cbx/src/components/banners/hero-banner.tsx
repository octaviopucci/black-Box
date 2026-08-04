'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Banner } from '@/types'
import { cn } from '@/lib/utils'

const tones: Record<Banner['tone'], string> = {
  primary: 'from-primary via-[#7c3aed] to-accent',
  secondary: 'from-secondary via-[#fb923c] to-[#f59e0b]',
  accent: 'from-accent via-[#e879f9] to-primary',
  dark: 'from-zinc-900 via-zinc-800 to-zinc-900',
}

export function HeroBanner({ banner }: { banner: Banner }) {
  return (
    <Link href={banner.href} className="block">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.995 }}
        className={cn(
          'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg md:p-8',
          tones[banner.tone],
        )}
      >
        <div className="relative z-10 max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Destaque</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{banner.title}</h2>
          <p className="mt-2 text-sm text-white/85 md:text-base">{banner.subtitle}</p>
          <span className="mt-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            {banner.cta}
          </span>
        </div>
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 right-10 size-48 rounded-full bg-black/10 blur-2xl"
          aria-hidden
        />
      </motion.div>
    </Link>
  )
}

export function PromoBanner({
  title,
  subtitle,
  href,
  className,
}: {
  title: string
  subtitle: string
  href: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col justify-between rounded-2xl bg-gradient-to-br from-secondary/15 via-orange-50 to-amber-50 p-4 ring-1 ring-secondary/20 transition hover:ring-secondary/40',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Promoção</p>
      <div>
        <h3 className="mt-2 font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  )
}

export function HorizontalAd({
  title = 'Anuncie no CBX',
  subtitle = 'Alcance milhares de pessoas em Capão Bonito',
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Publicidade</p>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        href="/planos"
        className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
      >
        Saiba mais
      </Link>
    </div>
  )
}
