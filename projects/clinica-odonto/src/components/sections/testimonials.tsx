import { Reveal } from "@/components/motion/reveal"
import { testimonials } from "@/data/site"

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="bg-[hsl(var(--ink))] py-24 text-[hsl(var(--paper))] md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[hsl(var(--accent-light))]">
            Depoimentos
          </p>
          <h2 className="mt-4 max-w-md font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05]">
            Quem confia no nosso cuidado
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {testimonials.map((item, index) => (
            <Reveal key={item.who} delay={index * 0.1}>
              <blockquote className="flex h-full flex-col justify-between">
                <p className="text-lg leading-relaxed text-[hsl(var(--paper)/0.88)]">
                  &ldquo;{item.text}&rdquo;
                </p>
                <footer className="mt-8 border-t border-[hsl(var(--paper)/0.12)] pt-6">
                  <cite className="not-italic font-medium text-[hsl(var(--paper))]">
                    {item.who}
                  </cite>
                  <p className="mt-1 text-sm text-[hsl(var(--paper)/0.55)]">
                    {item.role}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
