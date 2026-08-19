import { Link } from 'react-router-dom'
import { CustomCursor } from '../components/CustomCursor'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { PriceBlock } from '../components/PriceBlock'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { Reveal } from '../components/Reveal'
import { ScrollTop } from '../components/ScrollTop'
import { asset, extras, plans, services, whatsappUrl } from '../data/site'

export function ServicesPage() {
  const procedureRows = services.map((item) => ({ name: item.name, price: item.price }))

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

          <Reveal delay={0.06}>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex items-center justify-between gap-4 rounded-md border border-white/10 bg-night-lift/30 px-5 py-4 transition hover:border-gold/35"
                >
                  <span className="text-sm text-white/80 transition group-hover:text-white">
                    {item.name}
                  </span>
                  <span className="font-display text-lg font-bold text-gold">{item.price}</span>
                </a>
              ))}
            </div>
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

          <div className="mt-24 space-y-8 border-t border-white/10 pt-14">
            <Reveal>
              <p className="eyebrow">Valores</p>
              <h2 className="display-title mt-2 text-3xl sm:text-4xl">Tabela completa</h2>
              <p className="mt-3 max-w-xl text-sm text-white/55">
                Procedimentos, epilação e planos em um só lugar. Pagamento na sessão: Pix, cartão ou
                dinheiro.
              </p>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-2">
              <PriceBlock
                eyebrow="Sobrancelhas"
                title="Procedimentos"
                rows={procedureRows}
                footer={
                  <a href={whatsappUrl()} className="cta-gold">
                    Agendar procedimento
                  </a>
                }
              />
              <div className="space-y-8">
                <PriceBlock
                  eyebrow="Complementos"
                  title="Epilação"
                  rows={extras}
                  delay={0.06}
                />
                <PriceBlock
                  eyebrow="Economia"
                  title="Planos"
                  rows={plans}
                  note="Combos válidos por 30 dias, sem acumular e sem transferir. Pagamento na primeira sessão."
                  delay={0.1}
                  footer={
                    <a href={whatsappUrl()} className="cta-gold">
                      Quero um plano
                    </a>
                  }
                />
              </div>
            </div>
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
