"use client";

import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Contact() {
  const { t } = useLocale();
  const siteData = useSite();

  return (
    <section id="contato" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <SectionHeader
            index="006"
            label={t.contactSection.label}
            title={t.contactSection.title}
            description={t.contactSection.description}
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
              onClick={() => openWhatsApp(t.contactSection.whatsappMessage)}
              className="mt-3 block text-left text-lg text-ink transition-colors hover:text-accent"
            >
              (11) 98986-2547
            </button>
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
            </p>
            <p className="mt-4 whitespace-pre-line text-sm text-mute/70">
              {siteData.hours}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
