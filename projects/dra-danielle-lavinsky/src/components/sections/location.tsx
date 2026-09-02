import { site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Location() {
  return (
    <section id="local" className="border-t border-line/60 bg-surface py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Endereço"
            title="Onde me encontrar"
          />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-mute">
            <p>
              <strong className="text-ink">{site.clinic.name}</strong>
              <br />
              {site.clinic.address}
              <br />
              {site.clinic.city} · CEP {site.clinic.cep}
            </p>
            <p>
              <strong className="text-ink">Horário da clínica:</strong>{" "}
              {site.clinic.hours}
            </p>
            <p>{site.clinic.parking}</p>
            <p>
              Telefone:{" "}
              <a
                href={`tel:+${site.whatsapp.number}`}
                className="text-accent hover:underline"
              >
                {site.whatsapp.display}
              </a>
              {" · "}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="overflow-hidden bg-ink/5">
            <iframe
              title="Mapa — Clínica Lavinsky"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${site.clinic.mapQuery}&output=embed`}
              className="h-72 w-full border-0 md:h-80"
              allow="fullscreen"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
