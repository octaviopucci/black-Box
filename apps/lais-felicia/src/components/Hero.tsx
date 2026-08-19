import { useEffect, useRef, type RefObject } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { asset, heroVideo, site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'
import { useScrollVideoScrub } from '../hooks/useScrollVideoScrub'

function HeroCopy({ titleRef }: { titleRef: RefObject<HTMLParagraphElement | null> }) {
  const { reduced } = useMotion()

  return (
    <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-32">
      <motion.img
        src={asset('logo.png')}
        alt=""
        aria-hidden
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mb-8 h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 lg:mb-10"
      />

      <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-rose-soft">
        {site.role} · {site.city}
      </p>

      <p
        ref={titleRef}
        className="mt-3 font-display text-[clamp(3.2rem,14vw,7.5rem)] font-medium leading-[0.92] tracking-tight text-paper"
      >
        Laís Felicia
      </p>

      <motion.h1
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-xl font-display text-[clamp(1.6rem,4vw,2.6rem)] font-medium leading-[1.08] text-paper/92"
      >
        {site.headline}
      </motion.h1>

      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-5 max-w-md text-sm leading-relaxed text-paper/70 sm:text-base"
      >
        {site.lead}
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.62 }}
        className="mt-9 flex flex-wrap gap-3"
      >
        <a href={whatsappUrl()} className="cta-rose">
          Quero agendar meu horário
        </a>
        <a href="#resultados" className="cta-ghost border-paper/25 text-paper hover:border-rose-soft">
          Ver resultados
        </a>
      </motion.div>
    </div>
  )
}

function HeroMedia({ videoRef, scrub }: { videoRef: RefObject<HTMLVideoElement | null>; scrub: boolean }) {
  const overlays = (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
    </>
  )

  if (scrub) {
    return (
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center"
          src={asset(heroVideo.src)}
          poster={asset(heroVideo.poster)}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        {overlays}
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <img
        src={asset(heroVideo.poster)}
        alt="Laís Felicia no Studio Laís Felicia"
        className="h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      {overlays}
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const { reduced } = useMotion()
  const scrub = !reduced

  useScrollVideoScrub(sectionRef, videoRef, {
    enabled: scrub,
    scrollVh: heroVideo.scrollVh,
  })

  useEffect(() => {
    const el = titleRef.current
    if (!el || reduced) return
    gsap.fromTo(
      el,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 },
    )
  }, [reduced])

  if (!scrub) {
    return (
      <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink">
        <HeroMedia videoRef={videoRef} scrub={false} />
        <HeroCopy titleRef={titleRef} />
      </section>
    )
  }

  return (
    <section
      id="topo"
      ref={sectionRef}
      data-video-slot
      className="relative bg-ink"
      style={{ height: `${heroVideo.scrollVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroMedia videoRef={videoRef} scrub />
        <HeroCopy titleRef={titleRef} />
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-paper/45"
        >
          Role para ver
        </p>
      </div>
    </section>
  )
}
