import Image from "next/image";
import Link from "next/link";
import { focusLine, leadQuote, media, site } from "@/data/site";

export function Opening() {
  return (
    <header className="border-b-2 border-[var(--ink)]">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[1fr_auto]">
        <div className="border-b-2 border-[var(--ink)] px-6 py-10 md:px-12 md:py-16 lg:border-b-0 lg:border-r-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--accent)]">
            Tatuador · @{site.handle}
          </p>
          <h1 className="font-serif mt-6 text-[clamp(3rem,11vw,6.5rem)] leading-[0.92] text-[var(--ink)]">
            {site.name}
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--mute)]">
            {focusLine}
          </p>
          <Link
            href={site.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block border-2 border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--paper)] transition-colors hover:bg-transparent hover:text-[var(--ink)]"
          >
            Agendar · link na bio
          </Link>
        </div>

        <div className="relative flex flex-col items-center justify-center gap-6 px-6 py-10 md:px-12">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[var(--ink)] md:h-52 md:w-52">
            <Image
              src={media.profile}
              alt={site.name}
              fill
              className="object-cover"
              sizes="208px"
              priority
            />
          </div>
          <p className="font-mono text-center text-[11px] leading-relaxed tracking-wide text-[var(--mute)]">
            {site.followers.toLocaleString("pt-BR")} seguidores
            <br />
            <Link
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              instagram.com/{site.handle}
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
}

export function Manifesto() {
  return (
    <section className="border-b-2 border-[var(--ink)] bg-[var(--paper-warm)]">
      <blockquote className="mx-auto max-w-[90rem] px-6 py-16 md:px-12 md:py-24">
        <p className="font-serif text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.25] text-[var(--ink)]">
          &ldquo;{leadQuote}&rdquo;
        </p>
        <footer className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--mute)]">
          — caption oficial @{site.handle}
        </footer>
      </blockquote>
    </section>
  );
}
