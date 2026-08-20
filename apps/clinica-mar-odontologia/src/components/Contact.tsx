import { site, whatsappUrl, media } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Contact() {
  return (
    <section id="contato" className="bg-mar-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
            Contato
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-tight text-mar-ink">
            Avenida Contagem, 1451
          </h2>
          <p className="mt-3 text-lg text-mar-ink-soft">
            Belo Horizonte, MG
          </p>

          <div className="mt-10 space-y-6">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-display text-[clamp(1.5rem,3vw,2rem)] text-mar-rose-deep transition-colors hover:text-mar-peach-deep"
            >
              {site.contact.phone}
            </a>

            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm uppercase tracking-[0.2em] text-mar-ink-soft transition-colors hover:text-mar-ink"
            >
              Ver no mapa →
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border-t border-mar-line pt-8">
            <h3 className="text-[0.7rem] uppercase tracking-[0.28em] text-mar-wave">
              Horário de atendimento
            </h3>
            <ul className="mt-6 space-y-4">
              {site.hours.map((slot) => (
                <li
                  key={slot.days}
                  className="flex items-baseline justify-between gap-4 border-b border-mar-line/70 pb-4 text-mar-ink-soft"
                >
                  <span>{slot.days}</span>
                  <span className="font-medium text-mar-ink">{slot.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <img
              src={media.profile}
              alt="Logo Clínica Mar Odontologia"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-mar-line"
            />
            <div>
              <p className="font-display text-xl text-mar-ink">{site.name}</p>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-mar-rose-deep hover:text-mar-peach-deep"
              >
                @{site.instagram.handle}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
