import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMotion } from '../hooks/useMotion'

export function CustomCursor() {
  const { reduced } = useMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 })
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const enabled = useRef(false)

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    enabled.current = true
    document.documentElement.classList.add('has-custom-cursor')

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement | null)?.closest?.(
        '[data-cursor]',
      ) as HTMLElement | null
      if (target) {
        setActive(true)
        setLabel(target.dataset.cursor || '')
      } else {
        setActive(false)
        setLabel('')
      }
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
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-cinema ${
          active
            ? 'flex h-20 w-20 items-center justify-center border-lamp bg-lamp/15 text-[10px] font-semibold uppercase tracking-[0.18em] text-lamp'
            : 'h-2.5 w-2.5 border-paper bg-paper'
        }`}
      >
        {active ? label : null}
      </div>
    </motion.div>
  )
}
