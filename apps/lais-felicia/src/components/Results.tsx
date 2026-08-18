import { asset, results, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Results() {
  return (
    <section id="resultados" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Resultados</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl sm:text-5xl">
            Cada sobrancelha é desenhada para o rosto que existe. Não para um padrão.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {results.map((item, i) => (
            <Reveal key={item.file} delay={i * 0.05} className={i === 0 ? 'col-span-2 md:col-span-2' : ''}>
              <figure className="relative overflow-hidden bg-paper-blush">
                <img
                  src={asset(item.file)}
                  alt={item.alt}
                  className={`w-full object-cover ${i === 0 ? 'aspect-[4/5] md:aspect-[5/4]' : 'aspect-[3/4]'}`}
                  loading="lazy"
                />
                <figcaption className="absolute bottom-3 left-3 text-[11px] uppercase tracking-[0.22em] text-white">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 grid grid-cols-2 gap-3 md:max-w-xl">
          <figure className="overflow-hidden bg-paper-blush">
            <img
              src={asset('epi-before.jpg')}
              alt="Antes da epilação na costeleta"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-1 py-2 text-[11px] uppercase tracking-[0.2em] text-ash">
              Antes
            </figcaption>
          </figure>
          <figure className="overflow-hidden bg-paper-blush">
            <img
              src={asset('epi-after.jpg')}
              alt="Depois da epilação na costeleta"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-1 py-2 text-[11px] uppercase tracking-[0.2em] text-ash">
              Depois
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
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
