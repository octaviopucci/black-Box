import { Check } from 'lucide-react'
import { site } from '../../data/site'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'

const v2Skills = [
  'Correção e simetria',
  'Método RT de marcação',
  'Design com henna',
  'Design de sobrancelhas',
  'Brow lamination',
  'Cursos profissionalizantes',
  'Atendimento e fidelização',
] as const

export function About() {
  return (
    <section id="sobre" className="section-pad">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionIntro eyebrow={site.role} title={site.name} className="mb-6" />
          <p className="mx-auto max-w-lg text-center text-base leading-relaxed text-ink-soft">
            Designer de sobrancelhas em Capão Bonito, com foco em{' '}
            <span className="font-semibold text-gold-deep">harmonia facial</span>.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-center text-base leading-relaxed text-ink-soft">
            Há 10 anos a Laís cuida de olhares no studio. Ela também capacita alunas do zero,
            transforma sua experiência em aprendizado leve e real.
          </p>
        </Reveal>

        <ul className="mx-auto mt-10 max-w-md space-y-3">
          {v2Skills.map((item, i) => (
            <Reveal key={item} delay={i * 0.04}>
              <li className="flex items-start gap-3">
                <span className="check-gold">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <p className="text-[15px] text-ink">{item}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
