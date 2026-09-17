'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '@/site.config'
import { prefersReducedMotion } from '@/lib/prefers-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

export function Features() {
  const ref = useRef<HTMLElement>(null)
  const { features } = siteConfig

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="beneficios" ref={ref} className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow text-accent">{features.eyebrow}</p>
        <h2 className="text-section mt-4 font-bold text-ink">
          {features.title}
          <span className="block text-mute">{features.titleMuted}</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((item) => (
            <article
              key={item.title}
              className="feature-card rounded-2xl bg-surface p-6"
            >
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-mute">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
