import { motion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { heroImage, site } from '../data/site'

export function Hero() {
  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-gov-darker text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroImage}
          alt="Paisagem do Brasil — referência visual do território nacional"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,29,65,0.92)_0%,rgba(12,50,111,0.78)_45%,rgba(19,81,180,0.55)_100%)]" />
        <div className="absolute inset-0 gov-diamond opacity-80" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-10 top-28 h-56 w-56 rotate-45 border border-flag-yellow/30"
          animate={{ opacity: [0.2, 0.45, 0.2], rotate: [45, 50, 45] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-24 right-8 h-40 w-40 rotate-45 border border-white/15"
          animate={{ opacity: [0.15, 0.35, 0.15], y: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-[clamp(3.6rem,11vw,7.2rem)] font-extrabold leading-[0.88] tracking-tight">
            gov.br
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.22em] text-flag-yellow">
            {site.org}
          </p>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-snug text-white sm:text-xl">
            {site.headline}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
            {site.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#busca"
              className="inline-flex items-center gap-2 rounded bg-flag-yellow px-6 py-3.5 text-sm font-extrabold text-gov-darker transition hover:bg-white"
            >
              Buscar um serviço
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#jornada"
              className="inline-flex items-center rounded border-2 border-white/50 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
            >
              Ver a jornada
            </a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-12 text-xs font-medium text-white/50"
        >
          Conceito demonstrativo Black Box · baseado na identidade digital do Governo Federal
        </motion.p>
      </div>
    </section>
  )
}
