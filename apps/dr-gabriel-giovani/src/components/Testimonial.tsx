import { site } from '@/data/site'

export function Testimonial() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />
      <div className="relative mx-auto max-w-[900px] text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-soft">Depoimento</p>
        <blockquote className="mt-8 font-display text-[clamp(1.5rem,3.5vw,2.4rem)] font-normal italic leading-[1.35] tracking-[-0.01em] text-paper">
          &ldquo;{site.testimonial.quote}&rdquo;
        </blockquote>
        <p className="mt-8 text-sm text-paper/50">{site.testimonial.context}</p>
        <a
          href={site.testimonial.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.14em] text-teal-soft transition-colors hover:text-paper"
        >
          {site.testimonial.source} →
        </a>
      </div>
    </section>
  )
}
