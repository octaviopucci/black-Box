"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { BioLink } from "@/data/bio";
import { bio } from "@/data/bio";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

function LinkIcon({ icon }: { icon?: BioLink["icon"] }) {
  if (icon === "instagram") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (icon === "clinic") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 20V8l8-5 8 5v12H4Z" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" />
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
          link.variant === "accent" &&
            "border-accent bg-accent/[0.08] hover:bg-accent/[0.12]",
          link.variant === "ghost" &&
            "border-accent/40 hover:border-accent hover:bg-elevated/60",
          !link.variant && "border-line hover:border-accent/60 hover:bg-elevated/60",
        )}
      >
        <span className="mt-0.5 shrink-0 text-accent">
          <LinkIcon icon={link.icon} />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-medium text-ink">{link.label}</span>
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep via-[#141a12] to-[#0a0e09]" />
      <div className="pointer-events-none absolute -right-[30%] top-0 h-[60vmin] w-[60vmin] rounded-full bg-accent/25 blur-[100px]" />
      <div className="pointer-events-none absolute -left-[20%] bottom-[10%] h-[40vmin] w-[40vmin] rounded-full bg-warm/10 blur-[80px]" />
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
          <p className="mt-1 text-sm font-medium text-accent-soft">{bio.title}</p>
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
