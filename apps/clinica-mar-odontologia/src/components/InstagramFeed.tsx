import { feedPosts, site } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function InstagramFeed() {
  return (
    <section id="instagram" className="overflow-hidden bg-mar-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
              Instagram
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-mar-ink">
              Acompanhe a clínica no dia a dia.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-mar-ink-soft">
              Campanhas, resultados, lembretes de manutenção e dicas de saúde
              bucal — tudo no perfil oficial.
            </p>
          </div>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm uppercase tracking-[0.2em] text-mar-ink-soft transition-colors hover:text-mar-rose-deep"
          >
            @{site.instagram.handle}
          </a>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feedPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.05}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden bg-mar-mist"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-tide group-hover:scale-[1.03]"
                  />
                </div>
                <p className="px-4 py-3 text-sm leading-snug text-mar-ink-soft transition-colors group-hover:text-mar-ink">
                  {post.caption}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
