import { motion, useReducedMotion } from 'framer-motion'
import { brand } from '@/data/site'

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,149,90,0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,160,168,0.12),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 md:py-24">
        <div>
          <p className="text-[11px] uppercase tracking-mark text-gold">⚜ {brand.tagline}</p>
          <h1 className="display mt-4 text-[clamp(3rem,8vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.02em]">
            Dra. Nathalia
            <span className="block text-gold">Rigo</span>
          </h1>
          <p className="mt-4 text-sm uppercase tracking-mark text-mute">{brand.subtitle}</p>

          <div className="gold-line my-8 max-w-xs" />

          <blockquote className="max-w-measure text-lg leading-relaxed md:text-xl">
            ⚜ {brand.bioLines[0]} ⚜
          </blockquote>
          <p className="mt-4 text-sm text-mute">
            {brand.bioLines[1]} · {brand.bioLines[2]}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={brand.instagramDm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-mark text-paper transition hover:bg-gold"
            >
              {brand.cta}
            </a>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex border border-ink/15 px-7 py-4 text-[11px] uppercase tracking-mark text-ink transition hover:border-gold hover:text-gold"
            >
              @{brand.instagramHandle}
            </a>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-sm border border-gold/25 bg-cream shadow-soft">
            <iframe
              title="Instagram Dra. Nathalia Rigo"
              src={`https://www.instagram.com/${brand.instagramHandle}/embed`}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-center text-xs text-mute">
            Perfil oficial · resultados e novidades no Instagram
          </p>
        </motion.div>
      </div>
    </section>
  )
}
