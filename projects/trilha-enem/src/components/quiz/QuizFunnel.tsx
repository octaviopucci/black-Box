'use client'

import { OfferView } from '@/components/quiz/OfferView'
import { PitchView } from '@/components/quiz/PitchView'
import { QuestionView } from '@/components/quiz/QuestionView'
import { buildSteps } from '@/data/quiz'
import { brand } from '@/data/site'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

export function QuizFunnel() {
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
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(245,213,71,0.12),transparent_55%),linear-gradient(180deg,#050810_0%,#0b1220_45%,#050810_100%)]"
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-[0.04] bg-grain" />

      <div className="fixed inset-x-0 top-0 z-50 h-[4px] bg-paper/5">
        <motion.div
          className="h-full bg-signal shadow-[0_0_18px_rgba(245,213,71,0.45)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <header className="relative z-20 mx-auto flex max-w-xl items-center justify-between px-4 pb-2 pt-6 sm:px-6">
        <p className="font-display text-lg font-bold tracking-tight text-paper">
          {brand.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">
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
