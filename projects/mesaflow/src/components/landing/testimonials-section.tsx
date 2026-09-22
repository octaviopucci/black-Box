import { TESTIMONIALS } from "@/components/landing/landing-data";
import { SectionShell } from "@/components/landing/section-shell";

function StarRow() {
  return (
    <div className="flex gap-0.5 text-brand" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden className="text-sm">
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <SectionShell id="depoimentos" title="Prova social">
      <div className="grid gap-4 md:grid-cols-3">
        {/* PROVISIONAL_TESTIMONIAL — temporário até depoimentos reais de clientes */}
        {TESTIMONIALS.map((t) => (
          <article
            key={t.name}
            data-provisional="true"
            className="flex flex-col rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5"
          >
            <StarRow />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <footer className="mt-4 flex items-center gap-3 border-t border-[#2a2a2a] pt-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand"
                aria-hidden
              >
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted">
                  {t.role} · {t.city}
                </p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
