import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

export function Presence() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine" />
            {site.concept}
          </p>
          <h2 className="display-title text-4xl text-ink sm:text-5xl lg:text-6xl">
            Minha forma de cuidar começa antes da técnica.
          </h2>
          <Link to="/sobre" className="cta-ghost mt-8" data-cursor>
            Conhecer a Danielle
          </Link>
        </Reveal>

        <div className="space-y-6">
          {site.voice.map((line, i) => (
            <Reveal key={line} delay={0.08 * i}>
              <p
                className={
                  i === 0
                    ? 'font-display text-3xl font-medium leading-snug text-wine sm:text-4xl'
                    : 'text-base leading-relaxed text-mute sm:text-lg'
                }
              >
                {line}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto mt-16 max-w-6xl border-t border-line pt-10 sm:mt-20">
        <p className="font-script text-3xl text-signal sm:text-4xl">{site.promise}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
          Sou sócia-fundadora da {site.clinic}. Aqui, odontologia e estética compartilham o mesmo
          teto. E cada pessoa é tratada como única.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-12 hidden max-w-6xl overflow-hidden rounded-[1.75rem] sm:block">
        <img
          src={asset('team/duo-hero.jpg')}
          alt="Dra. Carina Torresilha e Dra. Danielle Matsubara"
          className="aspect-[21/9] w-full object-cover object-[center_20%]"
          loading="lazy"
        />
      </Reveal>
    </section>
  )
}
