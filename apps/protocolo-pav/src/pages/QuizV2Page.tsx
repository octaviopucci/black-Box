import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buildSteps, offerCopy, type PitchStep, type QuestionStep } from '@/data/quiz'
import { quizVisuals } from '@/data/quizVisual'
import { brand } from '@/data/site'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.42, ease },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
}

const item = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease } },
}

export function QuizV2Page() {
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
    window.setTimeout(() => next(), 180)
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(225,6,0,0.22),transparent_55%),linear-gradient(180deg,#050505_0%,#0a0505_45%,#050505_100%)]"
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-[0.035] bg-grain" />

      <div className="fixed inset-x-0 top-0 z-50 h-[4px] bg-white/5">
        <motion.div
          className="h-full bg-signal shadow-[0_0_18px_rgba(225,6,0,0.55)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <header className="relative z-20 mx-auto flex max-w-xl items-center justify-between px-4 pb-2 pt-6 sm:px-6">
        <Link to="/quiz-v2" className="opacity-90 transition hover:opacity-100">
          <img src={brand.logo} alt="BASE" className="h-6 w-auto" draggable={false} />
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          {Math.round(progress)}%
        </p>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-xl flex-col px-4 pb-24 pt-2 sm:px-6">
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
          {step?.type === 'offer' && <OfferView key="offer" answers={answers} />}
        </AnimatePresence>
      </main>
    </div>
  )
}

function VisualFrame({
  stepId,
  className = '',
}: {
  stepId: string
  className?: string
}) {
  const visual = quizVisuals[stepId]
  if (!visual) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease }}
      className={`relative overflow-hidden ${className}`}
    >
      <img
        src={visual.src}
        alt={visual.alt}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-signal to-transparent opacity-80"
      />
    </motion.div>
  )
}

