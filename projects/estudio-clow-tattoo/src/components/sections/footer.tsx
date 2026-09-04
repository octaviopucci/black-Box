"use client";

import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line/40 bg-paper py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute/50">
          São Paulo, SP
        </p>
      </div>
    </footer>
  );
}
