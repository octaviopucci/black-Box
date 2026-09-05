'use client'

import { ease } from '@/components/quiz/VisualFrame'
import type { QuestionStep } from '@/data/quiz'
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

export function QuestionView({
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
        <motion.p variants={item} className="mt-3 text-base font-medium text-paper/70">
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
                    : 'border-paper/15 bg-paper/[0.03] hover:border-signal/70 hover:bg-signal/5'
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
