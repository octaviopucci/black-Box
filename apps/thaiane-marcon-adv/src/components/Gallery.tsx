import { Reveal } from '@/components/Reveal'
import { media, site } from '@/data/site'

export function Gallery() {
  return (
    <section id="conteudo" className="bg-paper px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold tracking-mark text-accent uppercase">
            Conteúdo
          </p>
          <h2 className="mt-4 max-w-measure font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-ink">
            {site.galleryHeading}
          </h2>
        </Reveal>

        <div className="mt-14 columns-2 gap-4 md:columns-3 md:gap-5 lg:columns-4">
          {media.gallery.map((src, index) => (
            <Reveal key={src} delay={(index % 4) * 0.06}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="gallery-item mb-4 block break-inside-avoid overflow-hidden bg-ink/5 md:mb-5"
              >
                <img src={src} alt="" className="w-full object-cover" loading="lazy" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold tracking-wide text-ink transition hover:border-accent hover:text-accent"
            >
              Acompanhar
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
