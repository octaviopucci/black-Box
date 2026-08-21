import { motion } from 'framer-motion'
import { media, site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMotion'

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={media.hero}
          alt=""
          className="h-full w-full object-cover object-[center_20%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroVeil" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">
            <span className="h-px w-8 bg-enamel/60" />
            {site.location}
          </p>

          <h1 className="display-title max-w-[14ch] text-[clamp(3.2rem,11vw,7.5rem)] text-paper">
            Dr Bruno
            <br />
            <span className="italic text-enamel-soft">França</span>
          </h1>

          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-paper/75 md:text-lg">
            {site.promise}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Agendar avaliação
            </a>
            <a href="#resultados" className="cta-ghost">
              Ver resultados
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
