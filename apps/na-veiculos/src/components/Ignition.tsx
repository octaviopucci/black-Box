import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandLockup } from './BrandMark'
import { useMotion } from '../hooks/useMotion'

type Props = {
  onDone?: () => void
}

export function Ignition({ onDone }: Props) {
  const { reduced } = useMotion()
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (reduced) {
      setShow(false)
      onDone?.()
      return
    }
    const t = window.setTimeout(() => {
      setShow(false)
      onDone?.()
    }, 2600)
    return () => window.clearTimeout(t)
  }, [reduced, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <motion.div
            className="relative w-full max-w-5xl px-6"
            initial={{ opacity: 0, scale: 1.45, filter: 'blur(22px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrandLockup
              banner
              className="mx-auto w-[min(92vw,920px)]"
            />
            <motion.div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-130%' }}
                animate={{ x: '160%' }}
                transition={{ delay: 0.55, duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </motion.div>
          <motion.p
            className="absolute bottom-16 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-paper-mute"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Capão Bonito · SP
          </motion.p>
          <div className="pointer-events-none absolute inset-0 bg-vignette opacity-80" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
