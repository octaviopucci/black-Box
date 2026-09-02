"use client";

import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function ArtistStory() {
  return (
    <section id="historia" className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.4em] text-mute">
            A História do Artista
          </p>
          <h2 className="mt-4 text-center font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-ink">
            {site.artistStory.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 max-h-[min(70vh,640px)] space-y-5 overflow-y-auto border border-line/60 bg-paper p-6 text-sm leading-relaxed text-mute md:p-8 md:text-base">
            {site.artistStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
