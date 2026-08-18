import { asset, instagramGrid, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal } from './Reveal'

export function Insta() {
  return (
    <section id="instagram" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Instagram</p>
          <h2 className="display-title mt-4 text-4xl sm:text-5xl">O studio no dia a dia.</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {instagramGrid.map((item, i) => (
            <Reveal key={item.file + i} delay={i * 0.04}>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="group block overflow-hidden">
                <img
                  src={asset(item.file)}
                  alt={item.alt}
                  className="aspect-square w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost"
          >
            <InstagramIcon className="h-4 w-4" />
            Veja mais resultados no Instagram
          </a>
        </Reveal>
      </div>
    </section>
  )
}
