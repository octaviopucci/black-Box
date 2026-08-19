import { Reveal } from '@/components/Reveal'
import { ambientes } from '@/data/site'

export function Ambientes() {
  return (
    <section id="ambientes" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="eyebrow mb-4">Ambientes</p>
          <h2 className="display-title max-w-2xl text-[clamp(2rem,5vw,3.25rem)] text-paper">
            O que construímos sob medida
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px bg-line md:grid-cols-2">
          {ambientes.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <article className="group bg-ink px-6 py-10 transition hover:bg-ink-lift md:px-10 md:py-14">
                <span className="font-brand text-sm font-medium tabular-nums text-brass/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-brand text-3xl font-medium text-paper md:text-4xl">
                  {item.name}
                </h3>
                <p className="mt-4 max-w-md text-base font-light leading-relaxed text-paper/55">
                  {item.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
