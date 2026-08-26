import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

type CountOptions = {
  duration?: number
  decimals?: number
  delay?: number
}

export function useCountUp(target: number, active: boolean, { duration = 1.6, decimals = 0, delay = 0 }: CountOptions = {}) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }
    if (reduced) {
      setValue(target)
      return
    }

    let frame = 0
    let start: number | null = null
    const delayMs = delay * 1000

    const tick = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start - delayMs
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick)
        return
      }
      const progress = Math.min(elapsed / (duration * 1000), 1)
      setValue(target * easeOutCubic(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setValue(target)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, delay, duration, reduced, target])

  if (decimals > 0) return value.toFixed(decimals)
  return Math.round(value).toLocaleString('pt-BR')
}

export function useCountUpProgress(active: boolean, duration = 2.2, delay = 0) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active) {
      setProgress(0)
      return
    }
    if (reduced) {
      setProgress(1)
      return
    }

    let frame = 0
    let start: number | null = null
    const delayMs = delay * 1000

    const tick = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start - delayMs
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick)
        return
      }
      const p = Math.min(elapsed / (duration * 1000), 1)
      setProgress(easeOutCubic(p))
      if (p < 1) frame = requestAnimationFrame(tick)
      else setProgress(1)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, delay, duration, reduced])

  return progress
}
