import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Scale } from 'lucide-react'
import { site } from '../data/site'

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Transparência',
    text: 'Negociação clara, com acompanhamento jurídico e operacional em cada etapa.',
  },
  {
    icon: Scale,
    title: 'Ética profissional',
    text: 'Intermediação segura e responsável, do primeiro contato à entrega das chaves.',
  },
  {
    icon: Sparkles,
    title: 'Atendimento próximo',
    text: 'Corretores especializados em Capão Bonito e região, com foco no seu objetivo.',
  },
]

export function About() {
  return (
    <section id="sobre" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Sobre nós</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Consultoria imobiliária com presença e critério
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-mute">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="border-t border-line pt-5"
            >
              <pillar.icon className="h-5 w-5 text-brand" />
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{pillar.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
