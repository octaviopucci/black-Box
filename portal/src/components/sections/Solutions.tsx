import { solutions } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function Solutions() {
  return (
    <section id="solucoes" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader title="O que a Black Box constrói" eyebrow="Soluções" />
        </Reveal>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {solutions.map((solution, i) => (
            <Reveal key={solution.number} delay={0.04 * i}>
              <article className="group grid gap-6 py-10 lg:grid-cols-[7rem_1fr_1.1fr] lg:items-start lg:gap-10">
                <p className="font-mono text-sm text-mute">{solution.number}</p>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-paper transition group-hover:text-silver sm:text-3xl">
                    {solution.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute sm:text-base">
                    {solution.description}
                  </p>
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
                  {solution.examples.map((example) => (
                    <li
                      key={example}
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver/80"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
