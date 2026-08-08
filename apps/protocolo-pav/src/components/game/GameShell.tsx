import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle: string
  hud: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function GameShell({ title, subtitle, hud, children, footer }: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-paper">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <Link
          to="/arena"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ash transition hover:text-paper"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Arena
        </Link>
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-signal">
            {title}
          </p>
          <p className="text-[11px] text-ash">{subtitle}</p>
        </div>
        <div className="min-w-[4.5rem] text-right font-mono text-[11px] text-mist">{hud}</div>
      </header>
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 py-3 sm:px-6 sm:py-5">
        <div className="relative min-h-[55vh] flex-1 overflow-hidden rounded-2xl border border-line bg-panel hud-border">
          {children}
        </div>
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </div>
  )
}
