import { formatFollowers, site } from '@/data/site'
import { Eyebrow, Reveal } from '@/components/Reveal'

export function Feed() {
  return (
    <section id="conteudo" className="bg-navy-deep py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow light>Instagram</Eyebrow>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-semibold leading-tight text-snow">
                Conteúdo trabalhista no feed
              </h2>
            </div>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gold-soft underline-offset-4 hover:underline"
            >
              @{site.instagram.handle} · {formatFollowers(site.instagram.followers)} seguidores
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {mediaGallery.map((src, index) => (
            <Reveal key={src} delay={index * 0.05}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden"
              >
                <img
                  src={src}
                  alt=""
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:opacity-90"
                  loading="lazy"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const mediaGallery = site.topics.map((topic) => topic.image)
