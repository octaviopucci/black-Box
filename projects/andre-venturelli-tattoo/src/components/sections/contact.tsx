"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";

export function Contact() {
  return (
    <section id="contato" className="border-t border-line/40 bg-surface py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <Reveal className="flex items-center gap-4">
          <Image
            src={site.assets.logo}
            alt={site.name}
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
          />
        </Reveal>

        <Reveal delay={0.06}>
          <button
            type="button"
            onClick={() =>
              openWhatsApp("Olá André! Gostaria de solicitar um orçamento de tatuagem.")
            }
            className="font-mono text-sm text-ink transition-colors hover:text-accent"
          >
            WhatsApp {site.whatsappDisplay}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
