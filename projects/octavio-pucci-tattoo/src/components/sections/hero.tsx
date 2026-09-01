"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { media, site } from "@/data/site";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={media.hero}
          alt="Fechamento de braço em realismo preto e cinza por Octávio Pucci"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/60 to-[var(--paper)]/20" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-20 pt-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs tracking-[0.35em] text-[var(--accent)] uppercase">
            {site.tagline} · {site.location}
          </p>
          <h1 className="font-display text-[clamp(3.5rem,12vw,7.5rem)] leading-[0.88] tracking-tight text-[var(--ink)] uppercase">
            {site.brand.split(" ").map((word, i) => (
              <motion.span
                key={word}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + i * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--mute)] md:text-lg">
            {site.promise}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--accent)] px-8 py-4 text-xs font-medium tracking-[0.15em] text-[var(--paper)] uppercase transition-opacity hover:opacity-90"
            >
              Falar no WhatsApp
            </Link>
            <Link
              href="#portfolio"
              className="border border-[var(--ink-border)] px-8 py-4 text-xs tracking-[0.15em] text-[var(--ink)] uppercase transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ver portfolio
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 flex items-center gap-4 border-t border-[var(--ink-border)] pt-6"
        >
          <Image
            src={media.profile}
            alt="Octávio Pucci"
            width={48}
            height={48}
            className="rounded-full object-cover ring-1 ring-[var(--accent)]/40"
          />
          <div>
            <p className="text-sm text-[var(--ink)]">@{site.handle}</p>
            <p className="text-xs text-[var(--mute)]">
              {site.followers.toLocaleString("pt-BR")} seguidores no Instagram
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
