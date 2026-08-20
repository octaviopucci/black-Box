import { commitments, site } from '@/data/site'
import { Reveal } from './Reveal'

export function Commitment() {
  return (
    <section id="compromisso" className="relative bg-chamber py-24 text-paper md:py-32">
      <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-bronze-soft">
            Compromisso
          </p>
          <h2 className="mt-4 font-brand text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.05]">
            Justiça, ética e preparo — valores que exercemos todos os dias
          </h2>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-paper/75">
            {site.values.slice(0, 3).join(' · ')}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {commitments.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="border-t border-paper/15 pt-6">
                <h3 className="font-brand text-xl font-medium text-paper">{item.title}</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-paper/70">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
