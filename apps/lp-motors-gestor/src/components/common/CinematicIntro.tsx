import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { INTRO_IMAGES, brandDisplayName } from '@/utils/brand'
import { useAppOptional } from '@/context/AppContext'
import { APP_SHORT } from '@/config/variant'

const STORAGE_KEY = 'lp_motors_intro_v2'

type Props = {
  force?: boolean
  onDone?: () => void
}

export function CinematicIntro({ force, onDone }: Props) {
  const reduce = useReducedMotion()
  const app = useAppOptional()
  const name = app?.settings ? brandDisplayName(app.settings) : APP_SHORT
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduce) {
      onDone?.()
      return
    }
    const seen = sessionStorage.getItem(STORAGE_KEY)
    if (!force && seen) {
      onDone?.()
      return
    }
    setVisible(true)
    const t1 = window.setTimeout(() => setPhase(1), 400)
    const t2 = window.setTimeout(() => setPhase(2), 1600)
    const t3 = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
      onDone?.()
    }, 3200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [force, onDone, reduce])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden
        >
          {INTRO_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{
                opacity: phase >= i ? (i === Math.min(phase, 2) ? 1 : 0.35) : 0,
                scale: phase >= i ? 1.16 : 1.08,
              }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_80%)]" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.p
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/70"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 12 }}
              transition={{ duration: 0.7 }}
            >
              Prestige inventory
            </motion.p>
            <motion.h1
              className="font-cinema text-5xl font-semibold tracking-tight text-white sm:text-7xl"
              initial={{ opacity: 0, y: 28, letterSpacing: '0.08em' }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                y: phase >= 1 ? 0 : 28,
                letterSpacing: phase >= 2 ? '0.02em' : '0.08em',
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {name}
            </motion.h1>
            <motion.div
              className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[var(--lp-accent)] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />
            <motion.p
              className="mt-5 max-w-md text-sm text-white/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Gestão de estoque com presença de showroom.
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
