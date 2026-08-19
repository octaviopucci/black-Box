import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotion } from '../../hooks/useMotion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: Props) {
  const { reduced, fadeUp } = useMotion()

  return (
    <motion.div
      className={className}
      {...fadeUp}
      transition={
        reduced ? undefined : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      {children}
    </motion.div>
  )
}
