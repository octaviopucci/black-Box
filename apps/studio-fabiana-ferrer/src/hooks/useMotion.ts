import { useReducedMotion } from 'framer-motion'

export function useMotion() {
  const reduced = useReducedMotion()
  return {
    reduced: reduced ?? false,
    spring: reduced
      ? { type: 'tween' as const, duration: 0.01 }
      : { type: 'spring' as const, stiffness: 120, damping: 22 },
    fade: reduced
      ? { duration: 0.01 }
      : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    stagger: reduced ? 0 : 0.08,
  }
}
