import { pains } from '../data/site'
import { Reveal } from './Reveal'

export function Desire() {
  return (
    <section id="olhar" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow">O que você sente</p>
          <h2 className="display-title mt-4 text-4xl text-ink sm:text-5xl">
            Não é só tirar pelo.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
            A maioria chega cansada de desenhos que não combinam, de excesso removido, de um olhar
            que não parece o seu. O trabalho aqui é o contrário: um design que devolve identidade.
          </p>
        </Reveal>

        <div className="lg:col-span-6">
          <ul className="space-y-0 border-t border-ash-line">
            {pains.map((item, i) => (
              <Reveal key={item} delay={i * 0.06}>
                <li className="flex gap-5 border-b border-ash-line py-5">
                  <span className="font-display text-xl text-rose">0{i + 1}</span>
                  <p className="pt-0.5 text-base text-ink/80">{item}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
