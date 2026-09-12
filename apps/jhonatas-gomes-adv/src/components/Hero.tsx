import { useRef } from 'react'
import { motion } from 'framer-motion'
import { media, site, whatsappUrl } from '@/data/site'
import { useHeroParallax } from '@/hooks/useMotion'

const words = site.name.split(' ')

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null)
  useHeroParallax(mediaRef)

  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <img
          src={media.hero}
          alt="Jhonatas Gomes, advogado trabalhista, em consultório"
          className="h-[115%] w-full object-cover object-[center_20%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/35" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.12] mix-blend-overlay" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.38em] text-gold-soft"
          >
            {site.role}
          </motion.p>

          <h1 className="font-display text-[clamp(3.4rem,11vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-snow">
            {words.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.25 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-[0.18em] inline-block last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg font-bold leading-relaxed text-snow md:text-xl"
          >
            {site.headline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-gold-soft"
            >
              WhatsApp
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-paper/25 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:border-gold/50 hover:text-gold-soft"
            >
              @{site.instagram.handle}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
