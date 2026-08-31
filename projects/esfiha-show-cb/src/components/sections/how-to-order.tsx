import { site } from "@/data/site";

export function HowToOrder() {
  return (
    <section id="como-pedir" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-show-green-dark">
          Simples e rápido
        </p>
        <h2 className="display mt-2 text-4xl text-show-dark md:text-5xl">
          Como fazer seu pedido
        </h2>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {site.howToOrder.map((step) => (
            <li key={step.step} className="relative pl-16">
              <span className="display absolute left-0 top-0 text-5xl text-show-green/30">
                {step.step}
              </span>
              <h3 className="display text-2xl text-show-dark">{step.title}</h3>
              <p className="mt-3 text-show-muted">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-4 rounded-2xl bg-show-paper p-6 md:grid-cols-3 md:gap-8 md:p-10">
          <a
            href={site.links.delivery}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-show-green-dark p-6 text-white transition-transform hover:scale-[1.01]"
          >
            <p className="display text-xl">Delivery online</p>
            <p className="mt-2 text-sm text-white/80">{site.cta.deliveryNote}</p>
          </a>
          <a
            href={site.phone.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#25D366] p-6 text-white transition-transform hover:scale-[1.01]"
          >
            <p className="display text-xl">WhatsApp</p>
            <p className="mt-2 text-sm text-white/90">{site.phone.whatsapp}</p>
          </a>
          <a
            href={site.phone.landlineHref}
            className="rounded-xl bg-show-dark p-6 text-white transition-transform hover:scale-[1.01]"
          >
            <p className="display text-xl">Telefone</p>
            <p className="mt-2 text-sm text-white/80">{site.phone.landline}</p>
          </a>
        </div>
      </div>
    </section>
  );
}
