import { site } from '../data/site'
import { Reveal } from './Reveal'

export function Versao() {
  return (
    <section id="versao" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-wine/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-rose/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine/40" />
            O princípio
          </p>
        </Reveal>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <Reveal delay={0.08}>
            <h2 className="display-title text-[clamp(2.4rem,6vw,4.6rem)] text-ink">
              {site.promise}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute sm:text-xl">
              {site.story[0]} {site.story[1]}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <ol className="space-y-6 border-l border-wine/20 pl-6">
              {site.manifesto.map((line, i) => (
                <li key={line} className="relative">
                  <span className="absolute -left-[1.9rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-wine text-[10px] font-bold text-cream">
                    {i + 1}
                  </span>
                  <p className="font-display text-xl leading-snug text-ink sm:text-2xl">{line}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {site.principles.map((p, i) => (
            <Reveal key={p.title} delay={0.08 * i}>
              <article className="group relative overflow-hidden rounded-[1.75rem] bg-cream-soft/80 p-7 transition duration-500 hover:bg-wine hover:text-cream">
                <p className="font-script text-4xl text-rose transition group-hover:text-rose-soft">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute transition group-hover:text-cream/75">
                  {p.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
