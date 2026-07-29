import { site, whatsappUrl } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function Journey() {
  return (
    <section id="cuidado" className="relative scroll-mt-24 overflow-hidden bg-navy py-24 text-snow sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-helix opacity-40" />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-aqua/15 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-life/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          light
          eyebrow="Jornada de cuidado"
          title="Três passos. Zero fricção."
          subtitle="Do primeiro contato ao acompanhamento — uma experiência fluida, humana e clara."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {site.journey.map((item, i) => (
            <Reveal key={item.step} delay={0.1 * i}>
              <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-snow/10 bg-snow/[0.04] p-7 backdrop-blur-sm transition hover:border-aqua/40 hover:bg-snow/[0.07]">
                <p className="font-display text-5xl font-semibold text-aqua/40 transition group-hover:text-aqua">
                  {item.step}
                </p>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-snow/65">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25} className="mt-12">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-snow px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-aqua-soft"
          >
            Começar pelo WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}
