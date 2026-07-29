import { motion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { heroImage, site } from '../data/site'

export function Hero() {
  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroImage}
          alt="Paisagem brasileira — horizonte e natureza"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,54,41,0.88)_0%,rgba(8,54,41,0.55)_42%,rgba(16,32,25,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(8,54,41,0.65),transparent_55%)]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-brass/20 blur-3xl"
          animate={{ opacity: [0.25, 0.45, 0.25], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-brand-soft/25 blur-3xl"
          animate={{ opacity: [0.2, 0.4, 0.2], y: [0, -24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-[clamp(3.4rem,10vw,7rem)] font-extrabold leading-[0.9] tracking-tight">
            {site.brand}
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium leading-snug text-white/90 sm:text-xl">
            {site.headline}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            {site.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#busca"
              className="inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-brass-soft"
            >
              Buscar um serviço
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#jornada"
              className="inline-flex items-center rounded-full border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
            >
              Ver como funciona
            </a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 text-xs uppercase tracking-[0.28em] text-white/45"
        >
          Reinvenção conceitual do portal oficial · demo Black Box
        </motion.p>
      </div>
    </section>
  )
}
