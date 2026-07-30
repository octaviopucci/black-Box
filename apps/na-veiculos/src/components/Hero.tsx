import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowDown, MessageCircle } from 'lucide-react'
import { site, whatsappHref } from '../data/site'
import { availableVehicles } from '../data/vehicles'
import { BrandLockup } from './BrandMark'
import { assetUrl } from '../lib/asset'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const heroVehicle = availableVehicles[0]
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.35,
        },
      )
    }, sectionRef)

    const section = sectionRef.current
    const spot = spotRef.current
    if (section && spot && window.matchMedia('(pointer: fine)').matches) {
      const onMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        gsap.to(spot, {
          '--x': `${x}%`,
          '--y': `${y}%`,
          duration: 0.7,
          ease: 'power2.out',
        })
      }
      section.addEventListener('pointermove', onMove)
      ctx.add(() => section.removeEventListener('pointermove', onMove))
    }

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-ink"
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <img
          src={assetUrl(heroVehicle.image)}
          alt={heroVehicle.title}
          className="h-full w-full object-cover object-[center_42%] animate-drift"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/50" />
        <div className="absolute inset-0 bg-vignette" />
        <div
          ref={spotRef}
          className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
          style={{
            background:
              'radial-gradient(420px circle at var(--x, 70%) var(--y, 35%), rgba(200,16,46,0.22), transparent 55%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-[10%] top-[20%] h-[50vh] w-[65vw] rotate-[-12deg] bg-gradient-to-r from-lamp/25 via-lamp/5 to-transparent blur-3xl animate-flicker"
          aria-hidden
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-5 border border-paper/10 sm:inset-8"
        aria-hidden
      >
        <span className="absolute left-0 top-0 h-8 w-8 border-l border-t border-lamp/60" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r border-t border-lamp/60" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-lamp/60" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-lamp/60" />
      </div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 sm:px-10 sm:pb-24 lg:justify-center lg:pb-28"
      >
        <div data-hero className="mb-8">
          <BrandLockup className="w-[min(52vw,200px)] sm:w-[220px]" />
        </div>

        <p data-hero className="eyebrow mb-5">
          <span className="h-px w-8 bg-lamp" aria-hidden />
          {site.city}
        </p>

        <h1
          data-hero
          className="display max-w-3xl text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[1.02] text-paper-soft"
        >
          {site.headline}
        </h1>

        <p
          data-hero
          className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75 sm:text-xl"
        >
          {site.lead}
        </p>

        <div data-hero className="mt-10 flex flex-wrap items-center gap-3">
          <a href="#estoque" className="cta-lamp" data-cursor="Estoque">
            Ver estoque
            <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost"
            data-cursor="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Chamar no WhatsApp
          </a>
        </div>

        <div
          data-hero
          className="mt-12 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper-mute"
        >
          <span className="plaque">{availableVehicles.length} disponíveis</span>
          <span className="plaque">{site.address.street}</span>
          <span className="plaque">{site.whatsapp.label}</span>
        </div>
      </motion.div>
    </section>
  )
}
