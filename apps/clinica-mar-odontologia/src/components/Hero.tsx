import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { site, media, whatsappUrl } from '@/data/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (reduced || !sectionRef.current || !mediaRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        yPercent: 10,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const words = site.shortName.split('')

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-[100svh] overflow-hidden bg-[#1a1512]"
    >
      <div ref={mediaRef} className="absolute inset-0 origin-center will-change-transform">
        <img
          src={media.hero}
          alt="Clínica Mar Odontologia — ambiente de atendimento em Belo Horizonte"
          className={`h-[115%] w-full object-cover object-[center_20%] transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-[#1a1512]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-[#1a1512]/70 to-[#1a1512]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1512]/80 via-[#1a1512]/35 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24">
        <div className="max-w-3xl">
          <motion.p
            className="mb-4 text-[0.7rem] uppercase tracking-[0.32em] text-white/75"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            {site.tagline}
          </motion.p>

          <h1 className="font-display font-semibold leading-[0.88] tracking-tight text-white">
            <span className="sr-only">{site.name}</span>
            <span
              aria-hidden
              className="flex overflow-hidden text-[clamp(4.5rem,18vw,11rem)] text-white"
            >
              {words.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block text-white"
                  initial={reduced ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-balance text-[clamp(1.05rem,2.2vw,1.3rem)] leading-relaxed text-white/90"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.promise}
          </motion.p>

          <motion.p
            className="mt-4 max-w-lg text-base leading-relaxed text-white/70"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            {site.intro}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-mar-peach px-7 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[#1a1512] transition-colors hover:bg-white hover:text-[#1a1512]"
            >
              Agendar avaliação
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              @{site.instagram.handle}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
