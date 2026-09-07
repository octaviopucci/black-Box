import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, subtitle, className, align = 'left' }: Props) {
  return (
    <header
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mute">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-paper sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">{subtitle}</p>
      ) : null}
    </header>
  )
}
