"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/data/site";

const links = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#processo", label: "Processo" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--ink-border)] bg-[var(--paper)]/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="#"
          className="font-display text-lg tracking-[0.2em] text-[var(--ink)] uppercase"
        >
          {site.brand}
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs tracking-[0.15em] text-[var(--mute)] uppercase transition-colors hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[var(--accent)] px-4 py-2 text-xs tracking-[0.12em] text-[var(--accent)] uppercase transition-colors hover:bg-[var(--accent)] hover:text-[var(--paper)]"
        >
          Agendar
        </Link>
      </nav>
    </motion.header>
  );
}
