import { Link } from 'react-router-dom'
import { CustomCursor } from '../components/CustomCursor'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { Reveal } from '../components/Reveal'
import { ScrollTop } from '../components/ScrollTop'
import { asset, extras, plans, services, whatsappUrl } from '../data/site'

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-night text-paper">
      <CustomCursor />
      <ScrollTop />
      <Navbar />
      <main className="pt-28">
        <section className="section-pad">
          <Reveal>
            <p className="eyebrow">Atendimentos</p>
            <h1 className="display-title mt-3 max-w-3xl text-4xl sm:text-6xl">Serviços detalhados</h1>
            <p className="mt-5 max-w-xl text-white/65">
              Valores e o que entra em cada procedimento. Escolha o que combina com o seu olhar e
              chame no WhatsApp.
            </p>
          </Reveal>

          <div className="mt-16 space-y-20">
            {services.map((item, i) => (
              <article
                key={item.id}
                id={item.id}
                className="grid scroll-mt-28 items-center gap-10 border-t border-white/10 pt-12 lg:grid-cols-12"
              >
                <Reveal className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <img
                    src={asset(item.image)}
                    alt={item.name}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                </Reveal>
                <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
                  <p className="eyebrow">Procedimento</p>
                  <h2 className="display-title mt-3 text-3xl sm:text-5xl">{item.name}</h2>
                  <p className="mt-4 font-display text-3xl text-gold">{item.price}</p>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">{item.text}</p>
                  <a href={whatsappUrl()} className="cta-gold mt-8">
                    Quero agendar
                  </a>
                </Reveal>
              </article>
            ))}
          </div>

          <div className="mt-24 grid gap-12 border-t border-white/10 pt-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="display-title text-3xl">Epilação</h2>
              <ul className="mt-6 space-y-3">
                {extras.map((item) => (
                  <li key={item.name} className="flex justify-between gap-4 text-sm text-white/75">
                    <span>{item.name}</span>
                    <span className="text-gold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display-title text-3xl">Planos</h2>
              <ul className="mt-6 space-y-3">
                {plans.map((item) => (
                  <li key={item.name} className="flex justify-between gap-4 text-sm text-white/75">
                    <span>{item.name}</span>
                    <span className="text-gold">{item.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-white/40">
                Combos válidos por 30 dias, sem acumular e sem transferir. Pagamento na primeira
                sessão.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-16">
            <Link to="/" className="text-sm uppercase tracking-[0.18em] text-gold">
              Voltar ao início
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
