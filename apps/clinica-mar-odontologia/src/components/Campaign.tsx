import { campaign, whatsappUrl } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Campaign() {
  return (
    <section id="campanha" className="overflow-hidden bg-mar-mist">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
        <Reveal className="relative min-h-[320px] lg:min-h-[560px]">
          <img
            src={campaign.image}
            alt="Campanha Sorriso Premiado — Clínica Mar"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </Reveal>

        <div className="flex flex-col justify-center px-5 py-16 md:px-10 lg:py-24">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
              {campaign.title}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-mar-ink">
              {campaign.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mar-ink-soft">
              {campaign.body}
            </p>
            <p className="mt-4 text-base text-mar-ink">{campaign.cta}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-mar-wave">
              {campaign.source}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={campaign.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-mar-ink/15 px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-mar-ink transition-colors hover:border-mar-rose-deep hover:text-mar-rose-deep"
              >
                Ver no Instagram
              </a>
              <a
                href={whatsappUrl('Olá! Quero saber mais sobre a campanha Sorriso Premiado.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mar-peach px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-[#1a1512] transition-colors hover:bg-mar-peach-deep hover:text-white"
              >
                Tirar dúvidas
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
