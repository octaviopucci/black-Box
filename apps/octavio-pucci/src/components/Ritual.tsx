import { ritual } from '../data/site'
import { Reveal } from './Reveal'

export function Ritual() {
  return (
    <section
      id="ritual"
      className="relative overflow-hidden border-t border-line px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-gold" />
            Ritual
          </p>
          <h2 className="mt-5 max-w-3xl font-brand text-[clamp(2.4rem,7vw,5rem)] leading-[0.92] tracking-[0.05em]">
            Da ideia à
            <span className="text-gold"> permanência.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base text-ash sm:text-lg">
            Um processo sem pressa de catálogo. Cada projeto é uma conversa que
            vira composição — e só então vira pele.
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-0 border-t border-line sm:mt-20 lg:grid-cols-4">
          {ritual.map((step, index) => (
            <li
              key={step.step}
              className="relative border-b border-line py-10 lg:border-b-0 lg:border-r lg:px-6 lg:py-12 lg:last:border-r-0 lg:first:pl-0"
            >
              <Reveal delay={index * 0.08}>
                <p className="font-brand text-5xl tracking-[0.1em] text-gold/35 sm:text-6xl">
                  {step.step}
                </p>
                <h3 className="mt-4 font-display text-3xl italic text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-ash">
                  {step.description}
                </p>
                {index < ritual.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-1/2 bg-gold/40 lg:block"
                  />
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
