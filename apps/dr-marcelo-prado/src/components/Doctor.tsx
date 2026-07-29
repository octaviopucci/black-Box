import { asset, site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function Proof() {
  return (
    <section className="border-y border-line bg-bone/80 py-16 sm:py-20" aria-label="Indicadores">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {site.proof.map((item, i) => (
            <Reveal key={item.label} delay={0.06 * i}>
              <div className="relative pl-5 before:absolute before:left-0 before:top-1 before:h-10 before:w-0.5 before:bg-signal">
                <p className="font-display text-3xl font-semibold tracking-tight text-void sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-mute">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Doctor() {
  return (
    <section id="sobre" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-signal/20 via-celadon/20 to-transparent blur-xl" />
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <img
                src={asset('presence.jpg')}
                alt={`${site.name}, médico endocrinologista`}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 left-6 right-6 rounded-2xl bg-void p-5 text-snow shadow-lift sm:left-auto sm:right-[-1.5rem] sm:w-64">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-signal">
                Presença clínica
              </p>
              <p className="mt-2 font-display text-xl font-semibold leading-tight">
                Itapeva · presencial
              </p>
              <p className="mt-1 text-sm text-snow/55">e cuidado on-line</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionEyebrow>Sobre</SectionEyebrow>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.3rem)] font-semibold leading-[1.05] tracking-tight text-void text-balance">
              Medicina hormonal com linguagem humana.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5">
            {site.about.map((para, i) => (
              <Reveal key={para} delay={0.08 * i}>
                <p className="text-base leading-relaxed text-mute sm:text-lg">{para}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-bone/60 p-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">
                  Registro
                </dt>
                <dd className="mt-2 font-display text-xl font-semibold text-void">{site.crm}</dd>
              </div>
              <div className="rounded-2xl border border-line bg-bone/60 p-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">
                  Especialidade
                </dt>
                <dd className="mt-2 font-display text-xl font-semibold text-void">
                  {site.specialty}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
