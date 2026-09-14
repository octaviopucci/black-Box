import { site, v2Asset, v2Testimonials } from '../data/site'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'

export function Testimonials() {
  return (
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <SectionIntro
          eyebrow="Depoimentos"
          title="O que as alunas dizem"
          titleAs="h3"
          titleClassName="text-3xl sm:text-4xl"
          description="Prints reais de alunas que passaram pelos cursos presenciais."
          className="mb-8"
        />
      </Reveal>

      <div className="mt-8">
        <Carousel>
          {v2Testimonials.map((item) => (
            <figure
              key={item.file}
              data-card
              className="w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm sm:w-[260px]"
            >
              <img
                src={v2Asset(item.file)}
                alt={item.alt}
                className="w-full object-cover object-center"
                loading="lazy"
              />
            </figure>
          ))}
        </Carousel>
      </div>

      <p className="mt-8 text-center text-sm text-ink-mute">
        {site.studio} · {site.city}
      </p>
    </div>
  )
}
