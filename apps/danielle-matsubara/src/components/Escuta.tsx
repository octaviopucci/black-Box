import { Reveal } from './Reveal'
import { site } from '../data/site'

export function Escuta() {
  return (
    <section id="escuta" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine" />
            {site.concept}
          </p>
          <h2 className="display-title text-4xl text-ink sm:text-5xl lg:text-6xl">
            Minha forma de cuidar começa antes da técnica.
          </h2>
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
          teto — e cada pessoa é tratada como única.
        </p>
      </Reveal>
    </section>
  )
}
