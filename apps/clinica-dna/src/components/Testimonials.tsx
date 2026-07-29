import { site } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

const strip = [
  'Pediatria',
  'Clínica médica',
  'Neurologia',
  'Odontologia',
  'Vacinação',
  'Acolhimento',
  'Capão Bonito',
  'Conectando vidas',
]

export function Marquee() {
  const items = [...strip, ...strip]
  return (
    <div className="overflow-hidden border-y border-line bg-snow/60 py-4" aria-hidden>
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {items.map((label, i) => (
          <span key={`${label}-${i}`} className="flex items-center gap-10 text-sm font-medium text-mute">
            <span className="font-display text-xl text-navy/80">{label}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="depoimentos" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Prova social"
          title="Histórias que conectam"
          subtitle="Famílias de Capão Bonito que escolheram a DNA para cuidar do que mais importa."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {site.testimonials.map((item, i) => (
            <Reveal key={item.name} delay={0.08 * i}>
              <blockquote className="flex h-full flex-col rounded-[1.75rem] bg-navy p-7 text-snow shadow-soft">
                <p className="font-display text-2xl font-medium leading-snug text-snow/95 sm:text-[1.65rem]">
                  “{item.quote}”
                </p>
                <footer className="mt-auto pt-8">
                  <p className="text-sm font-semibold text-aqua-soft">{item.name}</p>
                  <p className="mt-1 text-xs text-snow/50">{item.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
