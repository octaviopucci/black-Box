import { brand } from '@/data/site'
import Reveal from './Reveal'

export default function Visit() {
  return (
    <section id="visite" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-forest/10 bg-gradient-to-br from-forest to-pine p-8 text-paper shadow-lift md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-leaf/90">
                  Visite
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">
                  Estamos no Centro de Sorocaba.
                </h2>
                <address className="mt-6 not-italic text-lg leading-relaxed text-mint/90">
                  {brand.address.street}
                  <br />
                  {brand.address.district} · {brand.address.city}/{brand.address.state}
                </address>
                <p className="mt-4 text-sm text-leaf/80">{brand.hoursNote}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href={brand.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-paper px-6 py-3.5 text-sm font-semibold text-forest transition hover:bg-mint"
                >
                  Como chegar
                </a>
                <a
                  href={brand.instagramDm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-paper/25 px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-paper/10"
                >
                  {brand.cta}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
