"use client";

import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Contact() {
  return (
    <section id="contato-alt" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionHeader
            index="005"
            label="Contato"
            title="Lista de espera e encomendas pelo Instagram."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-16 space-y-8">
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
            <button
              type="button"
              onClick={() =>
                openWhatsApp("Olá! Vi o site e quero entrar na lista de espera.")
              }
              className="mt-4 text-sm text-mute underline-offset-4 hover:text-ink hover:underline"
            >
              Abrir perfil →
            </button>
          </div>

          <div className="border-t border-line/40 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
              Lista de espera
            </p>
            <p className="mt-3 text-base leading-relaxed text-mute">
              Encomendas e informações pelo link na bio do Instagram{" "}
              {site.instagram.handle}.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
