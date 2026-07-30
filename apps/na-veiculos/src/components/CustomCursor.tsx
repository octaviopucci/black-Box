import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMotion } from '../hooks/useMotion'

export function CustomCursor() {
  const { reduced } = useMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 280, damping: 28 })
  const sy = useSpring(y, { stiffness: 280, damping: 28 })

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return

    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', move)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
    }
  }, [reduced, x, y])

  if (reduced) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal mix-blend-difference lg:block"
      style={{ x: sx, y: sy }}
    />
  )
}
