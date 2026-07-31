import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

export function Duo() {
  return (
    <section className="relative overflow-hidden bg-cream-soft px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <Reveal className="relative overflow-hidden rounded-[2rem]">
          <img
            src={asset(site.duo.image)}
            alt="Dra. Carina Torresilha e Dra. Danielle Matsubara — fundadoras"
            className="aspect-[4/5] w-full object-cover object-[center_15%] sm:aspect-[5/4]"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wine-deep/80 to-transparent p-6 sm:p-8">
            <p className="font-script text-3xl text-rose-soft sm:text-4xl">{site.duo.title}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow">Fundação</p>
          <h2 className="display-title text-4xl text-ink sm:text-5xl">{site.duo.line}</h2>
          <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">
            Carina traz a estética avançada. Eu, a endodontia. Juntas, construímos um espaço
            multidisciplinar onde saúde, sorriso e bem-estar caminham no mesmo ritmo — desde{' '}
            {site.since}.
          </p>
          <a
            href={site.clinicInstagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost mt-8"
            data-cursor
          >
            {site.clinicInstagramHandle}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
