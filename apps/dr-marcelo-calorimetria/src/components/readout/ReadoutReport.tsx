import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { readoutSample } from '../../data/readoutSample'
import { useCountUp } from '../../hooks/useCountUp'
import { useReportStage } from '../../hooks/useReportStage'
import { MetabolicChart } from './MetabolicChart'

const silk = [0.22, 1, 0.36, 1] as const

function InfoBox({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5 rounded border border-[#E8EBE9] bg-[#F4F6F5] p-3">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" strokeWidth={2} aria-hidden />
      <p className="text-[11px] leading-relaxed text-[#5C6562]">{text}</p>
    </div>
  )
}

function ValueBox({
  value,
  unit,
  active,
  delay = 0,
  decimals = 0,
}: {
  value: number
  unit: string
  active: boolean
  delay?: number
  decimals?: number
}) {
  const display = useCountUp(value, active, { duration: 1.8, decimals, delay })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={active ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: silk }}
      className="inline-flex shrink-0 rounded border-2 border-ember/55 bg-snow px-4 py-2.5 shadow-[0_1px_0_rgba(198,100,46,0.08)]"
    >
      <span className="font-mono text-xl font-semibold tabular-nums text-ember sm:text-[1.65rem]">
        {display}
        <span className="ml-1.5 text-[11px] font-normal text-mute">{unit}</span>
      </span>
    </motion.div>
  )
}

function MetricChip({
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
  const display = useCountUp(value, active, { duration: 1.5, decimals, delay })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: silk }}
      className="min-w-[76px] shrink-0 rounded border border-ember/40 bg-snow px-2 py-2 text-center"
    >
      <p className="font-mono text-[8px] font-medium uppercase tracking-wider text-[#8A9290]">{label}</p>
      <p className="mt-1 font-mono text-[13px] font-semibold tabular-nums text-ember">
        {display}
        {unit && <span className="mt-0.5 block text-[8px] font-normal leading-tight text-mute">{unit}</span>}
      </p>
    </motion.div>
  )
}

function TmbGauge({ active }: { active: boolean }) {
  const { tmb } = readoutSample
  const pinPct = Math.min(Math.max((tmb.value / tmb.predicted) * 100, 6), 194)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-5"
    >
      <div className="relative h-3.5 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-300/90 via-emerald-400/90 to-rose-400/90" />
        <div className="absolute inset-y-0 left-[33%] w-px bg-white/40" />
        <div className="absolute inset-y-0 left-[66%] w-px bg-white/40" />
        <motion.div
          className="absolute top-1/2 z-10 -translate-y-1/2"
          initial={{ left: '2%' }}
          animate={active ? { left: `${pinPct}%` } : { left: '2%' }}
          transition={{ duration: 1.6, delay: 1.1, ease: silk }}
          style={{ marginLeft: -11 }}
        >
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] drop-shadow-md" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3DAA5C" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
        </motion.div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] tabular-nums text-mute">
        <span>0</span>
        <span>100</span>
        <span>200</span>
      </div>
      <p className="mt-1 text-center font-mono text-[10px] text-[#5C6562]">
        TMB Previsto: {tmb.predicted.toLocaleString('pt-BR')} KCal/dia
      </p>
    </motion.div>
  )
}

