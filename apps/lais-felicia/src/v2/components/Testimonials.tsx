import { site, v2Asset, v2Testimonials } from '../data/site'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'

export function Testimonials() {
  return (
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <p className="eyebrow">Depoimentos</p>
        <h3 className="display-title mt-3 text-3xl sm:text-4xl">O que as alunas dizem</h3>
        <p className="mt-4 max-w-lg text-sm text-ink-soft">
          Prints reais de alunas que passaram pelos cursos presenciais.
        </p>
      </Reveal>

      <div className="mt-8">
        <Carousel>
          {v2Testimonials.map((item) => (
            <figure
              key={item.file}
              data-card
              className="w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/10 bg-surface-lift shadow-sm sm:w-[280px]"
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

      <p className="mt-8 text-sm text-ink-mute">
        {site.studio} · {site.city}
      </p>
    </div>
  )
}
