import { asset, courseGallery } from '../../data/site'
import { Reveal } from './Reveal'

export function Gallery() {
  return (
    <section id="galeria" className="section-pad">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow">Por dentro dos cursos</p>
          <h2 className="display-title mt-3 text-4xl sm:text-5xl">A experiência em imagens</h2>
        </div>
      </Reveal>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {courseGallery.map((item, i) => (
          <figure
            key={item.file}
            className={`group relative overflow-hidden ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
          >
            <img
              src={asset(item.file)}
              alt={item.alt}
              className={`w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.04] ${
                i === 0 ? 'aspect-[4/5] sm:aspect-auto sm:h-full' : 'aspect-[4/5]'
              }`}
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gold/15 opacity-0 transition group-hover:opacity-100" />
          </figure>
        ))}
      </div>
    </section>
  )
}
