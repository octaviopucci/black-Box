import { ArrowUpRight } from 'lucide-react'
import { Shell } from '../components/Shell'
import { Reveal } from '../components/Reveal'
import { asset, site, whatsappUrl } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

export function EndodontiaPage() {
  usePageMeta(site.seo.endodontia.title, site.seo.endodontia.description)

  return (
    <Shell>
      <section className="relative overflow-hidden bg-wine-deep px-5 pb-16 pt-28 text-cream sm:px-8 sm:pb-24 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <Reveal immediate>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">
              Ofício
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {site.craft.line}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/70">{site.craft.detail}</p>
            <a href={whatsappUrl()} className="cta-signal mt-8" data-cursor>
              Tirar dúvida no WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal className="overflow-hidden rounded-[2rem]">
            <img
              src={asset('care/odontologia.jpg')}
              alt="Endodontia na Clínica Matsubara"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <div>
            <Reveal>
              <h2 className="display-title text-3xl text-ink sm:text-4xl">Quando a escuta indica canal</h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {site.craft.when.map((item, i) => (
                <Reveal key={item} delay={0.05 * i}>
                  <li className="flex gap-3 border-t border-line pt-4 text-sm leading-relaxed text-mute sm:text-base">
                    <span className="font-display text-wine">0{i + 1}</span>
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-6xl gap-8 sm:grid-cols-3">
          {site.craft.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={0.06 * i}>
              <article className="border-t border-line pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-signal">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl text-ink">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{pillar.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-20 max-w-6xl">
          <h2 className="display-title text-3xl text-ink sm:text-4xl">O caminho até o resultado</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {site.journey.map((step) => (
              <div key={step.step} className="border-t border-wine/30 pt-5">
                <p className="font-display text-4xl text-wine">{step.step}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{step.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-wine-deep px-5 py-16 text-cream sm:px-8 sm:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-script text-3xl text-rose-soft sm:text-4xl">{site.promise}</p>
          <p className="mt-4 text-sm text-cream/60">
            Conte o que você sente. Eu oriento o próximo passo com clareza.
          </p>
          <a href={whatsappUrl()} className="cta-signal mt-8" data-cursor>
            Agendar avaliação
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </section>
    </Shell>
  )
}
