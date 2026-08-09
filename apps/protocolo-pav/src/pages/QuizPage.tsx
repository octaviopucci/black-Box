import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buildSteps, offerCopy, type PitchStep, type QuestionStep } from '@/data/quiz'
import { brand } from '@/data/site'

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
}

export function QuizPage() {
  const steps = useMemo(() => buildSteps(), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const step = steps[index]
  const progress = step?.progress ?? ((index + 1) / steps.length) * 100

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1))

  const answer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    window.setTimeout(() => next(), 160)
  }

  return (
    <div className="min-h-dvh bg-ink text-paper">
      <div className="fixed inset-x-0 top-0 z-50 h-[5px] bg-[#2a1515]">
        <motion.div
          className="h-full bg-signal"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      <header className="mx-auto flex max-w-xl items-center justify-between px-4 pb-2 pt-5 sm:px-6">
        <Link to="/" className="opacity-90 transition hover:opacity-100">
          <img src={brand.logo} alt="BASE" className="h-6 w-auto" draggable={false} />
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
          {Math.round(progress)}%
        </p>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col px-4 pb-20 pt-3 sm:px-6">
        <AnimatePresence mode="wait">
          {step?.type === 'pitch' && (
            <PitchView key={step.id} step={step} onContinue={next} />
          )}

          {step?.type === 'question' && (
            <QuestionView
              key={step.id}
              step={step}
              selected={answers[step.id]}
              onSelect={(id) => answer(step.id, id)}
            />
          )}

          {step?.type === 'offer' && (
            <OfferView key="offer" answers={answers} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function PitchView({ step, onContinue }: { step: PitchStep; onContinue: () => void }) {
  return (
    <motion.section {...fade} className="flex flex-1 flex-col justify-center py-4">
      {step.kicker ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          {step.kicker}
        </p>
      ) : null}

      <h1 className="mt-4 font-display text-[clamp(1.75rem,6.5vw,2.6rem)] font-bold leading-[1.05] tracking-tight">
        {step.title}
        {step.highlight ? (
          <span className="mt-2 block text-signal">{step.highlight}</span>
        ) : null}
      </h1>

      {step.note ? (
        <div className="mt-6 rounded-md border border-[#fff08f]/40 bg-[#ffdd00] px-4 py-4 text-[#131313]">
          <p className="font-display text-lg font-bold">{step.note.title}</p>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            {step.note.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      ) : null}

      {step.body.length ? (
        <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-mist">
          {step.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      ) : null}

      {step.bullets?.length ? (
        <ul className="mt-6 space-y-2">
          {step.bullets.map((b) => (
            <li key={b} className="text-[1.05rem] leading-relaxed text-paper">
              <span className="text-signal">· </span>
              {b}
            </li>
          ))}
        </ul>
      ) : null}

      {step.emphasis ? (
        <p className="mt-6 text-[1.05rem] font-semibold leading-relaxed text-signal">
          {step.emphasis}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        className="mt-10 w-full animate-pulseSoft bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-signalHot"
      >
        {step.cta}
      </button>
    </motion.section>
  )
}

function QuestionView({
  step,
  selected,
  onSelect,
}: {
  step: QuestionStep
  selected?: string
  onSelect: (id: string) => void
}) {
  return (
    <motion.section {...fade} className="flex flex-1 flex-col justify-center py-4">
      <h2 className="font-display text-[clamp(1.55rem,5.5vw,2.2rem)] font-bold leading-tight tracking-tight">
        {step.title}
      </h2>
      <p className="mt-3 text-base font-medium text-[#facc15]">{step.helper}</p>
      <div className="mt-7 space-y-3">
        {step.options.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`w-full border px-4 py-4 text-left transition ${
                active
                  ? 'border-signal bg-signal/15'
                  : 'border-signal/70 bg-panel/80 hover:border-signal'
              }`}
            >
              <span className="text-[0.98rem] leading-snug text-paper">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </motion.section>
  )
}

function OfferView({ answers }: { answers: Record<string, string> }) {
  const goal = answers.objetivo
  const block = answers.bloqueio
  const pattern = answers.padrao

  const mirrorBits = [
    goal === 'habitos' && 'Você pediu rotina e foco.',
    goal === 'identidade' && 'Você pediu se respeitar de novo.',
    goal === 'vida' && 'Você pediu presença, sem esconder queda.',
    block === 'perdido' && 'Disse que tá perdido. Estrutura resolve o "por onde".',
    block === 'distracao' && 'Disse que a fissura te pega. O PAV existe pra essa hora.',
    block === 'comparacao' && 'Disse que trava e volta pro alívio. Progresso visível corta isso.',
    pattern && 'O padrão que você marcou é o que a gente ataca primeiro no PAV.',
  ].filter(Boolean) as string[]

  return (
    <motion.section {...fade} className="pb-6 pt-2">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
        {offerCopy.kicker}
      </p>
      <h2 className="mt-3 font-display text-[clamp(1.8rem,6vw,2.6rem)] font-bold leading-tight">
        {offerCopy.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-mist">{offerCopy.subtitle}</p>

      {mirrorBits.length ? (
        <div className="mt-5 space-y-2 border-l-2 border-will/50 pl-3 text-sm leading-relaxed text-will">
          {mirrorBits.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-8 text-center">
        <p className="font-display text-xl font-bold text-signal">{offerCopy.luckTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{offerCopy.luckBody}</p>
      </div>

      <div className="mt-8 border border-line bg-panel/80 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
          {offerCopy.stackTitle}
        </p>
        <ul className="mt-4 space-y-2.5">
          {offerCopy.stack.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-mist">
              <span className="text-will">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-ash">{offerCopy.valueBridge}</p>
      </div>

      <div className="mt-6 space-y-3">
        {offerCopy.plans.map((p) => (
          <a
            key={p.id}
            href={offerCopy.cadastro}
            className={`block border p-5 transition hover:border-signal/60 ${
              p.highlight ? 'border-signal bg-signal/10' : 'border-line bg-ink'
            }`}
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                  {p.badge}
                </p>
                <p className="mt-1 font-display text-xl font-bold">{p.name}</p>
              </div>
              <p className="font-display text-2xl font-bold">
                {p.price}
                <span className="ml-1 text-xs font-normal text-ash">{p.cadence}</span>
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-ash">
              {p.perks.slice(0, 4).map((perk) => (
                <li key={perk}>· {perk}</li>
              ))}
            </ul>
            <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-paper">
              {offerCopy.cta}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-6 border border-will/35 bg-willDim/35 p-5">
        <p className="text-center font-display text-xl font-bold text-[#facc15]">
          {offerCopy.guaranteeTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{offerCopy.guaranteeBody}</p>
      </div>

      <a
        href={offerCopy.cadastro}
        className="mt-8 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-signalHot"
      >
        {offerCopy.cta}
      </a>

      <section className="mt-12 border-t border-line pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          Quem já passou por isso
        </p>
        <div className="mt-6 space-y-8">
          {offerCopy.proofs.map((t) => (
            <blockquote key={t.name} className="border-l-2 border-signal/50 pl-4">
              <p className="text-sm leading-relaxed text-mist">"{t.quote}"</p>
              <footer className="mt-3">
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="font-mono text-[10px] text-ash">{t.meta}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          {offerCopy.mentorTitle}
        </p>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ash">
          {offerCopy.mentorBody.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          {offerCopy.faqTitle}
        </p>
        <div className="mt-6 space-y-6">
          {offerCopy.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-display text-base font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <a
        href={offerCopy.cadastro}
        className="mt-10 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-signalHot"
      >
        {offerCopy.cta}
      </a>
      <a
        href={brand.cadastroExternal}
        className="mt-3 flex w-full items-center justify-center border border-line py-3.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper hover:border-signal/50"
      >
        {offerCopy.secondaryCta}
      </a>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-ash">
        {offerCopy.disclaimer}
      </p>
    </motion.section>
  )
}
