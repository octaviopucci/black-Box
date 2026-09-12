"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { media, site } from "@/data/site";

export function Gallery() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="galeria" className="bg-show-paper py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-show-green-dark">
              Instagram · {site.social.followers.toLocaleString("pt-BR")} seguidores
            </p>
            <h2 className="display mt-2 text-4xl text-show-dark md:text-5xl">
              Direto do forno
            </h2>
          </div>
          <a
            href={site.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-show-green-dark hover:underline"
          >
            {site.social.instagramHandle} →
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {media.gallery.map((item, i) => (
            <motion.figure
              key={item.src}
              className="group relative aspect-square overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-border"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-show-dark/90 to-transparent p-4 text-sm text-white">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
