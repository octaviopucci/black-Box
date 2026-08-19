import { Check } from 'lucide-react'
import { asset, site, skills } from '../data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="section-pad">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">{site.role}</p>
            <h2 className="display-title mt-3 text-4xl sm:text-5xl">{site.name}</h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">{site.aboutLead}</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">{site.aboutBody}</p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {skills.map((item, i) => (
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

        <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
          <div className="overflow-hidden">
            <img
              src={asset('teach.jpg')}
              alt="Laís Felicia realizando atendimento e formação"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
