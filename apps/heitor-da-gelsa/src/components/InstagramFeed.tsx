import { siteConfig, instagramPosts } from '@/data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'

export function InstagramFeed() {
  return (
    <section id="instagram" className="bg-graphite py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow">Redes</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight">
            Do Instagram para a cidade.
          </h2>
          <p className="mt-4 max-w-2xl text-white/70">
            Acompanhe registros, conteúdos e posicionamentos publicados nas redes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.04}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-yellow/40"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow">{post.category}</p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug">{post.title}</h3>
                  <p className="mt-2 text-xs text-white/50">{post.date}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href={siteConfig.instagramUrl} variant="primary" external>
            Ver Instagram
          </Button>
        </div>
      </div>
    </section>
  )
}
