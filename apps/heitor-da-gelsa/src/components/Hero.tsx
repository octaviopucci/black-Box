import { motion } from 'framer-motion'
import { media, siteConfig, stats } from '@/data/site'
import { Button } from './Button'
import { useCountUp } from '@/hooks/useCountUp'

function HeroStat({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value)
  return (
    <div className="border-l-2 border-yellow/80 pl-4">
      <span ref={ref} className="font-display text-2xl font-black text-yellow sm:text-3xl">
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
      <div className="absolute inset-0 bg-heroMesh opacity-80" />
      <div className="absolute inset-0 bg-grain opacity-[0.07]" />

      <div
        className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-yellow/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-green-deep to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-yellow">
            {siteConfig.locationLabel}
          </p>

          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[0.92] tracking-tight text-balance">
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
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-green-dark">
            <img
              src={media.hero}
              alt="Heitor da Gelsa — assessor parlamentar e ex-vereador de Capão Bonito"
              className="h-full w-full object-cover object-top"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-deep/40 via-transparent to-transparent" />
          </div>

          <div
            className="absolute -bottom-4 -left-4 hidden h-24 w-24 border-4 border-yellow bg-green lg:block"
            aria-hidden
          />
          <div
            className="absolute -right-3 top-8 hidden h-3 w-3 rounded-full bg-blue-support lg:block"
            aria-hidden
          />
        </motion.div>
      </div>
    </section>
  )
}
