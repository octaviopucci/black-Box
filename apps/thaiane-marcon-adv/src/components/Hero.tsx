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
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '10%'])

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <img
          src={media.hero}
          alt=""
          className="h-full w-full object-cover object-[center_22%] md:object-[center_18%]"
          fetchPriority="high"
        />
      </motion.div>
      <div className="hero-mask absolute inset-0" />
      <div className="grain absolute inset-0 opacity-70" />

      <motion.div
        className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20"
        style={{ y: contentY }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <motion.p
            className="mb-4 text-[0.72rem] font-semibold tracking-mark text-white/70 uppercase"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {site.title}
          </motion.p>

          <h1 className="max-w-[12ch] font-display text-[clamp(3.4rem,11vw,7.5rem)] leading-[0.92] font-medium text-white">
            {site.name.split(' ').map((word, index) => (
              <motion.span
                key={word}
                className="block"
                initial={reduced ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mt-8 max-w-measure text-white"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55 }}
          >
            <p className="font-display text-[clamp(1.35rem,2.8vw,2rem)] leading-tight text-white">
              {site.headline}
            </p>
            <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-white md:text-lg">
              {site.support}
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <a
              href={site.cta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-paper"
            >
              {site.cta.label}
            </a>
            <a
              href="#atuacao"
              className="inline-flex items-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:border-white/60"
            >
              Ver atuação
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
