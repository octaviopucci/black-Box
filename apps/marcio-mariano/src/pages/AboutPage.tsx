import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SiteShell } from '../components/SiteShell'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { site } from '../data/site'

export function AboutPage() {
  return (
    <SiteShell solidNav>
      <PageHero
        eyebrow="Empresa"
        title="Uma empresa de visão e com bastante solidez"
        description="Comercialização e administração de imóveis como tradição da família Santos Mariano desde 1955."
      />

      <section className="mx-auto grid w-full max-w-shell gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {site.about.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-base leading-relaxed text-mute sm:text-lg">{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="border border-line bg-snow p-7 sm:p-8">
            <p className="section-label">Missão</p>
            <p className="mt-4 font-display text-2xl font-semibold leading-snug text-ink">
              “{site.mission}”
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {site.values.map((v) => (
                <div key={v.title} className="border-t border-line pt-4">
                  <p className="font-semibold text-blue">{v.title}</p>
                  <p className="mt-1 text-sm text-mute">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-blue-wash py-16">
        <div className="mx-auto grid w-full max-w-shell gap-8 px-5 sm:px-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <p className="section-label">Sede própria</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
              Rua Silva Jardim, 773 — Centro
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">
              Estamos em Capão Bonito com equipe preparada para atender compra, venda, locação,
              administração e avaliações. Faça-nos uma visita ou fale pelo WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contato" className="btn-blue">
                Como chegar
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/imoveis" className="inline-flex items-center gap-2 border border-line bg-snow px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-blue">
                Ver imóveis
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="border border-line bg-snow p-6">
            <p className="text-sm font-semibold text-ink">Horário</p>
            <p className="mt-3 text-sm text-mute">{site.hours.weekdays}</p>
            <p className="text-sm text-mute">{site.hours.saturday}</p>
            <p className="mt-3 text-sm text-mute">{site.hours.plantao}</p>
            <p className="mt-6 text-sm font-semibold text-ink">Cidades atendidas</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">{site.cities.join(' · ')}</p>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
