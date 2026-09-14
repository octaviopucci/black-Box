"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { site, media } from "@/data/site";
import { menuStats, formatPrice } from "@/data/menu";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="topo" className="relative overflow-hidden bg-show-dark pt-28 md:pt-32">
      <div className="absolute inset-0 opacity-30">
        <Image src={media.hero} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-show-dark via-show-dark/90 to-show-green-dark/40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 md:px-8 md:pb-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-show-green px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Aberto agora · {site.hours.display}
          </div>

          <div className="mb-6 flex items-center gap-5">
            <Image
              src={site.brand.logo}
              alt={site.name}
              width={96}
              height={96}
              className="rounded-2xl shadow-2xl ring-4 ring-show-yellow/80"
              priority
            />
            <div>
              <h1 className="display text-5xl leading-none text-white md:text-7xl">
                {site.name}
              </h1>
              <p className="mt-1 text-lg font-medium text-show-yellow md:text-xl">
                {site.unit}
              </p>
            </div>
          </div>

          <p className="max-w-lg text-lg text-white/90 md:text-xl">{site.tagline}</p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-white/15 py-6">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Itens</dt>
              <dd className="display mt-1 text-3xl text-show-yellow">{menuStats.items}+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">A partir de</dt>
              <dd className="display mt-1 text-3xl text-white">{formatPrice(menuStats.priceFrom)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Google</dt>
              <dd className="display mt-1 text-3xl text-show-green">{site.proof.googleRating}★</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={site.links.delivery}
              target="_blank"
              rel="noopener noreferrer"
              className="display rounded-lg bg-show-orange px-8 py-3.5 text-lg text-show-dark shadow-lg transition-transform hover:scale-[1.02]"
            >
              {site.cta.primary}
            </a>
            <a
              href={site.phone.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="display rounded-lg border-2 border-white/40 px-8 py-3.5 text-lg text-white transition-colors hover:bg-white/10"
            >
              {site.cta.secondary}
            </a>
          </div>

          <p className="mt-4 text-sm text-white/60">{site.address.full}</p>
        </motion.div>

        <motion.div
          className="relative hidden md:block"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
            <Image
              src={media.heroSecondary}
              alt="Pizza e esfihas Esfiha Show"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-xl bg-show-yellow px-5 py-3 shadow-xl">
            <p className="display text-sm text-show-dark">Pizzas + esfihas</p>
            <p className="text-xs font-medium text-show-dark/70">Doces, combos e bebidas</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
