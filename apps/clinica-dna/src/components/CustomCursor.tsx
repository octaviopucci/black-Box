import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 })
  const [on, setOn] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    document.documentElement.classList.add('has-custom-cursor')
    setOn(true)

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHover(Boolean(t?.closest('a, button, [data-cursor="hover"]')))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  if (!on) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{ width: hover ? 44 : 10, height: hover ? 44 : 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="rounded-full bg-paper"
      />
    </motion.div>
  )
}
