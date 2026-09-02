"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { media, site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function InstagramFeed() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-8%"]);

  const posts = media.gallery.filter((p) => p.caption.length > 0 || p.src);

  return (
    <section id="feed" className="overflow-hidden border-t border-line/60 bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow={`Instagram · ${site.instagram.followers.toLocaleString("pt-BR")} seguidores`}
            title="Conteúdo do consultório"
            description="Estética, naturalidade e cuidado — direto do feed da Dra. Barbara."
          />
        </Reveal>
      </div>

      <motion.div
        ref={trackRef}
        style={reduceMotion ? undefined : { x }}
        className="mt-14 flex gap-4 px-6 md:gap-5 md:px-10"
      >
        {posts.slice(0, 8).map((post) => (
          <a
            key={post.src}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[4/5] w-[min(72vw,280px)] shrink-0 overflow-hidden bg-ink/5"
          >
            <Image
              src={post.src}
              alt={post.caption.slice(0, 80) || "Post do Instagram"}
              fill
              sizes="280px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            {post.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-100">
                <p className="line-clamp-3 text-xs leading-relaxed text-white/90">
                  {post.caption.replace(/[#@][\w.]+/g, "").slice(0, 120)}
                </p>
              </div>
            ) : null}
          </a>
        ))}
      </motion.div>

      <div className="mx-auto mt-10 max-w-7xl px-6 text-center md:px-10">
        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-accent transition hover:text-accent-soft"
        >
          Ver perfil {site.instagram.handle} →
        </a>
      </div>
    </section>
  );
}
