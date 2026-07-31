import { ArrowUpRight } from 'lucide-react'
import { asset, instagramPosts, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal } from './Reveal'

export function Instagram() {
  return (
    <section id="instagram" className="relative overflow-hidden bg-wine-deep py-24 text-cream sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-rose/15 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-rose-soft">
            <span className="h-px w-8 bg-rose/50" />
            No Instagram
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="display-title text-[clamp(2.4rem,5.5vw,4rem)]">
                Conteúdos reais da clínica.
              </h2>
              <p className="mt-5 text-cream/65">
                Bastidores, acolhimento e o dia a dia da Matsubara — direto do{' '}
                {site.instagramHandle}.
              </p>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="cta-wine shrink-0 bg-rose text-ink hover:bg-rose-soft"
              data-cursor
            >
              <InstagramIcon className="h-4 w-4" />
              Seguir {site.instagramHandle}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={0.04 * i} className={i === 0 ? 'col-span-2 md:col-span-1' : undefined}>
              <a
                href={post.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden rounded-[1.5rem] bg-wine"
                data-cursor
              >
                <img
                  src={asset(post.image)}
                  alt={post.caption}
                  className={`w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
                    i === 0 ? 'aspect-[4/5] md:aspect-square' : 'aspect-square'
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/85 via-transparent to-transparent opacity-80 transition group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <p className="text-sm font-medium leading-snug text-cream/95 sm:text-base">
                    {post.caption}
                  </p>
                  <InstagramIcon className="mb-0.5 h-4 w-4 shrink-0 text-rose-soft opacity-80" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
