import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Evidence() {
  return (
    <section className="bg-paper-lift px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20">
        <Reveal>
          <p className="section-eyebrow">Periodontia</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.8vw,3.8rem)] leading-[0.98] text-ink">
            {site.evidence.title}
          </h2>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink-soft sm:text-lg">
            {site.evidence.body}
          </p>
          <p className="mt-6 font-sans text-xs uppercase tracking-[0.18em] text-ink-mute">
            Antes e depois publicado em {site.contact.instagramHandle}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <figure>
            <img
              src={site.evidence.image}
              alt="Antes e depois de tratamento periodontal publicado pela OdontoMed"
              className="w-full"
            />
            <figcaption className="mt-4 font-sans text-sm text-ink-mute">
              Registro oficial do feed — tratamento periodontal.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
