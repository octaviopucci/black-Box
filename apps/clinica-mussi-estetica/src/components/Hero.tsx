import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { site, whatsappUrl } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMotion'
import { InstagramIcon } from './InstagramIcon'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const planeY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '8%'])

  const words = site.brand.short.split('')

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-end px-6 py-6 md:px-10 md:py-8">
        <a
          href={site.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-link flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
        >
          <InstagramIcon />
          <span className="hidden sm:inline">{site.contact.instagramHandle}</span>
        </a>
      </header>

      <div className="grid min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <motion.div
          style={{ y: copyY }}
          className="relative z-10 flex flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-20 lg:justify-center lg:px-14 lg:pb-24 lg:pt-20 xl:px-20"
        >
          <p className="mb-5 max-w-md text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">
            {site.brand.niche} · {site.address.neighborhood}
          </p>

          <h1 className="font-display text-[clamp(4.5rem,16vw,11rem)] leading-[0.88] tracking-[-0.04em] text-ink">
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
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft md:text-xl md:leading-relaxed"
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
              className="cta-primary inline-flex items-center justify-center bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-paper-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
            >
              Agendar avaliação
            </a>
            <a
              href="#visita"
              className="touch-link px-2 py-4 text-sm font-medium text-ink-soft"
            >
              Como chegar
            </a>
          </motion.div>
        </motion.div>

        <div className="relative min-h-[42vh] lg:min-h-0">
          <motion.div
            style={{ y: planeY }}
            className="hero-plane absolute inset-0 lg:inset-y-0 lg:left-0 lg:right-[-8vw]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-grain opacity-30 mix-blend-soft-light" />
            <div className="absolute inset-x-8 bottom-8 hidden border border-ink/10 bg-paper-lift/40 p-6 backdrop-blur-sm lg:block xl:inset-x-12 xl:bottom-12">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-ink-mute">
                [ Placeholder — fotografia real da clínica ]
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                Substituir por imagem do ambiente físico extraída do Instagram ou material oficial da
                marca.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
