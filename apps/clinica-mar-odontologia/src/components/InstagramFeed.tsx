import { feedPosts, site } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function InstagramFeed() {
  return (
    <section id="instagram" className="overflow-hidden bg-mar-mist py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
              Instagram
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-mar-ink">
              O dia a dia da clínica, direto do feed.
            </h2>
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

        <div className="mt-12 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5">
          {feedPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.05} className="shrink-0">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-[min(78vw,320px)] overflow-hidden bg-mar-paper"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-tide group-hover:scale-[1.03]"
                  />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
