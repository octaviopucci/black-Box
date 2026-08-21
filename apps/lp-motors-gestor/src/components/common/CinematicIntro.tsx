import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { INTRO_IMAGES, brandDisplayName } from '@/utils/brand'
import { useAppOptional } from '@/context/AppContext'
import { APP_SHORT } from '@/config/variant'
import { EASE_LUX } from '@/components/common/AuthScreenShell'

const STORAGE_KEY = 'lp_motors_intro_v3'

type Props = {
  force?: boolean
  onDone?: () => void
}

/** Intro pós-login — uma imagem por vez, crossfade limpo (sem sobreposição fantasma). */
export function CinematicIntro({ force, onDone }: Props) {
  const reduce = useReducedMotion()
  const app = useAppOptional()
  const name = app?.settings ? brandDisplayName(app.settings) : APP_SHORT
  const [visible, setVisible] = useState(false)
  const [slide, setSlide] = useState(0)
  const [textPhase, setTextPhase] = useState(0)

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
    const timers = [
      window.setTimeout(() => setTextPhase(1), 500),
      window.setTimeout(() => setSlide(1), 2000),
      window.setTimeout(() => setTextPhase(2), 2400),
      window.setTimeout(() => setSlide(2), 3800),
      window.setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
        onDone?.()
      }, 5200),
    ]

    return () => timers.forEach(clearTimeout)
  }, [force, onDone, reduce])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#05080c]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.85, ease: EASE_LUX } }}
          aria-hidden
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={INTRO_IMAGES[slide]}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${INTRO_IMAGES[slide]})` }}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 1.12 }}
              transition={{ duration: 1.35, ease: EASE_LUX }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/88" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_78%)]" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.p
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-white/75"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: textPhase >= 1 ? 1 : 0, y: textPhase >= 1 ? 0 : 10 }}
              transition={{ duration: 0.75, ease: EASE_LUX }}
            >
              Prestige inventory
            </motion.p>
            <motion.h1
              className="font-cinema text-5xl font-semibold text-white sm:text-7xl"
              initial={{ opacity: 0, y: 24, letterSpacing: '0.06em' }}
              animate={{
                opacity: textPhase >= 1 ? 1 : 0,
                y: textPhase >= 1 ? 0 : 24,
                letterSpacing: textPhase >= 2 ? '0.02em' : '0.06em',
              }}
              transition={{ duration: 0.95, ease: EASE_LUX }}
            >
              {name}
            </motion.h1>
            <motion.div
              className="mt-7 h-px w-28 bg-gradient-to-r from-transparent via-[var(--lp-accent)] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: textPhase >= 2 ? 1 : 0, opacity: textPhase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.7, ease: EASE_LUX }}
            />
            <motion.p
              className="mt-6 max-w-md text-sm leading-relaxed text-white/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: textPhase >= 2 ? 1 : 0, y: textPhase >= 2 ? 0 : 8 }}
              transition={{ duration: 0.65, ease: EASE_LUX, delay: 0.08 }}
            >
              Gestão de estoque com presença de showroom.
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
