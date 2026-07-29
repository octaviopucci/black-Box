import { asset, feed, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal, SectionEyebrow } from './Reveal'

export function Feed() {
  return (
    <section className="bg-ink py-24 text-snow sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionEyebrow light>Instagram</SectionEyebrow>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tight">
              Conteúdo real do consultório.
            </h2>
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

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {feed.map((item, i) => (
            <Reveal key={item.file} delay={0.05 * i}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[4/5] overflow-hidden"
              >
                <img
                  src={asset(item.file)}
                  alt={item.caption}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-80 transition group-hover:opacity-95" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-xs font-semibold leading-snug text-snow/90 sm:text-sm">
                  {item.caption}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
