import { doctor, site } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Doctor() {
  return (
    <section id="profissional" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={doctor.portrait}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 h-28 w-28 overflow-hidden border-4 border-ink md:-right-8 md:h-36 md:w-36">
                <img
                  src={doctor.photo}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="eyebrow mb-6">Profissional</p>
            <h2 className="display-title text-[clamp(2.2rem,5vw,4rem)] text-paper">
              {doctor.name}
            </h2>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-enamel-soft">
              {doctor.role}
            </p>
            <p className="mt-8 max-w-lg text-base font-light leading-relaxed text-paper/70 md:text-lg">
              {doctor.bio}
            </p>
            <p className="mt-6 text-sm text-paper/45">
              {site.years} anos · {site.location} · {site.followers.toLocaleString('pt-BR')}{' '}
              seguidores no Instagram
            </p>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost mt-10 inline-flex"
            >
              @{site.handle}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
