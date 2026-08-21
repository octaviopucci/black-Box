import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.85, delay, ease: [0.33, 1, 0.38, 1] }}
    >
      {children}
    </motion.div>
  )
}
