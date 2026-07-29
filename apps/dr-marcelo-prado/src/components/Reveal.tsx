import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionEyebrow({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] ${
        light ? 'text-signal-soft' : 'text-celadon-deep'
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${light ? 'bg-signal animate-pulse-node' : 'bg-signal-deep'}`}
        aria-hidden
      />
      {children}
    </p>
  )
}
