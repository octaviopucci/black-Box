"use client";

import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Contact() {
  return (
    <section id="contato" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionHeader
            index="006"
            label="Contato"
            title="Prefere falar direto ou passar na loja? Estamos no Centro de Capão Bonito, perto das Lojas Cem."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-16 space-y-8">
          <div className="border-t border-line/40 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
              WhatsApp
            </p>
            <button
              type="button"
              onClick={() => openWhatsApp()}
              className="mt-3 block text-left text-lg text-ink transition-colors hover:text-accent"
            >
              {site.whatsappLabel}
            </button>
          </div>

          <div className="border-t border-line/40 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
              Telefone da loja
            </p>
            <a
              href={site.phone.href}
              className="mt-3 block text-lg text-ink transition-colors hover:text-accent"
            >
              {site.phone.label}
            </a>
          </div>

          <div className="border-t border-line/40 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
              Instagram
            </p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-lg text-ink transition-colors hover:text-accent"
            >
              {site.instagram.handle}
            </a>
          </div>

          <div className="border-t border-line/40 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
              Endereço
            </p>
            <p className="mt-3 text-base leading-relaxed text-mute">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.landmark}
            </p>
            <a
              href={site.address.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.25em] text-mute transition-colors hover:text-ink"
            >
              Como chegar →
            </a>
          </div>

          <div className="border-t border-line/40 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Cuidado com golpes
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {site.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
