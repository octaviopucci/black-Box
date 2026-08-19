import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useMotion } from '../../hooks/useMotion'

export function ScrollTop() {
  const { reduced } = useMotion()
  const { scrollYProgress } = useScroll()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setShown(v > 0.12))
    return () => unsub()
  }, [scrollYProgress])

  if (reduced) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      className={`fixed bottom-24 right-5 z-40 h-12 w-12 text-gold-deep transition duration-500 sm:bottom-28 sm:right-7 ${
        shown ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
        <path
          className="fill-none stroke-ink/12"
          strokeWidth="1.6"
          d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
        />
        <motion.path
          className="fill-none stroke-gold"
          strokeWidth="1.6"
          d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <ChevronUp className="absolute inset-0 m-auto h-4 w-4" />
    </button>
  )
}
