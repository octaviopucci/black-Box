"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";
import { scrollToHash } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Início vira o logo; "Quero comprar" vira o botão de destaque.
const desktopNav = site.nav.filter(
  (item) => item.href !== "#inicio" && item.href !== "#orcamento",
);

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
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled ? "border-b border-line/60 bg-paper/95 backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() => navigate("#inicio")}
            className="relative z-10 flex items-center gap-3"
            aria-label={`${site.name} início`}
          >
            <Image
              src={asset(site.assets.logo)}
              alt=""
              width={94}
              height={30}
              priority
              className="h-7 w-auto"
            />
            <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-ink sm:inline">
              {site.name}
            </span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {desktopNav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => navigate("#orcamento")}
            className="btn-primary hidden text-[10px] lg:inline-flex"
          >
            Quero comprar
          </button>

          <button
            type="button"
            className="relative z-10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-paper pt-24 lg:hidden">
          <div className="flex flex-col gap-6 px-8">
            {site.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="text-left font-mono text-sm uppercase tracking-[0.2em] text-ink"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="btn-primary mt-4 w-fit"
              onClick={() => navigate("#orcamento")}
            >
              Quero comprar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
