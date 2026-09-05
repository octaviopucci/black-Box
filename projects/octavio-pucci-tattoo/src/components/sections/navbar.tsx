"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { scrollToHash } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLocale();
  const siteData = useSite();
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-white/10 bg-black/90 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() => navigate("#inicio")}
            className="relative z-10 text-sm font-bold uppercase tracking-tighter text-white md:text-base"
            aria-label={t.navbar.brandAria}
          >
            {t.navbar.brand}
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {siteData.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="relative z-10 hidden items-center gap-4 lg:flex">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => navigate("#orcamento")}
              className="btn-pill-primary !px-5 !py-2.5 !text-[10px]"
            >
              {t.navbar.quote}
            </button>
          </div>

          <div className="relative z-10 flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="text-white"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t.navbar.closeMenu : t.navbar.openMenu}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black pt-24 lg:hidden">
          <div className="flex flex-col gap-6 px-8">
            {siteData.nav.map((item) => (
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
              {t.navbar.quote}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
