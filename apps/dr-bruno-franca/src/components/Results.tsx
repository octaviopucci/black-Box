import { results } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Results() {
  return (
    <section id="resultados" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="eyebrow mb-6">Resultados</p>
          <h2 className="display-title max-w-[14ch] text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
            Transformações reais, conduzidas com acompanhamento
          </h2>
        </Reveal>

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {results.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.06} className="mb-6 break-inside-avoid">
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <figure>
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full object-cover transition duration-700 ease-clinic group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-enamel-soft">
                      {item.treatment}
                    </span>
                    <p className="mt-2 font-brand text-lg text-paper transition group-hover:text-enamel-soft">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm font-light leading-relaxed text-paper/55">
                      {item.excerpt}
                    </p>
                  </figcaption>
                </figure>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
