import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { media, site } from '@/data/site'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '12%'])

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] bg-ink md:overflow-hidden">
      {/* Foto — área superior no mobile; full-bleed no desktop, sujeito à direita */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[46svh] overflow-hidden md:inset-0 md:h-full"
        style={{ y: imageY }}
      >
        <img
          src={media.hero}
          alt=""
          className="h-full w-full object-cover object-[58%_8%] md:object-[72%_6%]"
          fetchPriority="high"
        />
        <div className="hero-photo-fade absolute inset-0 md:hidden" />
        <div className="hero-mask absolute inset-0 hidden md:block" />
      </motion.div>

      <div className="grain pointer-events-none absolute inset-0 z-[1] opacity-50" />

      {/* Copy — abaixo da foto no mobile; canto inferior esquerdo no desktop */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end md:absolute md:inset-0">
        <div className="hero-copy-panel mt-[40svh] px-5 pb-12 pt-8 md:mt-0 md:bg-transparent md:px-8 md:pb-20 md:pt-28">
          <div className="mx-auto w-full max-w-7xl md:max-w-[34rem] md:pb-4">
            <motion.p
              className="mb-3 text-[0.72rem] font-semibold tracking-mark text-white/75 uppercase"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {site.title}
            </motion.p>

            <h1 className="font-display text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.94] font-medium text-white">
              {site.name.split(' ').map((word, index) => (
                <motion.span
                  key={word}
                  className="block"
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.2 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.div
              className="mt-6 max-w-measure text-white"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <p className="font-display text-[clamp(1.2rem,2.5vw,1.75rem)] leading-snug text-white">
                {site.headline}
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/88 md:text-base">
                {site.support}
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
            >
              <a
                href={site.cta.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold tracking-wide text-ink transition hover:bg-paper"
              >
                {site.cta.label}
              </a>
              <a
                href="#atuacao"
                className="inline-flex items-center rounded-full border border-white/35 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white/60"
              >
                Ver atuação
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
