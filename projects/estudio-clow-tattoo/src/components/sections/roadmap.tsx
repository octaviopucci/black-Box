"use client";

import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Roadmap() {
  return (
    <section id="trajetoria" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader
            index="004"
            label="Trajetória"
            title="A jornada artística de Rafael Mactura — do grafite à tatuagem, do Brasil à França."
          />
        </Reveal>

        <div className="mt-16 space-y-0">
          {site.roadmap.map((item, index) => (
            <Reveal key={item.year} delay={index * 0.06}>
              <article className="grid gap-6 border-t border-line/40 py-10 md:grid-cols-[80px_1fr_auto] md:items-start">
                <span className="font-mono text-4xl font-light text-line">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-lg font-medium text-ink md:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
                    {item.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-mute"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="font-mono text-2xl font-light text-mute/40 md:text-right">
                  {item.year.slice(2)}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
