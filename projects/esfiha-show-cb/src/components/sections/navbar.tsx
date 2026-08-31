"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "#sabores", label: "Sabores" },
  { href: "#galeria", label: "Galeria" },
  { href: "#local", label: "Local" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-ink/90 backdrop-blur-md text-paper"
          : "bg-transparent text-paper"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="#topo"
          className="display text-lg tracking-widest uppercase md:text-xl"
          aria-label={`${site.name} — início`}
        >
          {site.name}
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={site.links.delivery}
          target="_blank"
          rel="noopener noreferrer"
          className="display bg-brand px-4 py-2 text-sm uppercase tracking-wider text-paper transition-transform hover:scale-[1.02] md:px-5 md:py-2.5 md:text-base"
        >
          {site.cta.primary}
        </a>
      </nav>
    </header>
  );
}
