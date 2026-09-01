"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    scrollToHash(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-ink/10 bg-paper/80 backdrop-blur-xl"
            : "bg-transparent",
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
              className={cn(
                "w-auto transition-all duration-500",
                scrolled ? "h-10" : "h-14 md:h-16",
              )}
            />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {site.nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="text-[11px] uppercase tracking-[0.32em] text-mute transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => navigate("#orcamento")}
              className="border border-ink/20 px-6 py-2.5 text-[11px] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ink hover:text-paper"
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-paper/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
              {site.nav.map((item, index) => (
                <motion.button
                  key={item.href}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(item.href)}
                  className="font-display text-3xl italic text-ink"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
