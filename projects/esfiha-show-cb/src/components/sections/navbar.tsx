"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { menuStats } from "@/data/menu";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#combos", label: "Combos" },
  { href: "#como-pedir", label: "Como pedir" },
  { href: "#local", label: "Local" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-white/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-show-dark/95 backdrop-blur-sm"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
        <Link href="#topo" className="flex shrink-0 items-center gap-3">
          <Image
            src={site.brand.logo}
            alt={site.name}
            width={44}
            height={44}
            className="rounded-full ring-2 ring-show-green"
          />
          <div className={cn("leading-tight", scrolled ? "text-show-dark" : "text-white")}>
            <p className="display text-base md:text-lg">{site.name}</p>
            <p className="text-[11px] font-medium opacity-80 md:text-xs">{site.unit}</p>
          </div>
        </Link>

        <ul className="ml-auto hidden items-center gap-6 lg:flex">
          {nav.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-opacity hover:opacity-100",
                  scrolled ? "text-show-muted opacity-90" : "text-white/85"
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <span
            className={cn(
              "hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider md:inline",
              scrolled ? "bg-show-green/15 text-show-green-dark" : "bg-show-green text-white"
            )}
          >
            Aberto · {site.hours.display}
          </span>
          <a
            href={site.links.delivery}
            target="_blank"
            rel="noopener noreferrer"
            className="display rounded-md bg-show-green-dark px-4 py-2 text-sm text-white transition-transform hover:scale-[1.02]"
          >
            Pedir
          </a>
        </div>
      </nav>

      <div
        className={cn(
          "border-t px-4 py-1.5 text-center text-[11px] md:hidden",
          scrolled ? "border-border bg-show-green/10 text-show-green-dark" : "border-white/10 bg-show-green-dark text-white"
        )}
      >
        {menuStats.items} itens · {site.hours.display} · Centro, Capão Bonito
      </div>
    </header>
  );
}
