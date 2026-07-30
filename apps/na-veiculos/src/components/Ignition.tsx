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
    }, 2200)
    return () => window.clearTimeout(t)
  }, [reduced, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <div className="relative px-8">
            <motion.div
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <BrandLockup className="h-auto w-[min(78vw,380px)]" />
            </motion.div>
            <motion.div
              className="mx-auto mt-8 h-px w-24 origin-left bg-lamp"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.p
              className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-paper-mute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Capão Bonito · SP
            </motion.p>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-vignette opacity-70" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
