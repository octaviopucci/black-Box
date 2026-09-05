import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Calculator } from 'lucide-react'
import {
  clampInputs,
  computeHarrisBenedict,
  harrisBenedict,
  type HarrisInputs,
  type Sex,
} from '../data/harrisBenedict'
import { useCountUp } from '../hooks/useCountUp'

const silk = [0.22, 1, 0.36, 1] as const

type Step = 'idle' | 'base' | 'weight' | 'height' | 'age' | 'done'

const STEP_ORDER: Step[] = ['base', 'weight', 'height', 'age', 'done']

function formatNum(n: number, decimals = 0) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function Field({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-paper/15 accent-teal-bright"
        />
        <span className="min-w-[4.5rem] text-right font-mono text-sm tabular-nums text-paper">
          {value}
          <span className="ml-0.5 text-[10px] text-paper/45">{unit}</span>
        </span>
      </div>
    </label>
  )
}

export function HarrisBenedictCalc() {
  const [inputs, setInputs] = useState<HarrisInputs>(harrisBenedict.defaults)
  const [step, setStep] = useState<Step>('idle')
  const [running, setRunning] = useState(false)

  const safe = useMemo(() => clampInputs(inputs), [inputs])
  const breakdown = useMemo(() => computeHarrisBenedict(safe), [safe])
  const coef = safe.sex === 'male' ? harrisBenedict.male : harrisBenedict.female

  const showResult = step === 'done'
  const resultDisplay = useCountUp(breakdown.total, showResult, { duration: 1.4, decimals: 0 })

  const runningTotal = useMemo(() => {
    if (step === 'idle') return 0
    if (step === 'base') return breakdown.base
    if (step === 'weight') return breakdown.base + breakdown.weightTerm
    if (step === 'height') return breakdown.base + breakdown.weightTerm + breakdown.heightTerm
    if (step === 'age' || step === 'done') return breakdown.total
    return 0
  }, [breakdown, step])

  const runAnimation = useCallback(() => {
    setRunning(true)
    setStep('base')
  }, [])

  useEffect(() => {
    if (!running || step === 'idle' || step === 'done') return

    const idx = STEP_ORDER.indexOf(step)
    const timer = window.setTimeout(() => {
      const next = STEP_ORDER[idx + 1]
      if (next) setStep(next)
      else setRunning(false)
    }, 680)

    return () => window.clearTimeout(timer)
  }, [running, step])

  useEffect(() => {
    if (step === 'done') setRunning(false)
  }, [step])

  const resetOnInput = () => {
    if (step !== 'idle') setStep('idle')
  }

  const isActive = (s: Step) => STEP_ORDER.indexOf(step) >= STEP_ORDER.indexOf(s) && step !== 'idle'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: silk }}
      className="mt-14 overflow-hidden rounded-md border border-paper/10 bg-ink text-paper shadow-lift"
    >
      <div className="border-b border-paper/10 bg-ink-soft/80 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-teal-bright/30 bg-teal-mist">
            <Calculator className="h-4 w-4 text-teal-bright" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-teal-bright">
              Experimente a fórmula
            </p>
            <h3 className="mt-1 font-display text-xl text-paper sm:text-2xl">{harrisBenedict.title}</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper/65">{harrisBenedict.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="flex gap-2">
            {(['male', 'female'] as Sex[]).map((sex) => (
              <button
                key={sex}
                type="button"
                onClick={() => {
                  resetOnInput()
                  setInputs((prev) => ({ ...prev, sex }))
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-500 ease-silk ${
                  safe.sex === sex
                    ? 'border-teal-bright/50 bg-teal-mist text-teal-bright'
                    : 'border-paper/15 text-paper/60 hover:border-paper/30 hover:text-paper'
                }`}
              >
                {sex === 'male' ? harrisBenedict.male.label : harrisBenedict.female.label}
              </button>
            ))}
          </div>

          <Field
            label="Peso"
            value={safe.weightKg}
            unit="kg"
            min={35}
            max={200}
            onChange={(weightKg) => {
              resetOnInput()
              setInputs((prev) => ({ ...prev, weightKg }))
            }}
          />
          <Field
            label="Altura"
            value={safe.heightCm}
            unit="cm"
            min={130}
            max={220}
            onChange={(heightCm) => {
              resetOnInput()
              setInputs((prev) => ({ ...prev, heightCm }))
            }}
          />
          <Field
            label="Idade"
            value={safe.age}
            unit="anos"
            min={16}
            max={90}
            onChange={(age) => {
              resetOnInput()
              setInputs((prev) => ({ ...prev, age }))
            }}
          />

          <button
            type="button"
            onClick={runAnimation}
            disabled={running}
            className="cta-solid w-full justify-center disabled:opacity-60 sm:w-auto"
          >
            {running ? 'Calculando…' : harrisBenedict.cta}
            {!running && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Formula + result */}
        <div className="rounded border border-paper/10 bg-ink-lift/50 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">Fórmula</p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-paper/75 sm:text-xs">{coef.formula}</p>

          <div className="mt-6 space-y-2.5 font-mono text-[11px] sm:text-xs">
            <FormulaRow
              label="Base"
              value={formatNum(breakdown.base, 2)}
              active={isActive('base')}
              pending={step === 'idle'}
            />
            <FormulaRow
              label={`Peso (${formatNum(coef.weight, 1)} × ${safe.weightKg})`}
              value={`+ ${formatNum(breakdown.weightTerm, 1)}`}
              active={isActive('weight')}
              pending={!isActive('weight') && step !== 'idle'}
            />
            <FormulaRow
              label={`Altura (${formatNum(coef.height, 1)} × ${safe.heightCm})`}
              value={`+ ${formatNum(breakdown.heightTerm, 1)}`}
              active={isActive('height')}
              pending={!isActive('height') && step !== 'idle'}
            />
            <FormulaRow
              label={`Idade (${formatNum(coef.age, 1)} × ${safe.age})`}
              value={formatNum(breakdown.ageTerm, 1)}
              active={isActive('age')}
              pending={!isActive('age') && step !== 'idle'}
            />
          </div>

          <div className="mt-6 border-t border-paper/10 pt-5">
            <AnimatePresence mode="wait">
              {step === 'idle' ? (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-paper/45"
                >
                  Ajuste os dados e calcule para ver a estimativa passo a passo.
                </motion.p>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45">
                    {showResult ? 'Estimativa Harris-Benedict' : 'Somando…'}
                  </p>
                  <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-ember sm:text-5xl">
                    {showResult ? resultDisplay : formatNum(Math.round(runningTotal))}
                    <span className="ml-2 text-sm font-normal text-paper/50">kcal/dia</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden rounded border border-teal-bright/25 bg-teal-mist px-4 py-3"
              >
                <p className="text-sm leading-relaxed text-paper/82">{harrisBenedict.footnote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function FormulaRow({
  label,
  value,
  active,
  pending,
}: {
  label: string
  value: string
  active: boolean
  pending: boolean
}) {
  return (
    <motion.div
      animate={{
        opacity: pending ? 0.35 : 1,
        x: active ? 0 : pending ? 0 : 0,
      }}
      className={`flex items-center justify-between gap-3 rounded px-2 py-1.5 transition-colors duration-500 ${
        active ? 'bg-teal-mist text-teal-bright' : 'text-paper/70'
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="shrink-0 tabular-nums">{value}</span>
    </motion.div>
  )
}
