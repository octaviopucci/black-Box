'use client'

import { quizVisuals } from '@/data/quizVisual'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export function VisualFrame({
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
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease }}
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={visual.alt}
    >
      <div className="absolute inset-0" style={{ background: visual.gradient }} />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40"
      >
        {visual.alt}
      </div>
    </motion.div>
  )
}

export { ease }
