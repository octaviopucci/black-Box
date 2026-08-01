import { Reveal } from './Reveal'
import { asset, toys, whatsappUrl } from '../data/site'

export function Toys() {
  return (
    <section id="brinquedos" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Brinquedos</p>
          <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-5xl">
            O parque chega até a sua festa.
          </h2>
          <p className="mt-4 max-w-xl text-paper/65">
            Escolha o brinquedo certo para o espaço e a idade. Todos com a identidade G&amp;L e a
            promessa de diversão garantida.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12">
          {toys.map((toy, i) => (
            <Reveal key={toy.id} delay={Math.min(i * 0.05, 0.2)}>
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative overflow-hidden bg-navy-lift">
                  <img
                    src={asset(toy.image)}
                    alt={toy.title}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 bg-navy/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sun backdrop-blur">
                    {toy.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
                    {toy.title}
                  </h3>
                  <p className="mt-2 text-sun">{toy.line}</p>
                  <p className="mt-4 max-w-md text-paper/70">{toy.detail}</p>
                  <a
                    href={whatsappUrl(
                      `Olá, G&L Locações! Quero orçar o ${toy.title} para minha festa.`,
                    )}
                    className="cta-sun mt-6"
                  >
                    Orçar este brinquedo
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
