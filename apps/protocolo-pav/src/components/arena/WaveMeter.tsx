import { motion } from 'framer-motion'

type Props = {
  impulse: number
  will: number
  wave: number
  xp: number
}

export function WaveMeter({ impulse, will, wave, xp }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-panel/90 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-signal">
          Arena da força de vontade
        </p>
        <p className="font-mono text-[11px] text-ash">
          Onda {wave} · +{xp} XP
        </p>
      </div>
      <p className="mb-5 max-w-xl text-sm text-ash">
        A fissura dura em média 3 a 5 minutos. Aqui você não negocia com o vício. Você joga a favor
        do seu cérebro.
      </p>
      <div className="space-y-4">
        <Bar label="Impulso do vício" value={impulse} color="bg-signal" />
        <Bar label="Sua vontade + jogo" value={will} color="bg-will" />
      </div>
    </div>
  )
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-steel">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={false}
          animate={{ width: `${Math.max(4, Math.min(100, value))}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
