import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SiteShell } from '../components/SiteShell'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { site, whatsappUrl } from '../data/site'

export function ServicesPage() {
  return (
    <SiteShell solidNav>
      <PageHero
        eyebrow="Serviços"
        title="Do primeiro contato ao fechamento, com método"
        description="Locação, administração, compra e venda, avaliação, assessoria e orientação para investimentos."
      />

      <section className="mx-auto w-full max-w-shell px-5 py-16 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {site.services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 0.04}
              className="group border border-line bg-snow p-7 transition hover:border-blue/40 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-display text-2xl font-semibold text-ink">{service.title}</p>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-mute sm:text-base">
                {service.description}
              </p>
              {service.slug === 'avaliacao' ? (
                <Link to="/avaliacao" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue">
                  Saiba mais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-blue-deep py-16 text-white">
        <div className="mx-auto flex w-full max-w-shell flex-wrap items-center justify-between gap-6 px-5 sm:px-8">
          <div>
            <p className="section-label !text-gold">Administração de imóveis</p>
            <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight">
              Deixe seu imóvel conosco e acompanhe com tranquilidade
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/anunciar" className="btn-primary">
              Quero administrar
            </Link>
            <a
              href={whatsappUrl('Olá! Quero saber sobre administração de imóveis.')}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Falar agora
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
