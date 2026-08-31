"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { media, site } from "@/data/site";

export function Gallery() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="galeria" className="bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-glow">
              Instagram
            </p>
            <h2 className="display mt-3 text-[clamp(2.5rem,6vw,4rem)] uppercase">
              Direto do forno
            </h2>
          </div>
          <a
            href={site.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-paper/70 transition-colors hover:text-paper"
          >
            {site.social.instagramHandle}
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {media.gallery.map((item, i) => (
            <motion.figure
              key={item.src}
              className="relative aspect-[4/5] overflow-hidden"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-4 py-6 text-sm text-paper/90">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
