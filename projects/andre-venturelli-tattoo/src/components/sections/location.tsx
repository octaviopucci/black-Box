"use client";

import Image from "next/image";
import { Check, Clock, MapPin, Navigation } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Location() {
  return (
    <section id="estudio" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="004"
            label={site.studio.label}
            title={site.studio.title}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-mute">
          <p>{site.studio.intro}</p>
          <p>{site.studio.detail}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden border border-line bg-elevated">
              <iframe
                title="Localização André Ventureli Tattoo"
                src={site.mapsEmbed}
                className="h-full w-full border-0 grayscale contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-accent/40 text-accent">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm uppercase tracking-[0.2em] text-ink">
                  Endereço
                </h3>
                <p className="mt-2 leading-relaxed text-mute">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  CEP {site.address.zip}
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-accent/40 text-accent">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm uppercase tracking-[0.2em] text-ink">
                  Horário
                </h3>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-mute">
                  {site.hours}
                </p>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {site.studio.amenities.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-mute">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={site.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Como chegar
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.studio.images.map((src, index) => (
            <Reveal key={src} delay={index * 0.04}>
              <div className="relative aspect-[4/3] overflow-hidden ring-1 ring-line/40">
                <Image
                  src={src}
                  alt={`Estúdio André Ventureli — foto ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
