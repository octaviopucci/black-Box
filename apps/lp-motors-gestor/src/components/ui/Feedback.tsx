import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, Inbox, X } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export function Toast() {
  const { toasts, dismissToast } = useApp()

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }

  const colors = {
    success: 'border-lp-ok/30 bg-emerald-50 text-emerald-800',
    error: 'border-lp-danger/30 bg-red-50 text-red-800',
    info: 'border-lp-accent/30 bg-teal-50 text-teal-900',
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100%,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-panel ${colors[t.type]}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="text-lp-steel/60 hover:text-lp-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-lp-ink/20 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-2xl border border-lp-line bg-white px-5 py-4 shadow-lift">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-lp-mist border-t-lp-accent" />
        <span className="text-sm font-medium text-lp-steel">Processando...</span>
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="empty-state">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lp-accent/10 text-lp-accent">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="font-display text-xl font-semibold text-lp-ink">{title}</h3>
      {description ? <p className="max-w-md text-sm text-lp-steel">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-lp-mist border-t-lp-accent" />
      <p className="text-sm text-lp-steel">{label}</p>
    </div>
  )
}
