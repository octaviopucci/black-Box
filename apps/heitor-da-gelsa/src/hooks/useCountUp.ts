import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useMotion'

export function useCountUp(target: string, duration = 1800) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const numeric = target.replace(/[^\d]/g, '')
    if (!numeric || reduced) {
      setDisplay(target)
      return
    }

    const end = parseInt(numeric, 10)
    const prefix = target.startsWith('0') && target.length > 1 ? '0' : ''
    const suffix = target.replace(/[\d.]/g, '')
    let start = 0
    let started = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        const startTime = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(start + (end - start) * eased)
          const formatted =
            target.includes('.') && target.includes(',')
              ? current.toLocaleString('pt-BR')
              : prefix + String(current).padStart(numeric.length, '0').slice(-numeric.length)
          setDisplay(formatted + suffix.replace(/^\d+/, ''))
          if (progress < 1) requestAnimationFrame(tick)
          else setDisplay(target)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, reduced])

  return { ref, display }
}
