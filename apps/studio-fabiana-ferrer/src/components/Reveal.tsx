import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useMotion } from '@/hooks/useMotion'

export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const { fade } = useMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ ...fade, delay }}
    >
      {children}
    </motion.div>
  )
}
