import { asset, site } from '../data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="lais" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <img
            src={asset('studio.jpg')}
            alt="Recepção do Studio Laís Felicia, com o monograma Lf e poltronas cinza"
            className="aspect-[3/4] w-full object-cover object-[center_20%]"
            loading="lazy"
          />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">Quem vai cuidar de você</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Laís Felicia</h2>
            <p className="mt-2 font-script text-3xl text-rose">Designer e mentora</p>
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
              <p className="text-sm text-ink/50">
                {site.address} · {site.landmark} · {site.city}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
