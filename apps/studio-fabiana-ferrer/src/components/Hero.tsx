import { motion } from 'framer-motion'
import { brand } from '@/data/site'
import { useMotion } from '@/hooks/useMotion'
import Reveal from './Reveal'

export default function Hero() {
  const { fade, stagger } = useMotion()

  return (
    <section
      id="inicio"
      className="relative flex min-h-dvh items-center px-4 pb-20 pt-28 md:px-8 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">
              Sorocaba · Centro
            </p>
          </Reveal>

          <Reveal delay={stagger}>
            <h1 className="mt-4 max-w-measure font-display text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.05] tracking-tight text-forest text-balance">
              {brand.inclusion}
            </h1>
          </Reveal>

          <Reveal delay={stagger * 2}>
            <p className="mt-6 max-w-measure text-lg leading-relaxed text-smoke">
              {brand.promise}
            </p>
          </Reveal>

          <Reveal delay={stagger * 3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={brand.instagramDm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-paper shadow-lift transition hover:bg-pine"
              >
                {brand.cta}
              </a>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-paper/70 px-5 py-3.5 text-sm font-semibold text-forest backdrop-blur transition hover:border-sage/40 hover:bg-paper"
              >
                @{brand.instagramHandle}
              </a>
            </div>
          </Reveal>

          <Reveal delay={stagger * 4}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-forest/10 pt-8">
              {[
                { label: 'Seguidores', value: brand.stats.followers.toLocaleString('pt-BR') },
                { label: 'Publicações', value: String(brand.stats.posts) },
                { label: 'Destaques', value: String(brand.stats.highlights) },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[0.68rem] uppercase tracking-mark text-smoke">{item.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-forest">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fade, delay: 0.15 }}
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-forest shadow-lift">
            <img
              src={`${import.meta.env.BASE_URL}media/2.jpg`}
              alt="Profissional do Studio Fabiana Ferrer demonstrando depilação a laser"
              className="aspect-[4/5] w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="max-w-xs font-display text-xl leading-snug text-paper">
                Depois de conhecer a depilação a laser, a lâmina fica no passado.
              </p>
              <p className="mt-2 text-sm text-leaf/90">Conteúdo publicado no Instagram do studio</p>
            </div>
          </div>

          <motion.div
            aria-hidden
            className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-leaf/30 bg-paper/90 px-4 py-3 shadow-glow backdrop-blur md:block"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-xs font-semibold uppercase tracking-mark text-sage">Todos os tons</p>
            <p className="mt-1 text-sm text-forest">de pele</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
