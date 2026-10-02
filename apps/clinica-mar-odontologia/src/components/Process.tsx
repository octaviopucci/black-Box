import { processSteps, whatsappUrl } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Process() {
  return (
    <section id="processo" className="bg-mar-ink py-24 text-white md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-peach">
            Como funciona
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-white">
            Da primeira mensagem ao acompanhamento contínuo.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.08}>
              <article className="border-t border-white/15 pt-6">
                <span className="font-display text-4xl text-mar-peach/80">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-2xl text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/72">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border-b border-mar-peach pb-1 text-sm uppercase tracking-[0.2em] text-mar-peach transition-colors hover:border-white hover:text-white"
          >
            Iniciar pelo WhatsApp
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
