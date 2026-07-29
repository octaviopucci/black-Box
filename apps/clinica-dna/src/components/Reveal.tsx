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

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
  align?: 'left' | 'center'
}) {
  return (
    <Reveal className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? (
        <p
          className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.34em] ${
            light ? 'text-aqua-soft' : 'text-aqua-deep'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-semibold leading-[1.02] tracking-tight ${
          light ? 'text-snow' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            light ? 'text-snow/70' : 'text-mute'
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  )
}
