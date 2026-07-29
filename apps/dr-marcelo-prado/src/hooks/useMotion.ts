import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const tick = () => {
      ScrollTrigger.update()
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
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

export function useCascadeLine(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const line = el.querySelector('[data-cascade-line]') as SVGPathElement | null
    if (!line) return

    const length = line.getTotalLength()
    line.style.strokeDasharray = `${length}`
    line.style.strokeDashoffset = `${length}`

    const ctx = gsap.context(() => {
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.6,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [containerRef])
}
