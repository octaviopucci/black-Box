"use client";

import Image from "next/image";
import { useRef } from "react";
import { media, site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function InstagramFeed() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="feed" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeader
            eyebrow="Instagram"
            title="Publicações reais do perfil"
            description={`${site.instagram.followers?.toLocaleString("pt-BR") ?? ""} seguidores · imagens extraídas de @${site.instagram.handle.replace("@", "")}`}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={scrollRef}
            className="mt-12 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {media.gallery.map((item, index) => (
              <a
                key={item.src}
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-[min(78vw,280px)] shrink-0"
              >
                <div className="bezel-outer">
                  <div className="bezel-inner relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={
                        item.caption
                          ? item.caption.slice(0, 80)
                          : `Post ${index + 1} — Dra. Fernanda Lira`
                      }
                      fill
                      sizes="280px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                    />
                    {item.isVideo ? (
                      <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-wider text-elevated">
                        Reel
                      </span>
                    ) : null}
                    {item.caption ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-12">
                        <p className="line-clamp-3 text-xs leading-relaxed text-elevated/95">
                          {item.caption}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 text-center">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-ink"
          >
            Ver perfil completo
            <span aria-hidden>↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
