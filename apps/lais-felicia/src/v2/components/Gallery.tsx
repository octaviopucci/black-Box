import { v2Asset, v2Gallery } from '../data/site'
import { Reveal } from './Reveal'

export function Gallery() {
  return (
    <section id="galeria" className="section-pad">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow">Resultados e experiência</p>
          <h2 className="display-title mt-3 text-4xl sm:text-5xl">Antes e depois no studio</h2>
        </div>
      </Reveal>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {v2Gallery.map((item, i) => (
          <figure
            key={item.file}
            className={`group relative overflow-hidden rounded-md ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
          >
            <img
              src={v2Asset(item.file)}
              alt={item.alt}
              className={`w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.04] ${
                i === 0 ? 'aspect-[4/5] sm:aspect-auto sm:h-full' : 'aspect-[4/5]'
              }`}
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 py-3 opacity-0 transition group-hover:opacity-100">
              <p className="text-xs text-white/90">{item.alt}</p>
            </div>
          </figure>
        ))}
      </div>
    </section>
  )
}
