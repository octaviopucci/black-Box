import { site } from '../data/site'
import { Reveal } from './Reveal'

export function Regions() {
  const row = [...site.cities, ...site.cities]

  return (
    <section className="overflow-hidden border-y border-line/80 bg-white/40 py-10">
      <Reveal className="mx-auto mb-6 w-full max-w-7xl px-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
          Cobertura regional
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-navy sm:text-3xl">
          Capão Bonito e além
        </h2>
      </Reveal>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-chalk to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-chalk to-transparent" />
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-8">
          {row.map((city, i) => (
            <span
              key={`${city}-${i}`}
              className="font-display text-3xl font-semibold tracking-tight text-navy/80 sm:text-4xl"
            >
              {city}
              <span className="ml-10 text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
