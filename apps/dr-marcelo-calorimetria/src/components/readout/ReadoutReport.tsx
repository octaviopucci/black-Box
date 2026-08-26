import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Info } from 'lucide-react'
import { readoutSample } from '../../data/readoutSample'
import { useCountUp } from '../../hooks/useCountUp'
import { MetabolicChart } from './MetabolicChart'

function InfoBox({ text }: { text: string }) {
  return (
    <div className="flex gap-2 rounded border border-line bg-paper-soft/80 p-3">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" strokeWidth={2} />
      <p className="text-[11px] leading-relaxed text-mute">{text}</p>
    </div>
  )
}

function ValueChip({
  label,
  value,
  unit,
  active,
  delay = 0,
  decimals = 0,
}: {
  label: string
  value: number
  unit?: string
  active: boolean
  delay?: number
  decimals?: number
}) {
  const display = useCountUp(value, active, { duration: 1.5, decimals })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-[88px] shrink-0 rounded border border-ember/35 bg-snow px-2.5 py-2 text-center"
    >
      <p className="font-mono text-[9px] uppercase tracking-wider text-mute">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-ember">
        {display}
        {unit && <span className="ml-0.5 text-[10px] font-normal text-mute">{unit}</span>}
      </p>
    </motion.div>
  )
}

function TmbGauge({ active }: { active: boolean }) {
  const { tmb } = readoutSample
  const pinPct = Math.min(Math.max((tmb.value / tmb.predicted) * 100, 8), 192)

  return (
    <div className="mt-4">
      <div className="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-sky-200 via-emerald-300 to-rose-300">
        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2"
          initial={{ left: '4%' }}
          animate={active ? { left: `${pinPct}%` } : { left: '4%' }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginLeft: -10 }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-sm" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3DAA5C" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
        </motion.div>
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-mute">
        <span>0</span>
        <span>100</span>
        <span>200</span>
      </div>
      <p className="mt-1 font-mono text-[10px] text-mute">
        TMB Previsto: {tmb.predicted.toLocaleString('pt-BR')} KCal/dia
      </p>
    </div>
  )
}

export function ReadoutReport() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { once: true, amount: 0.15 })

  const tmbDisplay = useCountUp(readoutSample.tmb.value, active, { duration: 1.7 })
  const getDisplay = useCountUp(readoutSample.get.value, active, { duration: 1.8, decimals: 0 })
  const fatDisplay = useCountUp(readoutSample.exam.fat, active, { duration: 1.5, decimals: 1 })
  const carbsDisplay = useCountUp(readoutSample.exam.carbs, active, { duration: 1.5, decimals: 1 })

  return (
    <div
      ref={ref}
      className="mt-12 overflow-hidden rounded-sm border border-line bg-snow shadow-soft"
    >
      <div className="border-b border-line bg-paper-soft/50 px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal-soft">
          Exame de Calorimetria Indireta
        </p>
        <p className="mt-0.5 text-[11px] text-mute">Exemplo ilustrativo — valores fictícios para demonstração</p>
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        {/* TMB */}
        <section>
          <h3 className="font-display text-base text-ink">Taxa Metabólica Basal</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={active ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex rounded border-2 border-ember/50 px-4 py-2"
            >
              <span className="font-mono text-xl font-semibold text-ember sm:text-2xl">
                {tmbDisplay}
                <span className="ml-1.5 text-xs font-normal text-mute">{readoutSample.tmb.unit}</span>
              </span>
            </motion.div>
            <InfoBox text={readoutSample.tmb.hint} />
          </div>
          <TmbGauge active={active} />
        </section>

        {/* GET */}
        <section className="border-t border-line pt-8">
          <h3 className="font-display text-base text-ink">Gasto energético total</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={active ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="inline-flex rounded border-2 border-ember/50 px-4 py-2"
            >
              <span className="font-mono text-xl font-semibold text-ember sm:text-2xl">
                {getDisplay}
                <span className="ml-1.5 text-xs font-normal text-mute">{readoutSample.get.unit}</span>
              </span>
            </motion.div>
            <InfoBox text={readoutSample.get.hint} />
          </div>
        </section>

        {/* Seu exame */}
        <section className="border-t border-line pt-8">
          <h3 className="font-display text-base text-ink">Seu Exame</h3>
          <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto pb-1">
            <ValueChip label="RQ" value={readoutSample.exam.rq} active={active} decimals={2} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={active ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="min-w-[120px] shrink-0 rounded border border-ember/35 bg-snow px-2.5 py-2 text-center"
            >
              <p className="font-mono text-[9px] uppercase tracking-wider text-mute">Consumo</p>
              <p className="mt-1 font-mono text-[11px] leading-snug text-ink">
                <span className="text-ember">Gordura {fatDisplay}%</span>
                <br />
                <span className="text-mute">Carboidratos {carbsDisplay}%</span>
              </p>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="bg-ember"
                  initial={{ width: 0 }}
                  animate={active ? { width: `${readoutSample.exam.fat}%` } : { width: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className="bg-teal"
                  initial={{ width: 0 }}
                  animate={active ? { width: `${readoutSample.exam.carbs}%` } : { width: 0 }}
                  transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
            <ValueChip label="VO₂" value={readoutSample.exam.vo2} unit={readoutSample.exam.vo2Unit} active={active} delay={0.18} decimals={2} />
            <ValueChip label="Ve" value={readoutSample.exam.ve} unit={readoutSample.exam.veUnit} active={active} delay={0.24} decimals={2} />
          </div>
          <div className="mt-4">
            <InfoBox text={readoutSample.exam.hint} />
          </div>
          <MetabolicChart active={active} />
        </section>

        {/* Tabela exercícios */}
        <section className="border-t border-line pt-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-line text-mute">
                  <th className="pb-2 pr-3 font-medium">Exercício Físico</th>
                  <th className="pb-2 px-2 text-center font-medium">METs</th>
                  <th className="pb-2 px-2 text-center font-medium" colSpan={3}>
                    Gasto calórico (KCal)
                  </th>
                </tr>
                <tr className="border-b border-line text-mute">
                  <th />
                  <th />
                  <th className="py-1.5 px-2 text-center font-normal">20 min</th>
                  <th className="py-1.5 px-2 text-center font-normal">30 min</th>
                  <th className="py-1.5 px-2 text-center font-normal">60 min</th>
                </tr>
              </thead>
              <tbody>
                {readoutSample.exercises.map((row, i) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={active ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.8 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line/70"
                  >
                    <td className="py-2 pr-3 font-medium uppercase text-ink">{row.name}</td>
                    <td className="px-2 py-2 text-center text-mute">{row.mets}</td>
                    <td className="px-2 py-2 text-center font-mono text-ember">{row.kcal20}</td>
                    <td className="px-2 py-2 text-center font-mono text-ember">{row.kcal30}</td>
                    <td className="px-2 py-2 text-center font-mono text-ember">{row.kcal60}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[10px] text-mute">{readoutSample.exerciseFootnote}</p>
          <div className="mt-4">
            <InfoBox text={readoutSample.exerciseHint} />
          </div>
        </section>
      </div>
    </div>
  )
}
