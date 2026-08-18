import { asset, pains, site } from '../data/site'
import { Reveal } from './Reveal'

export function Desire() {
  return (
    <section id="olhar" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute inset-0 chevron-soft opacity-40" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-6">
          <img
            src={asset('studio-wide.jpg')}
            alt="Studio Laís Felicia, com parede chevron, logo e leito de atendimento"
            className="aspect-[4/5] w-full object-cover lg:aspect-[3/4]"
            loading="lazy"
          />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">O que você sente</p>
            <h2 className="display-title mt-4 text-4xl text-ink sm:text-6xl">
              Não é só tirar pelo.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/65">
              A maioria chega cansada de desenhos que não combinam, de excesso removido, de um olhar
              que não parece o seu. O trabalho aqui é o contrário: um design que devolve identidade.
            </p>
            <p className="mt-4 text-sm text-ink/45">
              {site.years} anos cuidando de olhares em {site.city.replace('/SP', '')}.
            </p>
          </Reveal>

          <ul className="mt-12 space-y-0 border-t border-ash-line">
            {pains.map((item, i) => (
              <Reveal key={item} delay={i * 0.06}>
                <li className="flex gap-5 border-b border-ash-line py-5">
                  <span className="font-display text-2xl text-rose">{String(i + 1).padStart(2, '0')}</span>
                  <p className="pt-1 text-base text-ink/82">{item}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
