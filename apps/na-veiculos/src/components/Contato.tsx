import { MessageCircle } from 'lucide-react'
import { Reveal } from './Reveal'
import { InstagramIcon } from './InstagramIcon'
import { site, whatsappHref } from '../data/site'

export function Contato() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      aria-labelledby="contato-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-signal/15 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Limiar
          </p>
          <h2
            id="contato-title"
            className="display-title max-w-4xl text-[clamp(2.8rem,8vw,5.5rem)] text-chrome-soft"
          >
            Pronto para a próxima trajetória?
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-chrome/75">
            Chame no WhatsApp oficial, diga o modelo — e a gente acelera a
            negociação com clareza.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 flex flex-wrap gap-4">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="cta-signal min-w-[220px]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Falar no WhatsApp
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
