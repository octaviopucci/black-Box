import { Reveal } from '@/components/Reveal'
import { media, site } from '@/data/site'

export function Intro() {
  return (
    <section className="relative bg-paper px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] max-w-md overflow-hidden bg-ink/5">
            <img
              src={media.portrait}
              alt={`Retrato de ${site.name}`}
              className="h-full w-full object-cover object-[center_18%]"
              loading="lazy"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-mark text-accent uppercase">
              Quem orienta
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] text-ink">
              {site.name}
              <span className="mt-2 block text-[0.55em] font-normal text-mute">{site.title}</span>
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-mute">
            {site.intro.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 text-sm text-mute/80">
              {site.instagram.followers.toLocaleString('pt-BR')} seguidores ·{' '}
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                @{site.instagram.handle}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
