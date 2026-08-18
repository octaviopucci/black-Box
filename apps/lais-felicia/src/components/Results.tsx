import { asset, results, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Results() {
  const [lead, ...rest] = results

  return (
    <section id="resultados" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Resultados</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl sm:text-5xl">
            Cada sobrancelha é desenhada para o rosto que existe. Não para um padrão.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7">
            <figure>
              <img
                src={asset(lead.file)}
                alt={lead.alt}
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ash">
                {lead.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((item, i) => (
              <Reveal key={item.file} delay={0.06 * (i + 1)}>
                <figure>
                  <img
                    src={asset(item.file)}
                    alt={item.alt}
                    className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ash">
                    {item.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ash">Epilação</p>
          <p className="mt-2 text-sm text-ink/55">
            Além do design, o studio também faz epilação de buço, costeleta e rosto.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <figure>
              <img
                src={asset('epi-before.jpg')}
                alt="Antes da epilação na costeleta"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="px-0.5 py-2 text-[11px] uppercase tracking-[0.2em] text-ash">
                Antes
              </figcaption>
            </figure>
            <figure>
              <img
                src={asset('epi-after.jpg')}
                alt="Depois da epilação na costeleta"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="px-0.5 py-2 text-[11px] uppercase tracking-[0.2em] text-ash">
                Depois
              </figcaption>
            </figure>
          </div>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center gap-4">
          <p className="max-w-md text-sm text-ink/60">
            Um detalhe na finalização muda o caimento. A henna preenche. O desenho segura o olhar
            no lugar certo.
          </p>
          <a href={whatsappUrl()} className="cta-rose">
            Quero meu design
          </a>
        </Reveal>
      </div>
    </section>
  )
}
