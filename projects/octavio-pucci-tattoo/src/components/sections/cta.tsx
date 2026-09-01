"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { media, site } from "@/data/site";

export function Cta() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="contato" className="relative overflow-hidden border-t border-[var(--ink-border)]">
      <div className="absolute inset-0">
        <Image
          src="/instagram/post-6.jpg"
          alt=""
          fill
          className="object-cover object-top opacity-30"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[var(--paper)]/90" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Image
            src={media.profile}
            alt="Octávio Pucci"
            width={80}
            height={80}
            className="mx-auto rounded-full object-cover ring-2 ring-[var(--accent)]/50"
          />
          <h2 className="font-display mt-8 text-[clamp(2rem,6vw,4rem)] leading-[0.92] text-[var(--ink)] uppercase">
            Pronto para sua próxima tattoo?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--mute)]">
            Se você valoriza artes bem feitas e duráveis, com alto nível de
            dedicação — me chama no WhatsApp para um projeto único e exclusivo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--accent)] px-10 py-4 text-xs font-medium tracking-[0.15em] text-[var(--paper)] uppercase transition-opacity hover:opacity-90"
            >
              Agendar sessão
            </Link>
            <Link
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--ink-border)] px-10 py-4 text-xs tracking-[0.15em] text-[var(--ink)] uppercase transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              @{site.handle}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
