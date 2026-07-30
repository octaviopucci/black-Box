import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export function PageProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  useEffect(() => {
    return () => undefined
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal"
      style={{ scaleX }}
      aria-hidden
    />
  )
}
