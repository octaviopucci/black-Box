import { Reveal } from './Reveal'
import { asset, moments } from '../data/site'

export function Gallery() {
  return (
    <section id="na-festa" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Na festa</p>
          <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-5xl">
            Fotos reais. Diversão real.
          </h2>
          <p className="mt-4 max-w-xl text-paper/65">
            Do nosso Instagram direto para a sua tela. Equipamentos, montagens e momentos em Capão
            Bonito.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {moments.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.04} className={i % 5 === 0 ? 'md:row-span-2' : ''}>
              <a
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden bg-navy-lift"
              >
                <img
                  src={asset(m.file)}
                  alt={m.caption}
                  className={`w-full object-cover transition duration-700 ease-fest group-hover:scale-[1.03] ${
                    i % 5 === 0 ? 'aspect-[3/4] md:h-full' : 'aspect-square'
                  }`}
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-3 text-[11px] text-paper/90 opacity-0 transition group-hover:opacity-100 sm:text-xs">
                  {m.caption}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
