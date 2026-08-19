import { site, whatsappUrl } from '../../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer>
      <div className="border-t border-ink/10 px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
          <div>
            <h5 className="font-display text-lg font-bold text-ink">Sobre {site.name}</h5>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-mute">
              Atendimentos personalizados e formações profissionais para quem busca um olhar com
              identidade em Capão Bonito.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-gold-deep hover:text-gold"
              aria-label={site.instagramHandle}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>

          <div>
            <h5 className="font-display text-lg font-bold text-ink">Horário de atendimento</h5>
            <ul className="mt-5 space-y-3">
              {site.hours.map((row) => (
                <li key={row.days} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-ink-soft">{row.days}</span>
                  <span className="h-px flex-1 border-b border-dotted border-ink/15" />
                  <span className="text-gold-deep">{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-display text-lg font-bold text-ink">Contato</h5>
            <p className="mt-4 text-sm leading-relaxed text-ink-mute">
              {site.address}
              <br />
              {site.landmark}
              <br />
              {site.city}
            </p>
            <p className="mt-4">
              <a href={whatsappUrl()} className="font-display text-lg font-bold text-ink hover:text-gold-deep">
                {site.phone.label}
              </a>
            </p>
            <p className="mt-2 text-xs text-ink-mute">{site.payment.join(' · ')}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 px-5 py-6 text-center text-xs text-ink-mute">
        ©{new Date().getFullYear()} {site.studio}. Todos os direitos reservados.
      </div>
    </footer>
  )
}
