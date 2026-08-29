import { useReducedMotion } from 'framer-motion'

export function useMotion() {
  const reduced = useReducedMotion()
  return {
    reduced: !!reduced,
    fadeUp: reduced
      ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
        },
  }
}
