import { ArrowDownRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { site, whatsappHref } from '../data/site'
import { availableVehicles } from '../data/vehicles'
import { useMotion } from '../hooks/useMotion'
import { assetUrl } from '../lib/asset'

export function Hero() {
  const { reduced } = useMotion()
  const heroVehicle = availableVehicles[0]

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={assetUrl(heroVehicle.image)}
          alt=""
          className="h-full w-full object-cover object-[center_40%] scale-105"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-asphalt via-asphalt/85 to-asphalt/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/40 to-asphalt/55" />
        <div className="absolute inset-0 bg-vignette" />
        {!reduced && (
          <div
            className="pointer-events-none absolute -left-1/4 top-1/4 h-[42vh] w-[70vw] rotate-[-8deg] bg-gradient-to-r from-signal/25 via-chrome/10 to-transparent blur-3xl animate-headlight"
            aria-hidden
          />
        )}
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="eyebrow mb-6">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Capão Bonito · SP
          </p>

          <h1 className="brand-title text-[clamp(4.2rem,16vw,9.5rem)] text-chrome-soft">
            N.A.
          </h1>
          <p className="mt-2 font-display text-[clamp(1.8rem,6vw,3.4rem)] uppercase tracking-[0.18em] text-chrome">
            Veículos
          </p>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-chrome/80 sm:text-xl">
            {site.headline} Novos e seminovos com valor transparente, descrição
            completa e atendimento humano.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#pista" className="cta-signal">
              Ver disponíveis
              <ArrowDownRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost"
            >
              Negociar agora
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-chrome-mute">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-signal" aria-hidden />
              {site.address.street}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
              {availableVehicles.length} no estoque · Instagram {site.followers}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px">
        <div className="lane-rule" />
      </div>
    </section>
  )
}
