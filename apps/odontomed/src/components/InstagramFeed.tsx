import { Reveal } from '@/components/Reveal'
import { InstagramIcon } from '@/components/InstagramIcon'
import { site } from '@/data/site'

export function InstagramFeed() {
  return (
    <section id="instagram" className="overflow-hidden bg-paper px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">Instagram</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[0.98] text-ink">
              Acompanhe o consultório no feed.
            </h2>
          </div>

          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border-t border-paper-deep pt-5 sm:border-t-0 sm:pt-0"
          >
            <img
              src={site.instagram.profile}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <span>
              <span className="block font-sans text-sm font-semibold text-ink">
                {site.contact.instagramHandle}
              </span>
              <span className="block font-sans text-xs text-ink-mute">
                {site.brand.followers.toLocaleString('pt-BR')} seguidores
              </span>
            </span>
            <InstagramIcon className="ml-2 h-4 w-4 text-copper" />
          </a>
        </Reveal>

        <div className="mt-12 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden">
          {site.instagramPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.04} className="w-[min(78vw,280px)] shrink-0 sm:w-[300px]">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <img
                  src={post.image}
                  alt=""
                  className="aspect-[4/5] w-full object-cover object-top transition duration-500 group-hover:scale-[1.015]"
                  loading="lazy"
                />
                <p className="mt-4 line-clamp-3 font-sans text-sm leading-relaxed text-ink-soft">
                  {post.caption}
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-copper transition-colors hover:text-copper-deep"
          >
            <InstagramIcon className="h-4 w-4" />
            Ver perfil completo
          </a>
        </Reveal>
      </div>
    </section>
  )
}
