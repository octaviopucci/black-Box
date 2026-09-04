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
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 32));
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-black/90 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() => navigate("#inicio")}
            className="relative z-10 shrink-0"
            aria-label="StudioClownTattoo início"
          >
            <Image
              src={site.assets.logo}
              alt={site.name}
              width={140}
              height={56}
              priority
              sizes="140px"
              className={cn(
                "w-auto brightness-0 invert transition-all duration-300",
                scrolled ? "h-9" : "h-11 md:h-12",
              )}
            />
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {site.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => navigate("#orcamento")}
            className="btn-pill-primary hidden !px-5 !py-2.5 !text-[10px] lg:inline-flex"
          >
            Orçamento →
          </button>

          <button
            type="button"
            className="relative z-10 text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black pt-24 lg:hidden">
          <div className="flex flex-col gap-6 px-8">
            {site.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="text-left font-mono text-sm uppercase tracking-[0.2em] text-white"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="btn-pill-primary mt-4 w-fit"
              onClick={() => navigate("#orcamento")}
            >
              Orçamento →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
