import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Statement() {
  return (
    <section className="border-y border-line bg-ink-lift/50 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="eyebrow mb-8">Sobre</p>
        </Reveal>
        <Reveal delay={0.08}>
          <blockquote className="display-title max-w-4xl text-[clamp(1.75rem,4.5vw,3.25rem)] text-paper/90">
            Marcenaria especializada em fabricação de móveis sob medida — com foco em
            projetos especiais que pedem elegância, funcionalidade e sofisticação em
            cada detalhe.
          </blockquote>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-paper/55">
            {site.tagline}. {site.promise}. Acompanhe nossos trabalhos em{' '}
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline-offset-4 transition hover:text-brass-soft hover:underline"
            >
              @{site.handle}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
