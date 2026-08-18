import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHovering(Boolean(t?.closest('a, button, [role="button"]')))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      animate={{
        x: pos.x - (hovering ? 22 : 6),
        y: pos.y - (hovering ? 22 : 6),
        width: hovering ? 44 : 12,
        height: hovering ? 44 : 12,
      }}
      transition={{ type: 'spring', stiffness: 480, damping: 32, mass: 0.35 }}
    >
      <div className="h-full w-full rounded-full border border-gold bg-gold/20" />
    </motion.div>
  )
}
