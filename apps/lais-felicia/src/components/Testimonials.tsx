import { asset, site, studentNote, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Testimonials() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={asset('studio-wide.jpg')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        aria-hidden
      />
      <div className="absolute inset-0 bg-ink/72" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow !text-gold-soft">Fale com a equipe</p>
          <h2 className="display-title mt-4 max-w-md text-3xl text-white sm:text-4xl">
            Quer ajuda para escolher o melhor procedimento para seu objetivo?
          </h2>
          <div className="mt-10">
            <a href={whatsappUrl()} className="cta-gold !text-gold-soft">
              Falar com a equipe
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow !text-gold-soft">Depoimentos</p>
          <h3 className="display-title mt-3 text-3xl text-white">O que as alunas dizem</h3>
          <p className="mt-8 font-display text-2xl leading-snug text-white/90">
            “{studentNote.text}”
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold-soft">{studentNote.from}</p>
          <p className="mt-8 text-sm text-white/55">
            {site.studio} · {site.city}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
