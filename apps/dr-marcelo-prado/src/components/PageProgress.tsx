import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin reading progress — own UX, not a DNA-style section rail. */
export function PageProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-aqua"
      style={{ scaleX }}
    />
  )
}
