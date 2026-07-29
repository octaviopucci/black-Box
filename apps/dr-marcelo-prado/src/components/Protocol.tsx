import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset, bookingUrl, site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Protocol() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-proto]',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="harmonie"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-void py-32 sm:py-40"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 md:grid-cols-12 md:gap-10 md:pl-28">
        <div className="md:col-span-6 md:sticky md:top-28">
          <p data-proto className="section-kicker">
            {site.protocolo.line}
          </p>
          <h2 data-proto className="section-title mt-4 text-[clamp(2.3rem,5.2vw,3.8rem)]">
            {site.protocolo.title}
          </h2>
          <p data-proto className="mt-6 max-w-lg text-base leading-relaxed text-paper/60 sm:text-lg">
            {site.protocolo.detail}
          </p>
          <ol className="mt-10 space-y-0 border-t border-paper/10">
            {site.protocolo.points.map((p, i) => (
              <li
                key={p}
                data-proto
                className="flex items-baseline gap-5 border-b border-paper/10 py-4 text-sm text-paper/70"
              >
                <span className="font-display text-lg text-signal/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
          <div data-proto className="mt-10 border-l border-champagne/40 pl-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-champagne/80">
              {site.korpen.title}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/45">
              {site.korpen.description}
            </p>
          </div>
          <a
            data-proto
            href={bookingUrl()}
            target="_blank"
            rel="noreferrer"
            className="cta-primary mt-10"
          >
            Quero o Harmonie
          </a>
        </div>

        <div className="relative overflow-hidden md:col-span-6">
          <motion.div style={{ y: imgY }} className="relative aspect-[4/5] md:aspect-[5/6]">
            <img
              src={asset('protocolo.jpg')}
              alt={site.protocolo.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/20" />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-signal/15" />
        </div>
      </div>
    </section>
  )
}
