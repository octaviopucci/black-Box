import { site } from "@/data/site";
import { contactUrl, instagramUrl } from "@/lib/contact";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Location() {
  return (
    <section id="contato" className="border-t border-line/60 bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Contato"
            title="Onde me encontrar"
            description={site.clinic.note}
          />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-mute">
            <p>
              <strong className="text-ink">{site.clinic.name}</strong>
              {" · "}
              <a
                href={site.clinic.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {site.clinic.handle}
              </a>
            </p>
            <p>{site.clinic.address}</p>
            <p>
              Instagram:{" "}
              <a
                href={instagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {site.instagram.handle}
              </a>
              {" · "}
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Agendar consulta
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
