import { Reveal } from "@/components/motion/reveal"
import { site, treatments } from "@/data/site"

export function Features() {
  return (
    <section
      id="tratamentos"
      className="border-t border-[hsl(var(--ink)/0.06)] bg-[hsl(var(--paper))] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[hsl(var(--accent))]">
            Tratamentos
          </p>
          <h2 className="mt-4 max-w-lg font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-[hsl(var(--ink))]">
            Um plano claro para cada sorriso
          </h2>
          <p className="mt-4 max-w-xl text-[hsl(var(--mute))]">{site.promise}</p>
        </Reveal>

        <div className="mt-16 divide-y divide-[hsl(var(--ink)/0.08)]">
          {treatments.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <article className="grid gap-6 py-12 md:grid-cols-[6rem_1fr] md:gap-12 md:py-16">
                <p className="font-display text-5xl leading-none text-[hsl(var(--accent)/0.35)] md:text-6xl">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-2xl text-[hsl(var(--ink))] md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-lg text-[hsl(var(--ink)/0.85)]">
                    {item.line}
                  </p>
                  <p className="mt-4 max-w-2xl text-[hsl(var(--mute))]">
                    {item.detail}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
