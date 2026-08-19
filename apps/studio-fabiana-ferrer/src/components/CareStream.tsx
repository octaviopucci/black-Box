import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { services } from '@/data/site'
import Reveal from './Reveal'

export default function CareStream() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section id="cuidados" ref={ref} className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">Cuidados</p>
          <h2 className="mt-3 max-w-prose font-display text-3xl font-medium text-forest md:text-4xl">
            Serviços que aparecem no conteúdo publicado pelo studio.
          </h2>
        </Reveal>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              style={{ y: index % 2 === 0 ? drift : undefined }}
              className="min-w-[min(88vw,22rem)] shrink-0 rounded-[1.75rem] border border-forest/10 bg-gradient-to-br from-paper to-mint/30 p-6 shadow-tactile md:min-w-[24rem] md:p-8"
            >
              <span className="text-[0.68rem] font-semibold uppercase tracking-mark text-sage">
                0{index + 1}
              </span>
              <h3 className="mt-4 font-display text-2xl text-forest">{service.name}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-pine">{service.lead}</p>
              <p className="mt-4 text-sm leading-relaxed text-smoke">{service.body}</p>
              <p className="mt-5 rounded-full bg-forest/5 px-4 py-2 text-xs font-medium text-forest">
                {service.note}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
