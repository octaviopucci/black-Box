import type { Variants, Transition } from 'framer-motion'

export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: easeOut } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
}

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

export const tapScale = { scale: 0.97 }
export const hoverLift = { y: -2, transition: springSoft }
