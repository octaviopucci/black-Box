import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.35 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    document.documentElement.classList.add('has-custom-cursor')
    setVisible(true)

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      setHovering(!!t?.closest('a, button, [data-cursor]'))
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
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
        className={`rounded-full border border-cream transition-all duration-300 ${
          hovering ? 'h-12 w-12 bg-rose/35' : 'h-3 w-3 bg-cream'
        }`}
      />
    </motion.div>
  )
}
