import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function FloatingOrbs() {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="bb-orb absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-white/[0.04]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bb-orb absolute right-0 top-1/3 h-80 w-80 rounded-full bg-white/[0.03]"
        animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bb-orb absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-white/[0.02]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
