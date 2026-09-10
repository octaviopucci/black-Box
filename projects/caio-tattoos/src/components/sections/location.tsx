"use client";

import { MapPin, MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";

export function Location() {
  const { t } = useLocale();

  return (
    <section id="contato" className="relative bg-surface py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            {t.location.label}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
            {t.location.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 space-y-8">
          <div className="flex gap-5 border border-ink/10 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/15 bg-[#25D366]/10">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.24em] text-ink">
                WhatsApp
              </h3>
              <p className="mt-2 font-light leading-relaxed text-mute">
                {t.location.whatsappNote}
              </p>
              <button
                type="button"
                onClick={() =>
                  openWhatsApp("Olá! Vi o site e quero orçamento / lista de espera.")
                }
                className="mt-4 inline-flex items-center gap-2 border border-[#25D366]/40 bg-[#25D366] px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#1da851]"
              >
                {t.location.whatsappButton}
              </button>
            </div>
          </div>

          <div className="flex gap-5 border border-ink/10 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/15">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.24em] text-ink">
                {t.location.address}
              </h3>
              <p className="mt-2 font-light leading-relaxed text-mute">
                {site.location} · {t.location.cityNote}
              </p>
            </div>
          </div>

          <div className="flex gap-5 border border-ink/10 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.24em] text-ink">
                Instagram
              </h3>
              <p className="mt-2 font-light leading-relaxed text-mute">
                {site.instagram.followers.toLocaleString("pt-BR")} seguidores ·{" "}
                {site.instagram.handle}
              </p>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 border border-ink/15 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {t.location.directions}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
