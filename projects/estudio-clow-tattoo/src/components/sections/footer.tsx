"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";

export function Footer() {
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
              Arte que fica marcada para sempre. Tatuagens exclusivas com
              técnica, personalidade e dedicação em cada detalhe.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-mute">
              Links rápidos
            </h4>
            <nav className="mt-6 space-y-3">
              {site.nav.map((item) => (
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
              Contato
            </h4>
            <div className="mt-6 space-y-4 text-sm text-mute">
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-ink"
              >
                WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @studioclownarttattoo
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
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
