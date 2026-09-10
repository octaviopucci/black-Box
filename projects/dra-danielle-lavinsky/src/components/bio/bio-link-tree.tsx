"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { BioLink } from "@/data/bio";
import { bio } from "@/data/bio";
import { easePremium } from "@/lib/motion";
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
  if (icon === "map") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (icon === "phone") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
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
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BioLinkButton({ link, index }: { link: BioLink; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easePremium, delay: 0.35 + index * 0.07 }}
    >
      <a
        href={link.href}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
        className={cn(
          "group flex w-full items-start gap-4 border-l-2 py-4 pl-5 pr-2 transition-colors duration-500",
          link.variant === "whatsapp" &&
            "border-wa bg-wa/[0.08] hover:bg-wa/[0.12]",
          link.variant === "ghost" &&
            "border-accent/40 hover:border-accent hover:bg-elevated/60",
          !link.variant &&
            "border-line hover:border-accent/60 hover:bg-elevated/60",
          link.variant !== "whatsapp" && !link.variant && "border-line",
        )}
      >
        <span
          className={cn(
            "mt-0.5 shrink-0",
            link.variant === "whatsapp" ? "text-wa" : "text-accent",
          )}
        >
          <LinkIcon icon={link.icon} />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span
            className={cn(
              "block font-medium",
              link.variant === "whatsapp" ? "text-ink" : "text-ink",
            )}
          >
            {link.label}
          </span>
          {link.description ? (
            <span className="mt-1 block text-sm leading-relaxed text-mute">
              {link.description}
            </span>
          ) : null}
        </span>
        <span className="mt-1 shrink-0 text-mute/50 transition group-hover:translate-x-0.5 group-hover:text-accent">
          →
        </span>
      </a>
    </motion.li>
  );
}

export function BioLinkTree() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-deep text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep via-[#122028] to-[#0a1218]" />
      <div className="pointer-events-none absolute -right-[30%] top-0 h-[60vmin] w-[60vmin] rounded-full bg-accent/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-[20%] bottom-[10%] h-[40vmin] w-[40vmin] rounded-full bg-accent-soft/10 blur-[80px]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 py-14">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easePremium }}
          className="text-center"
        >
          <div className="relative mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/15 ring-offset-2 ring-offset-deep">
            <Image
              src={bio.profile}
              alt={bio.name}
              fill
              priority
              sizes="112px"
              className="object-cover"
            />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
            {bio.handle}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,8vw,2.75rem)] font-semibold leading-[0.95] tracking-tight">
            {bio.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {bio.tagline}
          </p>
        </motion.header>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 text-center text-xs leading-relaxed text-white/40"
        >
          {bio.bio}
        </motion.p>

        <ul className="mt-10 flex-1 space-y-1 rounded-xl bg-paper/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          {bio.links.map((link, i) => (
            <BioLinkButton key={link.id} link={link} index={i} />
          ))}
        </ul>

        <motion.footer
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
            {bio.credential}
          </p>
          <p className="mt-2 text-[10px] text-white/25">{bio.source}</p>
        </motion.footer>
      </div>
    </div>
  );
}
