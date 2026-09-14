import Link from "next/link";
import { site } from "@/data/site";

export function Reserve() {
  return (
    <section className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto grid max-w-[90rem] md:grid-cols-2">
        <div className="border-b-2 border-[var(--paper)] px-6 py-14 md:border-b-0 md:border-r-2 md:px-12 md:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--accent-light)]">
            Contato
          </p>
          <h2 className="font-serif mt-6 text-4xl leading-tight md:text-5xl">
            Quer um fechamento ou projeto autoral?
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--paper)]/75">
            Me chama no link da bio para cotação — vagas limitadas para
            coberturas, reformas e projetos em preto &amp; cinza.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4 px-6 py-14 md:px-12 md:py-20">
          <Link
            href={site.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-[var(--paper)] px-8 py-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
          >
            WhatsApp / Instagram
          </Link>
          <Link
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--paper)]/60 hover:text-[var(--paper)]"
          >
            @{site.handle}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Colophon() {
  return (
    <footer className="px-6 py-8 md:px-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
        {site.name} · imagens e textos de @{site.handle} · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
