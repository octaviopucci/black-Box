import { site } from "@/data/site";
import { contactUrl } from "@/lib/contact";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function CtaBand() {
  return (
    <section className="border-t border-line/60 bg-deep py-24 text-white md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            {site.cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            {site.cta.description}
          </p>
          <div className="mt-10 flex justify-center">
            <MagneticButton variant="accent" href={contactUrl()}>
              Agendar pelo Instagram
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
