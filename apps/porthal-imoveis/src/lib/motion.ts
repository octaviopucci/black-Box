export const ease = [0.16, 1, 0.3, 1] as const

export const fadeUp = {
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease },
}

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}
