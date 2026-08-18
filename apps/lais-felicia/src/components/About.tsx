import { asset, site, whatsappUrl, why } from '../data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="lais" className="relative overflow-hidden bg-paper-blush px-5 py-24 sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute inset-0 chevron-soft opacity-25" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-12">
        <div className="grid gap-4 lg:col-span-5">
          <Reveal>
            <img
              src={asset('portrait.jpg')}
              alt="Laís Felicia no studio, em frente à placa oficial"
              className="aspect-[4/5] w-full object-cover object-[center_16%]"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <img
              src={asset('cert.jpg')}
              alt="Laís entrega certificado a uma aluna"
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-6">
          <Reveal>
            <img
              src={asset('logo.png')}
              alt=""
              aria-hidden
              className="mb-8 h-20 w-20 rounded-full object-cover"
            />
            <p className="eyebrow">Quem vai cuidar de você</p>
            <h2 className="display-title mt-4 text-5xl sm:text-7xl">Laís Felicia</h2>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-rose-deep">
              Designer e mentora · Capão Bonito
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/68">
              <p>
                Há {site.years} anos a Laís cuida de olhares em Capão Bonito. O studio existe para um
                atendimento próximo: leitura do rosto, marcação pelo método RT e um acabamento que
                você reconhece no espelho.
              </p>
              <p>
                A mesma experiência vira aprendizado. Nos cursos, a didática é leve e real. Teoria,
                demonstração e prática em modelo, com o protocolo que ela usa no dia a dia.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {why.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <p className="font-display text-2xl text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/62">{item.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12} className="mt-12">
            <p className="text-sm text-ink/50">
              {site.address} · {site.landmark} · {site.city}
            </p>
            <a href={whatsappUrl()} className="cta-rose mt-6">
              Quero agendar meu horário
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
