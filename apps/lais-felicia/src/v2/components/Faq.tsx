import { faqs } from '../../data/site'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'

export function Faq() {
  return (
    <section id="faq" className="section-pad">
      <Reveal>
        <SectionIntro eyebrow="Perguntas frequentes" title="Dúvidas mais comuns" />
      </Reveal>

      <div className="mx-auto max-w-3xl space-y-3.5">
        {faqs.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.03}>
            <details className="group overflow-hidden rounded-xl border border-gold/25 bg-surface-lift" open={i === 0}>
              <summary className="cursor-pointer list-none px-5 py-4 font-display text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-gold-deep transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
