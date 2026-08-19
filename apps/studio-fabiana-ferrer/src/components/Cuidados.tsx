import { services } from '@/data/site'
import Reveal from './Reveal'

export default function Cuidados() {
  return (
    <section id="cuidados" className="border-t hairline">
      <div className="mx-auto max-w-[90rem]">
        <Reveal>
          <div className="border-b hairline px-5 py-10 md:px-10 md:py-14">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
              Cuidados publicados no perfil.
            </h2>
          </div>
        </Reveal>

        {services.map((service, index) => (
          <Reveal key={service.id}>
            <article
              className={`grid gap-6 border-b hairline px-5 py-12 md:grid-cols-[7rem_1fr] md:gap-10 md:px-10 md:py-16 ${
                index === 0 ? '' : ''
              }`}
            >
              <p className="font-sans text-[0.68rem] font-medium uppercase tracking-mark text-mute">
                0{index + 1}
              </p>
              <div className="max-w-prose">
                <h3 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink md:text-3xl">
                  {service.name}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-mute">{service.lead}</p>
                <p className="mt-4 text-sm leading-relaxed text-mute/90">{service.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
