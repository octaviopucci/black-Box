import { Reveal } from '@/components/Reveal'
import { InstagramIcon } from '@/components/InstagramIcon'
import { instagramUrl, site } from '@/data/site'

export function Booking() {
  return (
    <section id="agendar" className="bg-mauve-deep px-6 py-24 text-paper sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <Reveal>
          <p className="section-eyebrow text-copper-light">Agendamento</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.96]">
            Entre em contato e agende sua avaliação.
          </h2>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-paper/78 sm:text-lg">
            Como orientado nas publicações oficiais: fale com {site.contact.instagramHandle} para marcar sua
            avaliação.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={instagramUrl('Olá! Gostaria de agendar uma avaliação na OdontoMed.')}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              <InstagramIcon className="mr-2 h-4 w-4" />
              {site.contact.instagramHandle}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-t border-paper/15 pt-8">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-copper-light">
              Atendimento
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-paper/78">{site.contact.bookingNote}</p>
            <p className="mt-4 font-sans text-xs uppercase tracking-[0.18em] text-paper/45">
              Fonte: Instagram @odontomed.br
            </p>

            <div className="mt-10 space-y-2 font-sans text-sm text-paper/65">
              <p>
                {site.location.city}, {site.location.state}
              </p>
              <p>{site.location.note}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
