import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotion } from '../hooks/useMotion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  /** When true, animates on mount (for above-the-fold content). */
  immediate?: boolean
}

export function Reveal({ children, className, delay = 0, immediate = false }: Props) {
  const { reduced } = useMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </motion.div>
  )
}
