import { asset, site, whatsappUrl, why } from '../data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="lais" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-12">
        <div className="grid gap-4 lg:col-span-5">
          <Reveal>
            <img
              src={asset('cert.jpg')}
              alt="Laís Felicia entrega certificado a uma aluna no studio"
              className="aspect-[4/5] w-full object-cover object-[center_20%]"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <img
              src={asset('teach.jpg')}
              alt="Laís explicando o método durante o curso presencial"
              className="aspect-[16/10] w-full object-cover object-[center_20%]"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-2">
          <Reveal>
            <img
              src={asset('logo.png')}
              alt=""
              aria-hidden
              className="mb-6 h-16 w-16 rounded-full object-cover"
            />
            <p className="eyebrow">Quem vai cuidar de você</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Laís Felicia</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-rose-deep">
              Designer e mentora
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-ink/68">
              <p>
                Há 10 anos a Laís cuida de olhares em Capão Bonito. O studio existe para um
                atendimento próximo: leitura do rosto, marcação pelo método RT e um acabamento que
                você reconhece no espelho.
              </p>
              <p>
                A mesma experiência vira aprendizado. Nos cursos, a didática é leve e real. Teoria,
                demonstração e prática em modelo, com o protocolo que ela usa no dia a dia.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 space-y-8 border-t border-ash-line pt-10">
            {why.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <p className="font-display text-2xl text-ink">{item.title}</p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/62">{item.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12} className="mt-10">
            <p className="text-sm text-ink/50">
              {site.address} · {site.landmark} · {site.city}
            </p>
            <a href={whatsappUrl()} className="cta-ink mt-6">
              Quero agendar meu horário
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
