import { careAreas } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Care() {
  return (
    <section id="cuidados" className="relative bg-mar-mist py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-tide opacity-50" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
            Tratamentos
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-tight text-mar-ink">
            Um sorriso saudável pede planejamento — não atalhos.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mar-ink-soft">
            Ortodontia, reabilitação estética, manutenção e prevenção — com foco
            em função, saúde e resultado duradouro.
          </p>
        </Reveal>

        <div className="mt-16 divide-y divide-mar-line/80 border-t border-mar-line">
          {careAreas.map((area, index) => (
            <Reveal key={area.id} delay={index * 0.06}>
              <article className="grid gap-5 py-10 md:grid-cols-[minmax(200px,0.32fr)_1fr] md:gap-12 md:py-14">
                <h3 className="font-display text-[clamp(1.75rem,3vw,2.35rem)] font-medium leading-tight text-mar-rose-deep">
                  {area.title}
                </h3>
                <div>
                  <p className="text-lg font-medium leading-snug text-mar-ink">
                    {area.line}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-mar-ink-soft">
                    {area.detail}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-mar-wave">
                    {area.source}
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
