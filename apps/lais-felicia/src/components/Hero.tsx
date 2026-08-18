import { asset, site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section id="topo" className="overflow-hidden pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="lg:hidden">
          <div className="relative mx-auto mb-6 max-w-sm overflow-hidden rounded-2xl border border-gold/25 bg-night-lift/80 px-5 py-5 text-center backdrop-blur">
            <p className="eyebrow">{site.role}</p>
            <h1 className="display-title mt-1 text-[2.6rem]">{site.headline}</h1>
            <span className="absolute inset-x-1/3 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <div className="relative">
            <img
              src={asset('portrait.jpg')}
              alt="Laís Felicia no Studio Laís Felicia"
              className="w-full object-cover object-[center_16%]"
              fetchPriority="high"
            />
            <p className="px-1 py-5 text-center text-[15px] leading-relaxed text-white/80">
              {site.lead}
            </p>
            <div className="pb-8 text-center">
              <a href={whatsappUrl()} className="cta-gold">
                Entre em contato
              </a>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[78vh] lg:block">
          <img
            src={asset('portrait.jpg')}
            alt="Laís Felicia no Studio Laís Felicia"
            className="h-[82vh] w-[60%] object-cover object-[center_16%]"
            fetchPriority="high"
          />
          <div className="absolute left-[48%] top-1/2 z-10 w-[46%] -translate-y-1/2">
            <Reveal>
              <p className="eyebrow">{site.role}</p>
              <h1 className="display-title mt-2 text-6xl xl:text-7xl">{site.headline}</h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">{site.lead}</p>
              <div className="mt-10">
                <a href={whatsappUrl()} className="cta-gold">
                  Entre em contato
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
