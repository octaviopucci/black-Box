import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { asset, site } from '../data/site'
import { Reveal } from './Reveal'

export function Space() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  return (
    <section id="espaco" ref={ref} className="relative min-h-[85svh] overflow-hidden bg-ink">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={asset('space-welcome.jpg')}
          alt="Espaço Harmonie — jardim vertical, madeira e acolhimento"
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[85svh] max-w-7xl flex-col justify-end px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-soft">
            O espaço
          </p>
          <h2 className="display-title max-w-2xl text-[clamp(2.4rem,5.5vw,4rem)] text-porcelain">
            Cada detalhe pensado para você se sentir em casa — e em cuidado.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-porcelain/65">
            Jardim vertical, madeira ondulada, neon dourado. A Harmonie traduz bem-estar em
            atmosfera: moderna, acolhedora e pronta para a sua experiência.
          </p>
          <svg
            aria-hidden
            className="mt-8 w-full max-w-sm opacity-50"
            viewBox="0 0 320 28"
            fill="none"
          >
            <path
              d="M0 18 C40 4, 80 26, 120 14 S200 2, 240 16 280 28, 320 12"
              stroke="#C4A574"
              strokeWidth="1.4"
              className="wave-path"
            />
          </svg>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex text-sm font-medium text-gold-soft underline-offset-4 transition hover:underline"
            data-cursor
          >
            {site.address}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
