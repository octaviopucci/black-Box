import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { ATMOSPHERE_IMAGES } from '@/utils/brand'

/** Easing suave estilo editorial de luxo */
export const EASE_LUX = [0.16, 1, 0.3, 1] as const

export const authStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.13, delayChildren: 0.25 },
  },
}

export const authFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_LUX },
  },
}

export const authFadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_LUX },
  },
}

type Props = {
  children: ReactNode
  className?: string
}

/** Fundo cinematográfico compartilhado por login e cadastro — uma foto, transições limpas. */
export function AuthScreenShell({ children, className }: Props) {
  const reduce = useReducedMotion()

  useEffect(() => {
    document.body.dataset.authScreen = '1'
    return () => {
      delete document.body.dataset.authScreen
    }
  }, [])

  return (
    <div
      className={`auth-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 ${className || ''}`}
    >
      <div
        className="auth-screen__photo pointer-events-none absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${ATMOSPHERE_IMAGES.showroom})` }}
        aria-hidden
      />
      <div className="auth-screen__shade pointer-events-none absolute inset-0" aria-hidden />
      <div className="auth-screen__grain pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={reduce ? undefined : authStagger}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        {children}
      </motion.div>
    </div>
  )
}
