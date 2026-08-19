import { Link } from 'react-router-dom'
import { asset, serviceHighlights } from '../data/site'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'

export function Services() {
  return (
    <section id="servicos" className="section-pad overflow-hidden">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow">Atendimentos e formações</p>
          <h2 className="display-title mt-3 text-4xl sm:text-5xl">Serviços especializados</h2>
        </div>
      </Reveal>

      <Carousel>
        {serviceHighlights.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            data-card
            className="group w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[300px]"
          >
            <div className="overflow-hidden rounded">
              <img
                src={asset(item.image)}
                alt={item.imageAlt}
                className="aspect-[4/5] w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">{item.name}</h3>
            <p className="mt-2 font-display text-2xl font-bold text-gold-deep">{item.price}</p>
            <p className="mt-1 text-sm text-ink-mute">{item.line}</p>
          </Link>
        ))}
      </Carousel>
    </section>
  )
}
