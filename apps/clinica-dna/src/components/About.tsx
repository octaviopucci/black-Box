import { asset, site } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={asset('about.jpg')}
                alt="Ambiente acolhedor da Clínica DNA"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl glass px-5 py-4 shadow-soft">
                <p className="font-display text-3xl font-semibold text-navy">Desde {site.since}</p>
                <p className="mt-1 text-sm text-mute">Cuidando de Capão Bonito com presença</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="Sobre a DNA"
            title="O DNA do cuidado está na conexão"
            subtitle={site.mission}
          />

          <div className="mt-8 space-y-5">
            {site.about.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p className="text-base leading-relaxed text-mute sm:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {site.values.map((value, i) => (
              <Reveal key={value.title} delay={0.05 * i}>
                <div className="rounded-2xl border border-line bg-snow/70 p-5 transition hover:border-aqua/40 hover:shadow-soft">
                  <h3 className="font-display text-2xl font-semibold text-navy">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
