import { asset, site, v2Asset, v2Testimonials, whatsappUrl } from '../data/site'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'

export function Testimonials() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={asset('studio-wide.jpg')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        aria-hidden
      />
      <div className="absolute inset-0 bg-ink/72" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow !text-gold-soft">Fale comigo</p>
          <h2 className="display-title mt-4 max-w-md text-3xl text-white sm:text-4xl">
            Quer ajuda para escolher o melhor procedimento para seu objetivo?
          </h2>
          <div className="mt-10">
            <a href={whatsappUrl()} className="cta-gold !text-gold-soft">
              Falar com a Laís
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <p className="eyebrow !text-gold-soft">Depoimentos</p>
          <h3 className="display-title mt-3 text-3xl text-white">O que as alunas dizem</h3>
          <p className="mt-4 max-w-lg text-sm text-white/70">
            Prints reais de alunas que passaram pelos cursos presenciais.
          </p>

          <div className="mt-8">
            <Carousel>
              {v2Testimonials.map((item) => (
                <figure
                  key={item.file}
                  data-card
                  className="w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/15 bg-white shadow-lg sm:w-[280px]"
                >
                  <img
                    src={v2Asset(item.file)}
                    alt={item.alt}
                    className="aspect-[9/16] max-h-[520px] w-full object-contain object-top bg-white"
                    loading="lazy"
                  />
                </figure>
              ))}
            </Carousel>
          </div>

          <p className="mt-8 text-sm text-white/55">
            {site.studio} · {site.city}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
