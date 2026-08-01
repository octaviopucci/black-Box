import { Reveal } from './Reveal'
import { catalog } from '../data/site'

export function Catalog() {
  return (
    <section id="catalogo" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Catálogo</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl text-paper sm:text-5xl">
            Três eixos. Uma festa completa.
          </h2>
          <p className="mt-4 max-w-xl text-paper/65">
            Infláveis, decoração e barraquinhas — escolha o pacote ou monte o seu.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:gap-14">
          {catalog.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[5/4] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 bg-night/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sun backdrop-blur">
                    {item.accent}
                  </span>
                </div>
                <div>
                  <h3 className="font-brand text-3xl font-extrabold tracking-tight text-paper sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sun">{item.line}</p>
                  <p className="mt-4 max-w-md text-paper/70">{item.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
