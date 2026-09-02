"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 48));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    scrollToHash(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled ? "border-b border-line/80 bg-paper/95" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
          <button
            type="button"
            onClick={() => navigate("#inicio")}
            className="relative z-10 shrink-0"
            aria-label="StudioClownTattoo início"
          >
            <Image
              src={site.assets.logo}
              alt={site.name}
              width={160}
              height={64}
              priority
              sizes="160px"
              className={cn(
                "w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300",
                scrolled ? "h-12" : "h-16 md:h-20",
              )}
            />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {site.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="text-xs uppercase tracking-[0.32em] text-mute transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => navigate("#orcamento")}
              className="border border-ink/25 px-6 py-2.5 text-xs uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ink/10"
            >
              Orçamento
            </button>
          </div>

          <button
            type="button"
            className="relative z-10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-paper lg:hidden">
          <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
            {site.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="font-display text-3xl italic text-ink"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
