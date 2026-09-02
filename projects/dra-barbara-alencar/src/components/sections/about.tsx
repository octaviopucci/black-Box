import Image from "next/image";
import { media, site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="border-t border-line/60 bg-surface py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:items-center md:gap-20 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Sobre"
            title={site.about.title}
          />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-mute md:text-lg">
            {site.about.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 space-y-3 border-t border-line/60 pt-8">
            {site.about.highlights.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-ink md:text-base"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-mute">{site.about.source}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={media.portrait}
              alt="Dra. Barbara Alencar"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            {site.clinicSpace.description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
