import { asset, instagramStrip, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { Reveal } from './Reveal'

export function Insta() {
  return (
    <section id="instagram" className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Instagram</p>
          <h2 className="display-title mt-3 text-3xl sm:text-4xl">O studio no dia a dia.</h2>
        </Reveal>

        <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:gap-3 sm:px-0">
          {instagramStrip.map((item, i) => (
            <Reveal key={item.file} delay={i * 0.04} className="min-w-[42%] shrink-0 sm:min-w-0 sm:flex-1">
              <a href={site.instagram} target="_blank" rel="noreferrer" className="group block">
                <img
                  src={asset(item.file)}
                  alt={item.alt}
                  className="aspect-[4/5] w-full object-cover transition duration-700 ease-silk group-hover:opacity-90"
                  loading="lazy"
                />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <a href={site.instagram} target="_blank" rel="noreferrer" className="cta-ghost">
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
