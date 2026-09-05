"use client";

import { Clock, MapPin, Navigation } from "lucide-react";
import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Reveal } from "@/components/motion/reveal";

export function Location() {
  const { t } = useLocale();
  const siteData = useSite();

  return (
    <section id="contato" className="relative bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            {t.location.label}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
            {t.location.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden border border-ink/10 bg-ink/5">
              <iframe
                title={t.location.mapTitle}
                src={site.mapsEmbed}
                className="h-full w-full border-0 grayscale contrast-[1.05] invert"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-8">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/15">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-[0.24em] text-ink">
                  {t.location.address}
                </h3>
                <p className="mt-2 font-light leading-relaxed text-mute">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/15">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-[0.24em] text-ink">
                  {t.location.hours}
                </h3>
                <p className="mt-2 whitespace-pre-line font-light leading-relaxed text-mute">
                  {siteData.hours}
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Rua+Olímpio+de+Campos+55+Jd+Vila+Formosa+São+Paulo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-ink/15 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <Navigation className="h-4 w-4" />
              {t.location.directions}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
