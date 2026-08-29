import { Link } from 'react-router-dom'
import { v2Path } from '../base'
import { v2Asset, v2ServiceHighlights } from '../data/site'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'

export function Services() {
  return (
    <section id="servicos" className="section-pad overflow-hidden">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow">Atendimentos</p>
          <h2 className="display-title mt-3 text-4xl sm:text-5xl">Procedimentos</h2>
        </div>
      </Reveal>

      <Carousel>
        {v2ServiceHighlights.map((item) => (
          <Link
            key={item.id}
            to={v2Path(item.href)}
            data-card
            className="group w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[300px]"
          >
            <div className="overflow-hidden rounded">
              <img
                src={v2Asset(item.image)}
                alt={item.imageAlt}
                className="aspect-[4/5] w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">{item.name}</h3>
          </Link>
        ))}
      </Carousel>
    </section>
  )
}
