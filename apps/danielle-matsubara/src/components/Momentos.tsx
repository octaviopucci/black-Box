import { Reveal } from './Reveal'
import { InstagramIcon } from './InstagramIcon'
import { asset, site } from '../data/site'

export function Momentos() {
  return (
    <section id="momentos" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">
              <span className="h-px w-8 bg-wine" />
              Momentos reais
            </p>
            <h2 className="display-title text-4xl text-ink sm:text-5xl">O que você encontra ao vivo.</h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-wine transition hover:text-signal"
            data-cursor
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </Reveal>

        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {site.moments.map((m, i) => (
            <Reveal key={m.src} delay={0.04 * i} className="mb-3 break-inside-avoid sm:mb-4">
              <img
                src={asset(m.src)}
                alt={m.alt}
                className="w-full rounded-2xl object-cover shadow-soft"
                loading="lazy"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
