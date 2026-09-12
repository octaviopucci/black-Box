import { results } from '../data/site'
import { Reveal } from './Reveal'

const aspectClass = {
  tall: 'row-span-2 aspect-[3/4]',
  wide: 'col-span-2 aspect-[16/10] sm:aspect-[2/1]',
  square: 'aspect-square',
} as const

export function Results() {
  return (
    <section id="resultados" className="bg-paper-soft py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-crystal-deep">
            Resultados
          </p>
          <h2 className="mt-3 max-w-lg font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-ink">
            Trabalhos reais publicados no Instagram oficial.
          </h2>
        </Reveal>

        <div className="mt-14 grid auto-rows-auto grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05} className={aspectClass[item.aspect]}>
              <figure className="group relative h-full w-full overflow-hidden bg-paper-dim">
                <img
                  src={item.image}
                  alt={`Resultado odontológico ${item.id}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {item.caption ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-5 pb-5 pt-16 text-sm leading-relaxed text-paper/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-sm text-ink-mute">
            Imagens extraídas de @liraodontocaruaru — cada foto aparece uma única vez neste site.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
