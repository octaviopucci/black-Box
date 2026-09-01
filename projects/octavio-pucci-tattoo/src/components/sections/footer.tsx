import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--ink-border)] bg-[var(--paper)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
        <p className="font-display text-sm tracking-[0.2em] text-[var(--ink)] uppercase">
          {site.brand} · {site.tagline}
        </p>
        <p className="text-xs text-[var(--mute)]">
          Conteúdo e imagens extraídos de{" "}
          <Link
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            @{site.handle}
          </Link>
        </p>
      </div>
    </footer>
  );
}
