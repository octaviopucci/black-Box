import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  buildSteps,
  diagnose,
  offerCopy,
  quizIntro,
  type Diagnosis,
} from '@/data/quiz'
import { brand } from '@/data/site'

const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export function QuizPage() {
  const steps = useMemo(() => buildSteps(), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const step = steps[index]
  const progress = ((index + 1) / steps.length) * 100

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  useEffect(() => {
    if (step?.type !== 'analyzing') return
    const t = window.setTimeout(() => {
      setDiagnosis(diagnose(answers))
      setIndex((i) => i + 1)
    }, 2200)
    return () => window.clearTimeout(t)
  }, [step, answers])

  const answer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    window.setTimeout(() => setIndex((i) => i + 1), 180)
  }

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1))

  return (
    <div className="min-h-dvh bg-ink text-paper">
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-steel">
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
          {index + 1}/{steps.length}
        </p>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col px-4 pb-16 pt-4 sm:px-6">
        <AnimatePresence mode="wait">
          {step?.type === 'intro' && (
            <motion.section key="intro" {...fade} className="flex flex-1 flex-col justify-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
                {quizIntro.kicker}
              </p>
              <h1 className="mt-5 font-display text-[clamp(2rem,8vw,3.25rem)] font-bold leading-[0.98] tracking-tight">
                {quizIntro.title}
                <span className="mt-2 block text-signal">{quizIntro.highlight}</span>
              </h1>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-mist">
                {quizIntro.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-8 space-y-2">
                {quizIntro.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-ash">
                    <span className="text-will">▸</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={next}
                className="mt-10 w-full bg-signal py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-signalHot"
              >
                {quizIntro.cta}
              </button>
              <p className="mt-4 text-center text-xs text-ash">
                Grátis. Sem login. Só conversa sincera.
              </p>
            </motion.section>
          )}

          {step?.type === 'question' && (
            <motion.section
              key={step.question.id}
              {...fade}
              className="flex flex-1 flex-col justify-center"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                Me conta
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {step.question.title}
              </h2>
              {step.question.subtitle ? (
                <p className="mt-2 text-sm text-ash">{step.question.subtitle}</p>
              ) : (
                <p className="mt-2 text-sm text-will/90">Escolhe uma e a gente segue</p>
              )}
              <div className="mt-8 space-y-3">
                {step.question.options.map((opt) => {
                  const selected = answers[step.question.id] === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => answer(step.question.id, opt.id)}
                      className={`w-full border px-4 py-4 text-left transition ${
                        selected
                          ? 'border-signal bg-signal/15'
                          : 'border-line bg-panel/70 hover:border-signal/50'
                      }`}
                    >
                      <span className="font-display text-base font-semibold leading-snug">
                        {opt.label}
                      </span>
                      {opt.hint ? (
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                          {opt.hint}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </motion.section>
          )}

          {step?.type === 'interstitial' && (
            <motion.section
              key={step.interstitial.id}
              {...fade}
              className="flex flex-1 flex-col justify-center"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
                {step.interstitial.kicker}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {step.interstitial.title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-mist">
                {step.interstitial.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {step.interstitial.bullets ? (
                <ul className="mt-8 space-y-3 border-l-2 border-signal/60 pl-4">
                  {step.interstitial.bullets.map((b) => (
                    <li key={b} className="text-sm leading-relaxed text-ash">
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              <button
                type="button"
                onClick={next}
                className="mt-10 w-full bg-signal py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-signalHot"
              >
                {step.interstitial.cta}
              </button>
            </motion.section>
          )}

          {step?.type === 'analyzing' && (
            <motion.section
              key="analyzing"
              {...fade}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div className="h-14 w-14 animate-pulse rounded-full border-2 border-signal/40 border-t-signal" />
              <h2 className="mt-8 font-display text-2xl font-bold">Deixa eu juntar o que você falou…</h2>
              <p className="mt-3 max-w-sm text-sm text-ash">
                Tô olhando o padrão, o tempo de luta e o que você quer reconstruir — pra te falar
                com honestidade.
              </p>
            </motion.section>
          )}

          {step?.type === 'result' && diagnosis && (
            <motion.section key="result" {...fade} className="flex flex-1 flex-col justify-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-will">
                {diagnosis.profile}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {diagnosis.headline}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mist">{diagnosis.summary}</p>

              <div className="mt-8 border border-signal/50 bg-signal/10 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                  O que eu faria no seu lugar
                </p>
                <p className="mt-2 font-display text-2xl font-bold">{diagnosis.protocol}</p>
                <p className="mt-2 text-sm leading-relaxed text-ash">{diagnosis.protocolBlurb}</p>
              </div>

              <p className="mt-6 font-display text-sm font-semibold text-paper">
                Por onde a gente começa:
              </p>
              <ul className="mt-3 space-y-2">
                {diagnosis.next.map((n) => (
                  <li key={n} className="flex gap-2 text-sm text-mist">
                    <span className="text-will">▸</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm leading-relaxed text-signal">{diagnosis.urgency}</p>

              <button
                type="button"
                onClick={next}
                className="mt-8 w-full bg-signal py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-signalHot"
              >
                Quero ver como entrar
              </button>
            </motion.section>
          )}

          {step?.type === 'offer' && (
            <motion.section key="offer" {...fade} className="pb-8 pt-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
                {offerCopy.kicker}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {offerCopy.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-mist">{offerCopy.subtitle}</p>

              {diagnosis ? (
                <p className="mt-4 border-l-2 border-will/50 pl-3 text-sm leading-relaxed text-will">
                  {diagnosis.profile}
                </p>
              ) : null}

              <p className="mt-6 text-sm leading-relaxed text-mist">{offerCopy.mentorNote}</p>

              <div className="mt-8 border border-line bg-panel/80 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                  {offerCopy.stackTitle}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {offerCopy.stack.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-mist">
                      <span className="text-will">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 text-sm leading-relaxed text-ash">
                Escolhe o ritmo que cabe na sua vida. Não o que impressiona. O que você consegue
                sustentar.
              </p>

              <div className="mt-4 space-y-3">
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
                    <p className="mt-4 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper">
                      Entrar no {p.name} →
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-6 border border-will/35 bg-willDim/35 p-5 text-center">
                <p className="font-display text-xl font-bold">{offerCopy.guaranteeTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{offerCopy.guaranteeBody}</p>
              </div>

              <a
                href={offerCopy.cadastro}
                className="mt-8 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-signalHot"
              >
                {offerCopy.cta}
              </a>
              <a
                href={brand.cadastroExternal}
                className="mt-3 flex w-full items-center justify-center border border-line py-3.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-paper hover:border-signal/50"
              >
                {offerCopy.secondaryCta}
              </a>

              <section className="mt-14 border-t border-line pt-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
                  Só pra deixar claro
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold">
                  Eu não te prometo virar outra pessoa em 40 dias.
                </h3>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-ash">
                  <p>
                    Eu te ofereço o que me segurou: o <strong className="text-paper">BASE</strong>,
                    começando pelo <strong className="text-paper">PAV</strong> — o protocolo
                    antivício. Os outros vêm depois.
                  </p>
                  <p>
                    Se você sentir que isso é o próximo passo seu… não é coincidência. É a parte
                    sua que já cansou de cair sozinha pedindo estrutura.
                  </p>
                  <p className="text-mist">Sem base, a gente não sustenta. Com BASE, dá pra atravessar.</p>
                </div>
                <a
                  href={offerCopy.cadastro}
                  className="mt-8 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-signalHot"
                >
                  Decidi começar
                </a>
              </section>

              <p className="mt-10 text-center text-[11px] leading-relaxed text-ash">
                {offerCopy.disclaimer}
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
