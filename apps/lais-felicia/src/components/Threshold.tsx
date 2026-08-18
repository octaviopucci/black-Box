import { asset, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal } from './Reveal'

export function Threshold() {
  return (
    <section id="agendar" className="relative overflow-hidden">
      <img
        src={asset('studio-wide.jpg')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        aria-hidden
      />
      <div className="absolute inset-0 bg-ink/72" />

      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
        <Reveal>
          <img
            src={asset('logo.png')}
            alt=""
            aria-hidden
            className="mb-6 h-16 w-16 rounded-full object-cover"
          />
          <p className="eyebrow text-rose-soft">Agenda</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl text-paper sm:text-6xl">
            Pronta para descobrir o desenho que valoriza o seu rosto?
          </h2>
          <p className="mt-5 max-w-md text-paper/70">
            Chame no WhatsApp e diga o que você busca. A Laís confirma o horário no dia anterior.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappUrl()} className="cta-rose">
              Agendar meu horário
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost border-paper/25 text-paper"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
