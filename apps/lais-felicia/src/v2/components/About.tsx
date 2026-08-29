import { Check } from 'lucide-react'
import { site } from '../../data/site'
import { Reveal } from './Reveal'

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
        <div>
          <Reveal>
            <p className="eyebrow">{site.role}</p>
            <h2 className="display-title mt-3 text-4xl sm:text-5xl">{site.name}</h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
              Designer de sobrancelhas em Capão Bonito, com foco em{' '}
              <span className="font-semibold text-gold-deep">harmonia facial</span>.
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
              Há 10 anos a Laís cuida de olhares no studio. Ela também capacita alunas do zero,
              transforma sua experiência em aprendizado leve e real.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
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
      </div>
    </section>
  )
}
