import { motion } from 'framer-motion'
import type { HistoryEvent } from '@/types'
import { formatDate } from '@/utils'

const TYPE_COLORS: Record<string, string> = {
  compra: 'bg-emerald-400',
  entrada_estoque: 'bg-sky-400',
  oficina: 'bg-amber-400',
  lavagem: 'bg-cyan-400',
  fotos: 'bg-violet-400',
  publicado: 'bg-indigo-400',
  reservado: 'bg-orange-400',
  venda: 'bg-red-400',
  entrega: 'bg-slate-400',
  status_change: 'bg-pink-400',
  despesa: 'bg-yellow-400',
  edicao: 'bg-zinc-400',
  duplicacao: 'bg-teal-400',
  arquivo: 'bg-stone-400',
  restauracao: 'bg-lime-400',
  outro: 'bg-white/40',
}

export function Timeline({ events }: { events: HistoryEvent[] }) {
  if (!events.length) {
    return <p className="text-sm text-white/45">Nenhum evento registrado.</p>
  }

  return (
    <div className="relative space-y-0 pl-2">
      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-brand-gray/60" />
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="relative flex gap-4 pb-5"
        >
          <div
            className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-brand-graphite ${
              TYPE_COLORS[event.type] || 'bg-white/40'
            }`}
          />
          <div className="min-w-0 flex-1 rounded-xl border border-brand-gray/40 bg-brand-black/40 px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
              <span>
                {formatDate(event.data)} · {event.hora}
              </span>
              <span>{event.usuario}</span>
            </div>
            <p className="mt-1 text-sm text-white/85">{event.descricao}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
