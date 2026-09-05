"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { scrollToHash } from "@/lib/whatsapp";

export function Footer() {
  const { t } = useLocale();
  const siteData = useSite();

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src={site.assets.logo}
              alt={site.name}
              width={140}
              height={56}
              className="h-11 w-auto"
            />
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-mute">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-mute">
              {t.footer.quickLinks}
            </h4>
            <nav className="mt-6 space-y-3">
              <a
                href="/bio"
                className="block text-sm text-mute transition-colors hover:text-accent"
              >
                Links
              </a>
              {siteData.nav.filter((item) => item.href !== "#processo").map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => scrollToHash(item.href)}
                  className="block text-sm text-mute transition-colors hover:text-ink"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-mute">
              {t.footer.contact}
            </h4>
            <div className="mt-6 space-y-4 text-sm text-mute">
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-accent"
              >
                WhatsApp (15) 99755-4244
              </a>
              <p className="flex items-start gap-2 font-light leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/10 pt-8 text-center text-xs tracking-wider text-mute/80">
          © {new Date().getFullYear()} {site.name}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
