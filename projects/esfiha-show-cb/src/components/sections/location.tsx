import { site } from "@/data/site";

export function Location() {
  return (
    <section id="local" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Onde estamos
            </p>
            <h2 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)] uppercase text-ink">
              Centro de Capão Bonito
            </h2>
            <address className="mt-6 not-italic text-lg text-ink">
              {site.address.full}
            </address>
            <a
              href={site.address.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-brand hover:underline"
            >
              Abrir no Google Maps →
            </a>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">
                Horário
              </p>
              <p className="display mt-2 text-4xl uppercase text-ink">
                {site.hours.display}
              </p>
              <p className="mt-1 text-mute">{site.hours.label}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">
                Contato
              </p>
              <ul className="mt-3 space-y-2 text-lg">
                <li>
                  <a
                    href={site.phone.landlineHref}
                    className="text-ink hover:text-brand"
                  >
                    {site.phone.landline}
                  </a>
                </li>
                <li>
                  <a
                    href={site.phone.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-brand"
                  >
                    WhatsApp {site.phone.whatsapp}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">
                Delivery
              </p>
              <p className="mt-2 text-mute">{site.cta.deliveryNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
