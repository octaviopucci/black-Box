"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { portfolio } from "@/data/site";

export function Portfolio() {
  const reduceMotion = useReducedMotion();
  const featured = portfolio.filter((p) => p.featured);
  const rest = portfolio.filter((p) => !p.featured);

  return (
    <section id="portfolio" className="border-t border-[var(--ink-border)] bg-[var(--paper-elevated)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs tracking-[0.35em] text-[var(--accent)] uppercase">
              Portfolio
            </p>
            <h2 className="font-display mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-[var(--ink)] uppercase">
              Trabalhos reais
            </h2>
          </div>
          <Link
            href="https://www.instagram.com/octaviopuccitattoo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.15em] text-[var(--mute)] uppercase transition-colors hover:text-[var(--accent)]"
          >
            Ver mais no Instagram →
          </Link>
        </motion.div>

        <div className="mt-16 grid gap-4 md:grid-cols-12 md:gap-6">
          {featured.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.1, duration: 0.55 }}
              className={`group relative overflow-hidden ${
                index === 0
                  ? "md:col-span-7 md:row-span-2"
                  : index === 1
                    ? "md:col-span-5"
                    : "md:col-span-5"
              }`}
            >
              <Link
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[4/5] md:aspect-auto md:h-full md:min-h-[280px]"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-transparent to-transparent opacity-80" />
                {item.caption && (
                  <p className="absolute inset-x-0 bottom-0 p-6 text-sm leading-relaxed text-[var(--ink)]/90">
                    {item.caption}
                  </p>
                )}
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 columns-2 gap-4 md:columns-3 md:gap-6">
          {rest.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
              className="group mb-4 break-inside-avoid md:mb-6"
            >
              <Link
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={640}
                  height={800}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
