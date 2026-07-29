import { ArrowUpRight } from 'lucide-react'
import { asset, feed, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal, SectionEyebrow } from './Reveal'

export function Feed() {
  return (
    <section id="instagram" className="scroll-mt-24 bg-ink py-28 text-snow sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionEyebrow light>Instagram</SectionEyebrow>
            <h2 className="display-title text-[clamp(2.1rem,4.5vw,3.2rem)]">
              Conteúdo real do consultório.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-snow/50 sm:text-base">
              Posts e carrosséis do @{site.instagramHandle.replace('@', '')} — educação clínica
              com a mesma linguagem do atendimento.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-volt transition hover:text-volt-soft"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle} · {site.followers}
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {feed.map((item, i) => (
            <Reveal key={item.file} delay={0.04 * i}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group relative block aspect-[4/5] overflow-hidden"
              >
                <img
                  src={asset(item.file)}
                  alt={item.caption}
                  className="h-full w-full object-cover transition duration-700 ease-silk group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent opacity-85 transition group-hover:opacity-95" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-xs font-semibold leading-snug text-snow/90 sm:p-5 sm:text-sm">
                  {item.caption}
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-snow/10 pt-8">
            <p className="text-sm text-snow/45">
              Mais conteúdo no Instagram — educação, bastidores e protocolos.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-volt/40 px-5 py-3 text-sm font-bold text-volt transition hover:bg-volt hover:text-ink"
            >
              Seguir {site.instagramHandle}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
