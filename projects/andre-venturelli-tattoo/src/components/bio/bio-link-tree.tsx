"use client";

import Image from "next/image";
import type { BioLink } from "@/data/bio";
import { bio } from "@/data/bio";
import { PhotoRoll } from "@/components/artifacts/photo-roll";
import { ParticleField } from "@/components/artifacts/particle-field";
import { cn } from "@/lib/utils";

function LinkIcon({ icon }: { icon?: BioLink["icon"] }) {
  if (icon === "whatsapp") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (icon === "site") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "map") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BioLinkButton({ link, index }: { link: BioLink; index: number }) {
  return (
    <li
      className="bio-link-item"
      style={{ animationDelay: `${0.35 + index * 0.07}s` }}
    >
      <a
        href={link.href}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
        className={cn(
          "group flex w-full items-start gap-4 border-l-2 py-4 pl-5 pr-2 transition-colors duration-500",
          link.variant === "accent" &&
            "border-accent bg-accent/[0.12] hover:bg-accent/[0.18]",
          link.variant === "ghost" &&
            "border-white/15 hover:border-accent hover:bg-white/[0.04]",
          !link.variant && "border-line hover:border-accent/60 hover:bg-white/[0.04]",
        )}
      >
        <span
          className={cn(
            "mt-0.5 shrink-0",
            link.variant === "accent" ? "text-accent" : "text-accent-soft",
          )}
        >
          <LinkIcon icon={link.icon} />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-medium text-ink">{link.label}</span>
          {link.description ? (
            <span className="mt-1 block text-sm leading-relaxed text-mute">{link.description}</span>
          ) : null}
        </span>
        <span className="mt-1 shrink-0 text-mute/50 transition group-hover:translate-x-0.5 group-hover:text-accent">
          →
        </span>
      </a>
    </li>
  );
}

export function BioLinkTree() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-ink">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <PhotoRoll fixed className="absolute inset-0" />

        <div className="absolute inset-0 z-[2] bg-black/28" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-black/10 to-black/5" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

        <ParticleField scrollProgress={0} />
        <div className="grain absolute inset-0 z-[3] opacity-[0.035]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-14">
        <header className="bio-enter text-center">
          <div className="relative mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/15 ring-offset-2 ring-offset-black">
            <Image
              src={bio.profile}
              alt={bio.name}
              fill
              priority
              sizes="112px"
              className="object-cover object-top grayscale-[0.15]"
            />
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            {bio.handle}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,8vw,2.75rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {bio.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-accent-soft">{bio.title}</p>
          <p className="mx-auto mt-4 max-w-xs font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            {bio.tagline}
          </p>
        </header>

        <p className="bio-enter mt-8 text-center text-xs leading-relaxed text-mute [animation-delay:0.2s]">
          {bio.bio}
        </p>

        <ul className="bio-enter mt-10 flex-1 space-y-1 rounded-xl border border-white/10 bg-black/75 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md [animation-delay:0.28s]">
          {bio.links.map((link, i) => (
            <BioLinkButton key={link.id} link={link} index={i} />
          ))}
        </ul>

        <footer className="bio-enter mt-10 text-center [animation-delay:0.85s]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-mute/80">{bio.credential}</p>
          <p className="mt-2 font-mono text-[10px] text-white/25">{bio.source}</p>
        </footer>
      </div>
    </div>
  );
}