function PatientGrid({ active }: { active: boolean }) {
  const p = readoutSample.patient
  const fields = [
    { label: 'Nome', value: p.name, wide: true },
    { label: 'Data do Exame', value: p.examDate },
    { label: 'Data de Nascimento', value: p.birthDate },
    { label: 'Sexo', value: p.sex },
    { label: 'Altura (cm)', value: String(p.heightCm) },
    { label: 'Peso (kg)', value: String(p.weightKg) },
    { label: 'IMC', value: String(p.bmi) },
    { label: 'Estilo de vida', value: p.lifestyle, wide: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: silk }}
      className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line pb-6 sm:grid-cols-4"
    >
      {fields.map((f, i) => (
        <motion.div
          key={f.label}
          initial={{ opacity: 0, y: 6 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.04, ease: silk }}
          className={f.wide ? 'col-span-2 sm:col-span-4' : ''}
        >
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#8A9290]">{f.label}</p>
          <p className="mt-0.5 text-[13px] font-medium text-ink">{f.value}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export function ReadoutReport() {
  const headerStage = useReportStage({ amount: 0.3 })
  const tmbStage = useReportStage({ amount: 0.5 })
  const getStage = useReportStage({ amount: 0.5 })
  const examStage = useReportStage({ amount: 0.45 })
  const tableStage = useReportStage({ amount: 0.35, margin: '0px 0px -5% 0px' })

  const fatDisplay = useCountUp(readoutSample.exam.fat, examStage.active, { duration: 1.6, decimals: 1, delay: 0.15 })
  const carbsDisplay = useCountUp(readoutSample.exam.carbs, examStage.active, { duration: 1.6, decimals: 1, delay: 0.28 })

  return (
    <div className="mt-12 overflow-hidden rounded-md border border-line bg-snow shadow-soft">
      {/* Report header */}
      <div ref={headerStage.ref} className="border-b border-line bg-gradient-to-b from-[#F7F9F8] to-snow px-4 py-4 sm:px-6">
        <h3 className="font-display text-lg text-ink sm:text-xl">Exame de Calorimetria Indireta</h3>
        <p className="mt-1 text-[11px] text-mute">Laudo ilustrativo — paciente fictício para demonstração</p>
        <div className="mt-5">
          <PatientGrid active={headerStage.active} />
        </div>
      </div>

      <div className="space-y-0 p-4 sm:p-6">
        {/* TMB */}
        <section ref={tmbStage.ref} className="border-b border-line py-7">
          <h4 className="font-display text-[15px] font-medium text-ink">Taxa Metabólica Basal</h4>
          <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
            <ValueBox
              value={readoutSample.tmb.value}
              unit={readoutSample.tmb.unit}
              active={tmbStage.active}
            />
            <InfoBox text={readoutSample.tmb.hint} />
          </div>
          <TmbGauge active={tmbStage.active} />
        </section>

        {/* GET */}
        <section ref={getStage.ref} className="border-b border-line py-7">
          <h4 className="font-display text-[15px] font-medium text-ink">Gasto energético total</h4>
          <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
            <ValueBox
              value={readoutSample.get.value}
              unit={readoutSample.get.unit}
              active={getStage.active}
              delay={0.1}
            />
            <InfoBox text={readoutSample.get.hint} />
          </div>
        </section>

        {/* Seu exame */}
        <section ref={examStage.ref} className="border-b border-line py-7">
          <h4 className="font-display text-[15px] font-medium text-ink">Seu Exame</h4>

          <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <MetricChip label="RQ" value={readoutSample.exam.rq} active={examStage.active} decimals={2} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={examStage.active ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1, ease: silk }}
              className="shrink-0 rounded border border-ember/40 bg-snow px-2 py-2 text-center"
            >
              <p className="font-mono text-[8px] font-medium uppercase tracking-wider text-[#8A9290]">Consumo</p>
              <p className="mt-1 font-mono text-[8px] uppercase text-[#8A9290]">Gordura</p>
              <p className="font-mono text-[13px] font-semibold tabular-nums text-ember">{fatDisplay}%</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={examStage.active ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.18, ease: silk }}
              className="shrink-0 rounded border border-ember/40 bg-snow px-2 py-2 text-center"
            >
              <p className="font-mono text-[8px] font-medium uppercase tracking-wider text-[#8A9290]">Consumo</p>
              <p className="mt-1 font-mono text-[8px] uppercase text-[#8A9290]">Carboidratos</p>
              <p className="font-mono text-[13px] font-semibold tabular-nums text-ember">{carbsDisplay}%</p>
            </motion.div>
            <MetricChip
              label="VO₂"
              value={readoutSample.exam.vo2}
              unit={readoutSample.exam.vo2Unit}
              active={examStage.active}
              delay={0.22}
              decimals={2}
            />
            <MetricChip
              label="Ve"
              value={readoutSample.exam.ve}
              unit={readoutSample.exam.veUnit}
              active={examStage.active}
              delay={0.3}
              decimals={2}
            />
          </div>

          <div className="mt-4">
            <InfoBox text={readoutSample.exam.hint} />
          </div>

          {/* Chart — own intersection observer, starts ONLY when visible */}
          <MetabolicChart />
        </section>

        {/* Tabela */}
        <section ref={tableStage.ref} className="py-7">
          <h4 className="font-display text-[15px] font-medium text-ink">Exercício Físico</h4>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-mute">Gasto calórico (KCal)</p>

          <div className="mt-4 overflow-x-auto rounded border border-line/80">
            <table className="w-full min-w-[540px] border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-line bg-[#F7F9F8] text-[#5C6562]">
                  <th className="px-3 py-2.5 font-medium">Exercício Físico</th>
                  <th className="px-2 py-2.5 text-center font-medium">METs</th>
                  <th className="px-2 py-2.5 text-center font-normal">20 min</th>
                  <th className="px-2 py-2.5 text-center font-normal">30 min</th>
                  <th className="px-2 py-2.5 text-center font-normal">60 min</th>
                </tr>
              </thead>
              <tbody>
                {readoutSample.exercises.map((row, i) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={tableStage.active ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.08 + i * 0.045, ease: silk }}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="px-3 py-2.5 font-medium text-ink">{row.name}</td>
                    <td className="px-2 py-2.5 text-center tabular-nums text-mute">{row.mets}</td>
                    <td className="px-2 py-2.5 text-center font-mono tabular-nums text-ember">{row.kcal20}</td>
                    <td className="px-2 py-2.5 text-center font-mono tabular-nums text-ember">{row.kcal30}</td>
                    <td className="px-2 py-2.5 text-center font-mono tabular-nums text-ember">{row.kcal60}</td>
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