function PitchView({ step, onContinue }: { step: PitchStep; onContinue: () => void }) {
  const visual = quizVisuals[step.id]
  const hero = visual?.placement === 'hero'

  return (
    <motion.section {...fadeUp} className="flex flex-1 flex-col py-2">
      {hero ? (
        <VisualFrame
          stepId={step.id}
          className="mb-6 aspect-[16/10] w-full border border-white/10"
        />
      ) : null}

      <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-1 flex-col">
        {step.kicker ? (
          <motion.p
            variants={item}
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal"
          >
            {step.kicker}
          </motion.p>
        ) : null}

        <motion.h1
          variants={item}
          className="mt-4 font-display text-[clamp(1.85rem,7vw,2.75rem)] font-bold leading-[1.02] tracking-tight text-balance"
        >
          {step.title}
          {step.highlight ? (
            <span className="mt-2 block text-signal">{step.highlight}</span>
          ) : null}
        </motion.h1>

        {!hero && visual ? (
          <motion.div variants={item} className="mt-6">
            <VisualFrame
              stepId={step.id}
              className={
                visual.placement === 'side'
                  ? 'aspect-[4/5] max-h-[280px] w-full border border-white/10 sm:max-w-[240px]'
                  : 'aspect-[21/9] w-full border border-white/10'
              }
            />
          </motion.div>
        ) : null}

        {step.note ? (
          <motion.div
            variants={item}
            className="mt-6 border border-signal/40 bg-signal/10 px-4 py-4"
          >
            <p className="font-display text-lg font-bold text-paper">{step.note.title}</p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-mist">
              {step.note.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </motion.div>
        ) : null}

        {step.body.length ? (
          <motion.div variants={item} className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-mist">
            {step.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </motion.div>
        ) : null}

        {step.bullets?.length ? (
          <motion.ul variants={item} className="mt-6 space-y-2.5">
            {step.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-[1.05rem] leading-relaxed text-paper">
                <span className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
        ) : null}

        {step.emphasis ? (
          <motion.p
            variants={item}
            className="mt-6 border-l-2 border-signal pl-3 text-[1.05rem] font-semibold leading-relaxed text-paper"
          >
            {step.emphasis}
          </motion.p>
        ) : null}

        <motion.button
          variants={item}
          type="button"
          onClick={onContinue}
          whileTap={{ scale: 0.985 }}
          className="mt-10 w-full bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_28px_rgba(225,6,0,0.35)] transition hover:bg-signalHot"
        >
          {step.cta}
        </motion.button>
      </motion.div>
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
    <motion.section {...fadeUp} className="flex flex-1 flex-col justify-center py-4">
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.h2
          variants={item}
          className="font-display text-[clamp(1.6rem,5.8vw,2.3rem)] font-bold leading-tight tracking-tight text-balance"
        >
          {step.title}
        </motion.h2>
        <motion.p variants={item} className="mt-3 text-base font-medium text-white/70">
          {step.helper}
        </motion.p>
        <motion.div variants={item} className="mt-8 space-y-3">
          {step.options.map((opt, i) => {
            const active = selected === opt.id
            return (
              <motion.button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease }}
                whileTap={{ scale: 0.985 }}
                className={`group relative w-full overflow-hidden border px-4 py-4 text-left transition ${
                  active
                    ? 'border-signal bg-signal/15'
                    : 'border-white/15 bg-white/[0.03] hover:border-signal/70 hover:bg-signal/5'
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-[3px] bg-signal transition ${
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`}
                />
                <span className="relative text-[0.98rem] leading-snug text-paper">{opt.label}</span>
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>
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

  const primaryCheckout =
    offerCopy.plans.find((p) => p.highlight)?.checkout ?? offerCopy.plans[0].checkout

  return (
    <motion.section {...fadeUp} className="pb-6 pt-2">
      <VisualFrame stepId="offer" className="mb-6 aspect-[16/10] w-full border border-white/10" />

      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
        {offerCopy.kicker}
      </p>
      <h2 className="mt-3 font-display text-[clamp(1.8rem,6vw,2.6rem)] font-bold leading-tight">
        {offerCopy.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-mist">{offerCopy.subtitle}</p>

      {mirrorBits.length ? (
        <div className="mt-5 space-y-2 border-l-2 border-signal/60 pl-3 text-sm leading-relaxed text-paper">
          {mirrorBits.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-8 text-center">
        <p className="font-display text-xl font-bold text-signal">{offerCopy.luckTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{offerCopy.luckBody}</p>
      </div>

      <div className="mt-8 border border-white/10 bg-white/[0.03] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
          {offerCopy.stackTitle}
        </p>
        <ul className="mt-4 space-y-2.5">
          {offerCopy.stack.map((itemText) => (
            <li key={itemText} className="flex gap-2 text-sm text-mist">
              <span className="text-signal">✓</span>
              <span>{itemText}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-ash">{offerCopy.valueBridge}</p>
      </div>

      <div className="mt-6 space-y-3">
        {offerCopy.plans.map((p) => (
          <motion.a
            key={p.id}
            href={p.checkout}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            className={`block border p-5 transition ${
              p.highlight
                ? 'border-signal bg-signal/10 shadow-[0_0_24px_rgba(225,6,0,0.18)]'
                : 'border-white/12 bg-ink hover:border-signal/50'
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
          </motion.a>
        ))}
      </div>

      <div className="mt-6 border border-white/15 bg-white/[0.04] p-5">
        <p className="text-center font-display text-xl font-bold text-paper">
          {offerCopy.guaranteeTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{offerCopy.guaranteeBody}</p>
      </div>

      <a
        href={primaryCheckout}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_28px_rgba(225,6,0,0.35)] hover:bg-signalHot"
      >
        {offerCopy.cta}
      </a>
      <a
        href={`${brand.cadastroExternal}?next=/planos`}
        className="mt-3 flex w-full items-center justify-center border border-white/15 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper hover:border-signal/50"
      >
        Prefiro criar conta antes
      </a>

      <section className="mt-12 border-t border-white/10 pt-10">
        <VisualFrame stepId="social-proof" className="mb-6 aspect-[21/9] w-full border border-white/10" />
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

      <section className="mt-12 border-t border-white/10 pt-10">
        <div className="mb-6 flex items-end gap-4">
          <VisualFrame
            stepId="how-it-works"
            className="h-28 w-24 shrink-0 border border-white/10"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            {offerCopy.mentorTitle}
          </p>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-ash">
          {offerCopy.mentorBody.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-white/10 pt-10">
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
        href={primaryCheckout}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-signalHot"
      >
        {offerCopy.cta}
      </a>
      <Link
        to="/planos"
        className="mt-3 flex w-full items-center justify-center border border-white/15 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper hover:border-signal/50"
      >
        Ver planos com calma
      </Link>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-ash">
        {offerCopy.disclaimer}
      </p>
    </motion.section>
  )
}
