import { asset } from '../data/site'
import { Reveal } from './Reveal'

const frames = [
  {
    src: 'space/reception.jpg',
    alt: 'Recepção Matsubara com poltronas burgundy e boiserie',
    label: 'Recepção',
    line: 'Acolhimento que se sente ao entrar',
    wide: true,
  },
  {
    src: 'space/consultorio.jpg',
    alt: 'Consultório climatizado com acabamento em mármore',
    label: 'Consultório',
    line: 'Precisão em ambiente sereno',
    wide: false,
  },
  {
    src: 'space/sala.jpg',
    alt: 'Sala de atendimento moderna e climatizada',
    label: 'Salas climatizadas',
    line: 'Conforto térmico do início ao fim',
    wide: false,
  },
] as const

export function Espaco() {
  return (
    <section id="espaco" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine/40" />
            O espaço
          </p>
          <h2 className="display-title mt-4 max-w-3xl text-[clamp(2.4rem,6vw,4.4rem)]">
            Boutique clínica — velvet, luz quente e silêncio útil.
          </h2>
          <p className="mt-5 max-w-xl text-mute">
            Poltronas burgundy, boiserie e salas prontas para procedimentos com bem-estar.
            Um endereço pensado para transformar consulta em experiência.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {frames.map((frame, i) => (
            <Reveal
              key={frame.src}
              delay={0.06 * i}
              className={frame.wide ? 'md:col-span-2' : undefined}
            >
              <figure className="group relative overflow-hidden rounded-[2rem] bg-cream-deep">
                <img
                  src={asset(frame.src)}
                  alt={frame.alt}
                  className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${
                    frame.wide ? 'aspect-[21/9] sm:aspect-[2.4/1]' : 'aspect-[4/3]'
                  }`}
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-cream sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-soft">
                    {frame.label}
                  </p>
                  <p className="mt-1 font-display text-2xl sm:text-3xl">{frame.line}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
