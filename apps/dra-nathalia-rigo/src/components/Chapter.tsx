import { Link } from 'react-router-dom'
import type { chambers } from '@/data/site'

type Chamber = (typeof chambers)[number]

export function Chapter({
  chamber,
  index,
  inverted = false,
}: {
  chamber: Chamber
  index: number
  inverted?: boolean
}) {
  const odd = index % 2 === 1

  return (
    <article
      className={`relative grid min-h-[88vh] items-stretch lg:grid-cols-2 ${
        inverted ? 'bg-ink text-ice' : 'bg-fog text-ink'
      }`}
    >
      <figure className={`${odd ? 'lg:order-2' : ''} relative min-h-[52vh] overflow-hidden`}>
        <img
          src={chamber.image}
          alt={chamber.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <figcaption className="absolute bottom-5 left-5 text-[10px] uppercase tracking-mark text-ice/80 mix-blend-difference">
          {chamber.field}
        </figcaption>
      </figure>

      <div className="flex flex-col justify-end px-5 py-14 md:px-12 md:py-20">
        <p className="display text-[clamp(3.5rem,10vw,7rem)] leading-[0.8] text-cryo/90">
          {chamber.reading}
        </p>
        <h2 className="display mt-6 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.03em]">
          {chamber.name}
        </h2>
        <p className="mt-6 max-w-measure text-lg leading-relaxed">{chamber.lead}</p>
        <p className={`mt-4 max-w-measure leading-relaxed ${inverted ? 'text-ice/70' : 'text-mute'}`}>
          {chamber.body}
        </p>
        <Link
          to={`/protocolos/${chamber.slug}`}
          className="mt-10 inline-flex w-fit text-[11px] uppercase tracking-mark underline decoration-cryo underline-offset-4"
        >
          Abrir o protocolo
        </Link>
      </div>
    </article>
  )
}
