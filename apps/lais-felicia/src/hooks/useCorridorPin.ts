import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Options = {
  minWidth?: string
  scrub?: number
  padEnd?: number
}

export function useCorridorPin(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  { minWidth = '(min-width: 768px)', scrub = 0.75, padEnd = 80 }: Options = {},
) {
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add(`${minWidth} and (prefers-reduced-motion: no-preference)`, () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + padEnd)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(track, { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [minWidth, padEnd, scrub, sectionRef, trackRef])
}
