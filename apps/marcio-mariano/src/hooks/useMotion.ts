import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let current = window.scrollY
    let target = window.scrollY
    let raf = 0
    const ease = 0.08

    const onScroll = () => {
      target = window.scrollY
    }

    const tick = () => {
      current += (target - current) * ease
      if (Math.abs(target - current) > 0.2) {
        // visual smoothing handled by CSS/motion; keep ScrollTrigger in sync
        ScrollTrigger.update()
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}

export function useReveal<T extends HTMLElement>(options?: {
  y?: number
  delay?: number
  once?: boolean
}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: options?.y ?? 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          delay: options?.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: options?.once ?? true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [options?.delay, options?.once, options?.y])

  return ref
}
