import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Reviews() {
  return (
    <section id="avaliacoes" className="border-t border-line/60 bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Relatos"
            title="Quem já passou por aqui"
            description="Exemplos para você substituir pelos depoimentos reais."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {site.reviews.map((review, i) => (
            <Reveal key={review.quote} delay={i * 0.1}>
              <figure>
                {review.placeholder ? (
                  <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-800/80">
                    Exemplo
                  </span>
                ) : null}
                <blockquote className="font-display text-xl leading-snug text-ink md:text-2xl">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-mute">
                  — {review.author} · {review.location}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
