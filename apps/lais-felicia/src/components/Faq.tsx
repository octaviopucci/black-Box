import { faqs } from '../data/site'
import { Reveal } from './Reveal'

export function Faq() {
  return (
    <section id="faq" className="px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="eyebrow">Dúvidas</p>
          <h2 className="display-title mt-4 text-4xl sm:text-5xl">Antes de chamar</h2>
        </Reveal>

        <div className="mt-12 space-y-0 border-t border-ash-line">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.03}>
              <details className="group border-b border-ash-line">
                <summary className="cursor-pointer list-none py-5 font-display text-xl marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-rose transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-ink/62">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
