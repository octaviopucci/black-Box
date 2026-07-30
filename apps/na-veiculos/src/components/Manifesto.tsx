import { Reveal } from './Reveal'
import { DriveReveal } from './DriveReveal'
import { site } from '../data/site'

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden border-b border-line px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      aria-labelledby="manifesto-title"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <DriveReveal>
          <p className="eyebrow mb-5">
            <span className="h-px w-8 bg-signal" aria-hidden />
            {site.mantra}
          </p>
          <h2 id="manifesto-title" className="sr-only">
            Manifesto NA Veículos
          </h2>
          <div className="space-y-3">
            {site.manifesto.map((line) => (
              <p
                key={line}
                className="display-title text-[clamp(2rem,5.2vw,3.6rem)] text-chrome-soft"
              >
                {line}
              </p>
            ))}
          </div>
        </DriveReveal>

        <Reveal delay={0.15}>
          <p className="max-w-lg text-lg leading-relaxed text-chrome/75 sm:text-xl">
            {site.promise} Estoque fotografado na loja — separados entre o que
            você pode dirigir hoje e o que já saiu com chave na mão.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-signal">
            {site.tagline}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
