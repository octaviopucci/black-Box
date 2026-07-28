import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export function Toast() {
  const { toasts, dismissToast } = useApp()

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }

  const colors = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
    info: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
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
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card backdrop-blur ${colors[t.type]}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm text-white">{t.message}</p>
              <button type="button" onClick={() => dismissToast(t.id)} className="text-white/50 hover:text-white">
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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-gray/50 bg-brand-graphite px-5 py-4 shadow-card">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-brand-red" />
        <span className="text-sm text-white/80">Processando...</span>
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-gray/60 bg-brand-graphite/40 px-6 py-16 text-center">
      <div className="mb-4 h-12 w-12 rounded-full bg-brand-red/15 ring-1 ring-brand-red/30" />
      <h3 className="font-display text-xl font-semibold tracking-wide">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-white/55">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-brand-red" />
      <p className="text-sm text-white/50">{label}</p>
    </div>
  )
}
