import { site } from '@/data/site'

export function Contact() {
  const { address } = site

  return (
    <section id="contato" className="border-t border-line bg-paper-soft px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Contato</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            {site.contact.cta}
          </h2>
          <p className="mt-4 max-w-md text-mute">{site.contact.note}</p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-ink-soft"
          >
            @{site.instagram.handle}
          </a>
        </div>

        <div className="flex flex-col justify-end gap-8 text-sm text-mute">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Endereço</p>
            <p className="mt-2 leading-relaxed">
              {address.street}
              <br />
              {address.neighborhood} — {address.city}/{address.state}
              <br />
              CEP {address.zip}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Registro</p>
            <p className="mt-2">CRO {site.cro}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Instagram</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-teal transition-colors hover:text-teal-deep"
            >
              @{site.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
