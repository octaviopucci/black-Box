import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Row = {
  name: string
  price: string
}

type Props = {
  eyebrow: string
  title: string
  rows: readonly Row[]
  note?: string
  delay?: number
  footer?: ReactNode
}

export function PriceBlock({ eyebrow, title, rows, note, delay = 0, footer }: Props) {
  return (
    <Reveal delay={delay}>
      <article className="overflow-hidden rounded-md border border-ink/10 bg-surface-lift shadow-sm">
        <div className="border-b border-ink/10 px-6 py-5 sm:px-8">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display-title mt-2 text-2xl sm:text-3xl">{title}</h2>
          {note ? <p className="mt-2 max-w-lg text-sm text-ink-mute">{note}</p> : null}
        </div>
        <ul className="divide-y divide-ink/8">
          {rows.map((row) => (
            <li
              key={row.name}
              className="flex items-start justify-between gap-6 px-6 py-4 sm:px-8 sm:py-5"
            >
              <span className="text-sm leading-relaxed text-ink-soft sm:text-base">{row.name}</span>
              <span className="shrink-0 font-display text-lg font-bold text-gold-deep sm:text-xl">
                {row.price}
              </span>
            </li>
          ))}
        </ul>
        {footer ? <div className="border-t border-ink/10 px-6 py-5 sm:px-8">{footer}</div> : null}
      </article>
    </Reveal>
  )
}
