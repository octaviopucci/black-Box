'use client'

import { ease, VisualFrame } from '@/components/quiz/VisualFrame'
import { quizVisuals } from '@/data/quizVisual'
import type { PitchStep } from '@/data/quiz'
import { motion } from 'framer-motion'

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

export function PitchView({
  step,
  onContinue,
}: {
  step: PitchStep
  onContinue: () => void
}) {
  const visual = quizVisuals[step.id]
  const hero = visual?.placement === 'hero'

  return (
    <motion.section {...fadeUp} className="flex flex-1 flex-col py-2">
      {hero ? (
        <VisualFrame stepId={step.id} className="mb-6 aspect-[16/10] w-full border border-paper/10" />
      ) : null}

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="flex flex-1 flex-col"
      >
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
          className="font-display mt-4 text-[clamp(1.85rem,7vw,2.75rem)] font-bold leading-[1.02] tracking-tight text-balance"
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
                  ? 'aspect-[4/5] max-h-[280px] w-full border border-paper/10 sm:max-w-[240px]'
                  : 'aspect-[21/9] w-full border border-paper/10'
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
          <motion.div
            variants={item}
            className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-mist"
          >
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
          className="mt-10 w-full bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink shadow-[0_0_28px_rgba(245,213,71,0.25)] transition hover:bg-signal-hot"
        >
          {step.cta}
        </motion.button>
      </motion.div>
    </motion.section>
  )
}
