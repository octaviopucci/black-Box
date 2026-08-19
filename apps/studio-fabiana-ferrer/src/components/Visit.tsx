import { brand } from '@/data/site'
import Reveal from './Reveal'

export default function Visit() {
  return (
    <section id="visite" className="border-t hairline px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[0.95] tracking-[-0.03em] text-ink">
            Rua da Penha,
            <br />
            961
          </h2>
          <address className="mt-6 not-italic text-base text-mute">
            Centro · {brand.address.city}/{brand.address.state}
          </address>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-mute">{brand.hoursNote}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex flex-col gap-6 md:items-start md:pt-4">
            <a
              href={brand.instagramDm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-b border-ink/30 pb-1 text-[0.75rem] font-medium uppercase tracking-mark text-ink transition hover:border-accent hover:text-accent"
            >
              {brand.cta}
            </a>
            <a
              href={brand.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mute underline decoration-ink/20 underline-offset-4 transition hover:text-ink"
            >
              Abrir no mapa
            </a>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mute underline decoration-ink/20 underline-offset-4 transition hover:text-ink"
            >
              @{brand.instagramHandle}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
