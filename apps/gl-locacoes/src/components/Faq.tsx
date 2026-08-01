import { Reveal } from './Reveal'
import { faqs } from '../data/site'

export function Faq() {
  return (
    <section id="faq" className="px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="display-title mt-4 text-3xl sm:text-5xl">Perguntas que mais recebemos</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04}>
              <details className="group border border-line bg-navy-lift/40 open:border-sun/40">
                <summary className="cursor-pointer list-none px-5 py-4 font-medium text-paper marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-sun transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-paper/70">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
