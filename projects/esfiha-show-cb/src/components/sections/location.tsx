import { site } from "@/data/site";

export function Location() {
  return (
    <section id="local" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-show-green-dark">
              Visite ou retire
            </p>
            <h2 className="display mt-2 text-4xl text-show-dark md:text-5xl">
              Centro de Capão Bonito
            </h2>

            <address className="mt-6 space-y-2 not-italic text-lg">
              <p className="font-semibold">{site.address.full}</p>
              <p className="text-show-muted">{site.address.corner}</p>
            </address>

            <a
              href={site.address.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-semibold text-show-green-dark hover:underline"
            >
              Abrir no Google Maps →
            </a>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-show-muted">
                  Horário
                </dt>
                <dd className="display mt-1 text-3xl text-show-dark">{site.hours.display}</dd>
                <dd className="text-show-muted">{site.hours.label}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-show-muted">
                  Avaliação Google
                </dt>
                <dd className="display mt-1 text-3xl text-show-green-dark">
                  {site.proof.googleRating} ★
                </dd>
                <dd className="text-sm text-show-muted">
                  {site.proof.priceRange} · {site.proof.source}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-show-paper p-8 ring-1 ring-border">
            <h3 className="display text-2xl text-show-dark">Contato</h3>
            <ul className="mt-6 space-y-4 text-lg">
              <li>
                <span className="block text-xs font-bold uppercase text-show-muted">
                  Telefone
                </span>
                <a href={site.phone.landlineHref} className="font-semibold hover:text-show-green-dark">
                  {site.phone.landline}
                </a>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase text-show-muted">
                  WhatsApp
                </span>
                <a
                  href={site.phone.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-show-green-dark"
                >
                  {site.phone.whatsapp}
                </a>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase text-show-muted">
                  Instagram
                </span>
                <a
                  href={site.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-show-green-dark"
                >
                  {site.social.instagramHandle}
                </a>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase text-show-muted">
                  Facebook
                </span>
                <a
                  href={site.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-show-green-dark"
                >
                  Esfiha Show Capão Bonito
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
