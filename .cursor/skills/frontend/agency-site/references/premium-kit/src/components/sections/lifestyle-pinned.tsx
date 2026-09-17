'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '@/site.config'
import { prefersReducedMotion } from '@/lib/prefers-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

export function LifestylePinned() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlinesRef = useRef<(HTMLSpanElement | null)[]>([])
  const { lifestyle } = siteConfig

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReducedMotion()) return

    const headlines = headlinesRef.current.filter(Boolean) as HTMLElement[]
    const ctx = gsap.context(() => {
      gsap.set(headlines, { autoAlpha: 0 })
      gsap.set(headlines[0], { autoAlpha: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: '.fv-stage',
          invalidateOnRefresh: true,
        },
      })

      if (headlines[1]) {
        tl.to(headlines[0], { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0.28)
        tl.to(headlines[1], { autoAlpha: 1, duration: 0.2, ease: 'none' }, 0.28)
      }
      if (headlines[2]) {
        tl.to(headlines[1], { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0.58)
        tl.to(headlines[2], { autoAlpha: 1, duration: 0.2, ease: 'none' }, 0.58)
      }

      section.querySelectorAll('[data-parallax]').forEach((el) => {
        const depth = Number((el as HTMLElement).dataset.parallax)
        tl.to(
          el,
          {
            y: () => -(section.clientHeight * depth) / 100,
            duration: 1,
            ease: 'none',
          },
          0,
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[280vh] bg-ink">
      <div className="fv-stage sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[26%]"
          style={{
            background:
              'linear-gradient(180deg, #08080a 0%, rgba(8,8,10,0.72) 38%, transparent 100%)',
          }}
        />

        <div
          data-parallax="8"
          className="pointer-events-none absolute inset-0 z-[8] grid place-items-center px-6"
        >
          <div className="grid place-items-center">
            {lifestyle.headlines.map((line, i) => (
              <span
                key={line}
                ref={(el) => {
                  headlinesRef.current[i] = el
                }}
                className="col-start-1 row-start-1 text-center text-[clamp(1.8rem,7vw,5.5rem)] font-bold leading-tight text-white/80"
                style={{ textShadow: '0 0 28px rgba(0,0,0,0.9)' }}
              >
                {line}
              </span>
            ))}
            <p className="col-start-1 row-start-1 mt-32 max-w-md text-center text-white/50">
              {lifestyle.subline}
            </p>
          </div>
        </div>

        <div
          data-parallax="48"
          className="pointer-events-none absolute inset-x-0 bottom-[12%] z-[12] flex justify-center"
        >
          <div className="relative h-[40vh] w-[40vh] overflow-hidden rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <div
              className="globe-spin absolute inset-y-0 left-0 w-[200%]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 30%, #4a9eff 0%, #1a3a5c 40%, #0a1628 100%)',
                backgroundSize: '50% 100%',
              }}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[15]" aria-hidden>
          <div data-parallax="14" className="absolute left-[8%] top-[12%] h-20 w-28 rounded-xl bg-accent/20" />
          <div data-parallax="18" className="absolute right-[8%] top-[14%] h-24 w-32 rounded-xl bg-white/10" />
          <div data-parallax="30" className="absolute bottom-[14%] left-[8%] h-20 w-28 rounded-xl bg-white/10" />
          <div data-parallax="34" className="absolute bottom-[12%] right-[8%] h-24 w-32 rounded-xl bg-accent/20" />
        </div>
      </div>
    </section>
  )
}
