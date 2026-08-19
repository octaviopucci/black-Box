import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { media, site, whatsappUrl } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMotion'
import { InstagramIcon } from './InstagramIcon'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const planeY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '6%'])

  const words = site.brand.short.split('')

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <img
          src={media.profile}
          alt="Clínica Mussi Estética"
          className="h-11 w-11 rounded-full border border-paper-lift/40 object-cover shadow-sm"
        />
        <a
          href={site.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-link flex items-center gap-2 text-sm font-medium text-paper-lift transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
        >
          <InstagramIcon />
          <span className="hidden sm:inline">{site.contact.instagramHandle}</span>
        </a>
      </header>

      <motion.div style={{ y: planeY }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={media.hero}
          className="h-full w-full object-cover"
        >
          <source src={media.heroVideo} type="video/mp4" />
        </video>
        <img
          src={media.hero}
          alt=""
          aria-hidden
          className="hidden h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
      </motion.div>

      <div className="relative z-10 grid min-h-[100svh] lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          style={{ y: copyY }}
          className="flex flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-20 lg:justify-center lg:px-14 lg:pb-24 lg:pt-20 xl:px-20"
        >
          <p className="mb-5 max-w-md text-xs font-semibold uppercase tracking-[0.28em] text-paper-deep">
            {site.brand.niche} · {site.address.neighborhood}
          </p>

          <h1 className="font-display text-[clamp(4.5rem,16vw,11rem)] leading-[0.88] tracking-[-0.04em] text-paper-lift">
            {reduced ? (
              site.brand.short
            ) : (
              <span aria-label={site.brand.short}>
                {words.map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + index * 0.07,
                      duration: 0.9,
                      ease: [0.33, 1, 0.38, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            )}
          </h1>

          <motion.p
            className="mt-6 max-w-lg text-lg leading-relaxed text-paper-lift/90 md:text-xl md:leading-relaxed"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.33, 1, 0.38, 1] }}
          >
            {site.brand.promise}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.75, ease: [0.33, 1, 0.38, 1] }}
          >
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center justify-center bg-paper-lift px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
            >
              Agendar avaliação
            </a>
            <a href="#equipe" className="touch-link px-2 py-4 text-sm font-medium text-paper-lift">
              Equipe
            </a>
            <a href="#procedimentos" className="touch-link px-2 py-4 text-sm font-medium text-paper-lift">
              Procedimentos
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: copyY }}
          className="hidden items-end justify-end p-8 lg:flex lg:p-12 xl:p-16"
        >
          <figure className="max-w-xs border border-paper-lift/20 bg-ink/25 p-3 backdrop-blur-sm">
            <img
              src={media.doctor}
              alt={site.doctor.name}
              className="aspect-[3/4] w-full object-cover"
            />
            <figcaption className="mt-4 px-1 pb-1">
              <p className="font-display text-2xl leading-tight text-paper-lift">{site.doctor.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-paper-deep">
                {site.doctor.handle}
              </p>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  )
}
