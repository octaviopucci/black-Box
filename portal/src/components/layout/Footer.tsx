import { Logo } from '../ui/Logo'
import { site, mailtoUrl, whatsappUrl } from '../../data/site'

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 pb-10 pt-16">
      <div className="bb-container">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div>
            <Logo stacked className="w-36 sm:w-40" />
            <p className="mt-6 max-w-sm font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              {site.slogan}
            </p>
          </div>

          <div>
            <p className="bb-eyebrow mb-4">Navegação</p>
            <ul className="space-y-3">
              {[...site.nav, { id: 'contato', label: 'CONTATO' }].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="font-mono text-[12px] uppercase tracking-[0.16em] text-silver transition hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="bb-eyebrow mb-4">Contato</p>
            <ul className="space-y-3 text-sm text-silver">
              <li>
                <a href={mailtoUrl()} className="transition hover:text-paper">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-paper"
                >
                  WhatsApp · {site.whatsapp.display}
                </a>
              </li>
              <li className="flex gap-5 pt-2">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] transition hover:text-paper"
                >
                  Instagram
                </a>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] transition hover:text-paper"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.legalName}
            <span className="mx-2 opacity-40">/</span>
            Engenharia de IA / Sistemas Digitais / Automação
          </p>
          <p>© 2026 Black Box</p>
        </div>
      </div>
    </footer>
  )
}
