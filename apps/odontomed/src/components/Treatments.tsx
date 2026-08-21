import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Treatments() {
  return (
    <section id="tratamentos" className="bg-paper px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-eyebrow">Tratamentos</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] text-ink">
            O que a clínica apresenta no dia a dia.
          </h2>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink-mute">
            Conteúdo extraído das publicações oficiais de {site.contact.instagramHandle}.
          </p>
        </Reveal>

        <div className="mt-16 divide-y divide-paper-deep/80 border-y border-paper-deep/80">
          {site.treatments.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <article className="grid gap-4 py-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-baseline lg:gap-16 lg:py-11">
                <h3 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{item.title}</h3>
                <div>
                  <p className="font-sans text-base leading-relaxed text-ink-soft sm:text-lg">{item.lead}</p>
                  <p className="mt-3 font-sans text-xs uppercase tracking-[0.18em] text-ink-mute">
                    Fonte: {item.source}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
