import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Shell } from '../components/Shell'
import { Reveal } from '../components/Reveal'
import { asset, site, whatsappUrl } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

export function SobrePage() {
  usePageMeta(site.seo.sobre.title, site.seo.sobre.description)

  return (
    <Shell>
      <section className="relative overflow-hidden bg-wine-deep px-5 pb-16 pt-28 text-cream sm:px-8 sm:pb-20 sm:pt-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <Reveal immediate>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">Sobre</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {site.about.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/70">{site.about.lead}</p>
          </Reveal>
          <Reveal delay={0.1} className="overflow-hidden rounded-[2rem]">
            <img
              src={asset('portrait.jpg')}
              alt={site.title}
              className="aspect-[4/5] w-full object-cover object-[center_15%]"
            />
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl space-y-6">
          {site.about.body.map((p, i) => (
            <Reveal key={p} delay={0.05 * i}>
              <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">{p}</p>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-3">
          {site.about.principles.map((item, i) => (
            <Reveal key={item.title} delay={0.06 * i}>
              <article className="border-t border-line pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-wine">
                  0{i + 1}
                </p>
                <h2 className="mt-3 font-display text-2xl text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mute">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream-soft px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="overflow-hidden rounded-[2rem]">
            <img
              src={asset(site.duo.image)}
              alt="Fundadoras Carina e Danielle"
              className="aspect-[5/4] w-full object-cover object-[center_18%]"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Fundação</p>
            <h2 className="display-title text-4xl text-ink sm:text-5xl">{site.duo.line}</h2>
            <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">{site.duo.note}</p>
            <a
              href={site.clinicInstagram}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost mt-8"
              data-cursor
            >
              {site.clinicInstagramHandle}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-wine-deep px-6 py-10 text-cream sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="font-display text-3xl sm:text-4xl">Pronta para te escutar.</p>
            <p className="mt-2 text-sm text-cream/60">Avaliação pelo WhatsApp, com horário marcado.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappUrl()} className="cta-signal" data-cursor>
              Agendar agora
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link to="/endodontia" className="cta-ghost border-cream/25 text-cream hover:border-rose hover:text-rose-soft">
              Ver endodontia
            </Link>
          </div>
        </Reveal>
      </section>
    </Shell>
  )
}
