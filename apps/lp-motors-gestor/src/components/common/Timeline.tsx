import { motion } from 'framer-motion'
import type { HistoryEvent } from '@/types'
import { formatDate } from '@/utils'

const TYPE_COLORS: Record<string, string> = {
  compra: 'bg-emerald-500',
  entrada_estoque: 'bg-sky-500',
  oficina: 'bg-amber-500',
  lavagem: 'bg-cyan-500',
  fotos: 'bg-violet-500',
  publicado: 'bg-indigo-500',
  reservado: 'bg-orange-500',
  venda: 'bg-red-500',
  entrega: 'bg-slate-500',
  status_change: 'bg-pink-500',
  despesa: 'bg-yellow-500',
  edicao: 'bg-zinc-500',
  duplicacao: 'bg-teal-500',
  arquivo: 'bg-stone-500',
  restauracao: 'bg-lime-500',
  outro: 'bg-lp-steel',
}

export function Timeline({ events }: { events: HistoryEvent[] }) {
  if (!events.length) {
    return <p className="text-sm text-lp-steel">Nenhum evento registrado.</p>
  }

  return (
    <div className="relative space-y-0 pl-2">
      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-lp-line" />
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="relative flex gap-4 pb-5"
        >
          <div
            className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-white ${
              TYPE_COLORS[event.type] || 'bg-lp-steel'
            }`}
          />
          <div className="min-w-0 flex-1 rounded-xl border border-lp-line bg-white px-3 py-2.5 shadow-panel">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-lp-steel">
              <span>{formatDate(event.data)} · {event.hora}</span>
              <span>{event.usuario}</span>
            </div>
            <p className="mt-1 text-sm text-lp-ink">{event.descricao}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
