import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle: string
  hud: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** Full-bleed mobile playfield (default true for games) */
  immersive?: boolean
}

export function GameShell({
  title,
  subtitle,
  hud,
  children,
  footer,
  immersive = true,
}: Props) {
  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-ink text-paper overscroll-none">
      <header
        className="z-20 flex shrink-0 items-center justify-between gap-2 border-b border-line px-3 pb-2.5 pt-[max(0.65rem,env(safe-area-inset-top))] sm:px-5"
      >
        <Link
          to="/arena"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-panel px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mist active:bg-steel"
          aria-label="Voltar à Arena"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden xs:inline sm:inline">Arena</span>
        </Link>
        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="truncate font-display text-xs font-semibold uppercase tracking-[0.14em] text-signal sm:text-sm">
            {title}
          </p>
          <p className="truncate text-[10px] text-ash sm:text-[11px]">{subtitle}</p>
        </div>
        <div className="min-w-11 max-w-[30%] text-right font-mono text-[10px] leading-tight text-mist sm:text-[11px]">
          {hud}
        </div>
      </header>

      <div
        className={`relative flex min-h-0 flex-1 flex-col ${
          immersive ? 'px-0 sm:px-4 sm:py-3' : 'px-3 py-3 sm:px-6'
        }`}
      >
        <div
          className={`relative min-h-0 flex-1 overflow-hidden bg-panel ${
            immersive
              ? 'rounded-none border-0 sm:rounded-2xl sm:border sm:border-line'
              : 'rounded-2xl border border-line'
          } hud-border`}
        >
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-line/80 bg-ink/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:border-0 sm:bg-transparent sm:px-0 sm:pb-2 sm:pt-3 sm:backdrop-blur-0">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
