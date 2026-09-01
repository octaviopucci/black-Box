import { Clock, MapPin } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export function Location() {
  return (
    <section id="local" className="bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <h2 className="font-heading text-3xl text-foreground uppercase md:text-4xl">
          Onde fica
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-[var(--brand-accent)]" />
              <div>
                <p className="font-semibold">{siteConfig.businessName}</p>
                <p className="text-muted-foreground">{siteConfig.address}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Atendimento com hora marcada — confirme pelo WhatsApp antes de
                  ir.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-1 size-5 shrink-0 text-[var(--brand-accent)]" />
              <div>
                <p className="font-semibold">Horário</p>
                <p className="text-muted-foreground">{siteConfig.hours}</p>
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border">
            <iframe
              title={`Mapa — ${siteConfig.city}`}
              src={siteConfig.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full grayscale-[30%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
