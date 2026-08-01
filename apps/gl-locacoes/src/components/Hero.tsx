import { motion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'

export function Hero() {
  const { reduced } = useMotion()

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={site.heroImage}
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroFade" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(245,193,90,0.22),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="font-brand text-[clamp(3.4rem,12vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight text-paper">
            G&amp;L <span className="text-sun">Fest</span>
          </p>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg text-paper/85 sm:text-xl"
          >
            {site.headline}
          </motion.p>
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-3 max-w-lg text-sm text-paper/65 sm:text-base"
          >
            {site.promise}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href={whatsappUrl()} className="cta-sun">
              Orçar no WhatsApp
            </a>
            <a href="#catalogo" className="cta-ghost">
              Ver catálogo
              <ArrowDownRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-8 top-1/3 hidden h-24 w-24 rounded-full bg-coral/40 blur-2xl sm:block"
          animate={reduced ? undefined : { y: [0, -14, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-32 right-[18%] hidden h-16 w-16 rounded-full bg-mint/35 blur-xl sm:block"
          animate={reduced ? undefined : { y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
      </div>
    </section>
  )
}
