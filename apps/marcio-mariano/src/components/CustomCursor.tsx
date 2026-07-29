import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    setVisible(true)
    document.documentElement.classList.add('has-custom-cursor')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHovering(Boolean(t?.closest('a, button, [data-cursor="hover"]')))
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [x, y])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
    >
      <div
        className={`rounded-full border border-white transition-all duration-300 ${
          hovering ? 'h-14 w-14 bg-white/15' : 'h-3 w-3 bg-white'
        }`}
      />
    </motion.div>
  )
}
