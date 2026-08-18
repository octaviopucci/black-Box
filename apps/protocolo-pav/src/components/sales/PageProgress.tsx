import { motion, useScroll, useSpring } from 'framer-motion'

export function PageProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.2 })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-signal"
      style={{ scaleX }}
      aria-hidden
    />
  )
}
