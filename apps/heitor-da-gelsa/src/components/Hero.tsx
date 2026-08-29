import { motion } from 'framer-motion'
import { media, siteConfig, stats } from '@/data/site'
import { Button } from './Button'
import { useCountUp } from '@/hooks/useCountUp'

function HeroStat({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value)
  return (
    <div className="border-l-2 border-yellow/80 pl-4">
      <span ref={ref} className="font-display text-2xl font-black text-yellow sm:text-3xl lg:text-4xl">
        {display}
      </span>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-xs">
        {label}
      </p>
    </div>
  )
}

export function Hero() {
  const heroStats = stats.slice(0, 3)

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] overflow-hidden bg-green-deep pt-24 text-white"
    >
      {/* Atmospheric photo wash on desktop right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block" aria-hidden>
        <img
          src={media.hero}
          alt=""
          className="h-full w-full scale-105 object-cover object-[center_18%] opacity-35 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep via-green-deep/80 to-green-deep/40" />
      </div>

      <div className="absolute inset-0 bg-heroMesh opacity-70" />
      <div className="absolute inset-0 bg-grain opacity-[0.06]" />

      <div
        className="pointer-events-none absolute -left-16 top-32 h-64 w-64 rounded-full bg-yellow/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-green-deep to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-4 pb-14 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-1.5 w-10 bg-yellow" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow">
              {siteConfig.locationLabel}
            </p>
          </div>

          <p className="font-display text-sm font-extrabold uppercase tracking-[0.35em] text-white/90 sm:text-base">
            Heitor da Gelsa
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,6.2vw,4.75rem)] font-black leading-[0.9] tracking-tight text-balance">
            {siteConfig.heroHeadline}{' '}
            <span className="text-yellow">{siteConfig.heroHighlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {siteConfig.heroSubheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/#atuacao" variant="primary" className="w-full sm:w-auto">
              Conheça a atuação
            </Button>
            <Button
              href={`https://wa.me/${siteConfig.whatsapp}`}
              variant="outline-white"
              external
              className="w-full sm:w-auto"
            >
              Fale com Heitor
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <HeroStat key={stat.id} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <div className="absolute -inset-3 hidden border border-yellow/40 lg:block" aria-hidden />
            <div className="absolute -bottom-5 -right-5 hidden h-28 w-28 bg-yellow lg:block" aria-hidden />
            <div className="absolute -left-3 top-10 hidden h-3 w-3 rounded-full bg-blue-support lg:block" aria-hidden />

            <div className="relative aspect-[4/5] overflow-hidden bg-green-dark shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
              <img
                src={media.hero}
                alt="Heitor da Gelsa — assessor parlamentar e ex-vereador de Capão Bonito"
                className="h-full w-full object-cover object-[center_12%]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-yellow">
                  Capão Bonito
                </p>
                <p className="mt-1 font-display text-lg font-bold text-white">Presença na cidade</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
