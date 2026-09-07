import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { FloatingOrbs } from '../ui/FloatingOrbs'
import { SplitHeadline, Stagger, staggerItem } from '../ui/Motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { whatsappUrl } from '../../data/site'
import { clientOutcomes } from '../../data/content'

const heroCards = [
  {
    title: 'Vender sem se perder',
    text: 'Leads organizados, follow-up automático e comercial focado em fechar.',
  },
  {
    title: 'Parar de fazer na mão',
    text: 'WhatsApp, CRM e planilhas conversando — sem copiar dado de um lado pro outro.',
  },
  {
    title: 'Trazer cliente de volta',
    text: 'Quem parou de responder volta pro funil com mensagem certa, na hora certa.',
  },
]

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bb-grid-bg opacity-25" />
      <div className="bb-noise" />
      <FloatingOrbs />

      <div className="bb-container relative grid min-h-[calc(100svh-6rem)] items-center gap-14 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-sm font-medium text-silver"
          >
            Tecnologia sob medida para empresas que querem crescer
          </motion.p>

          <SplitHeadline
            text="Você imagina. A Black Box constrói."
            className="bb-display text-[clamp(2.4rem,7.5vw,5.5rem)]"
            delay={0.05}
          />

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-mute sm:text-xl"
          >
            Transformamos ideias, processos e problemas do seu negócio em sistemas digitais que{' '}
            <span className="text-paper">vendem mais, automatizam tarefas e recuperam clientes</span>.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href={whatsappUrl()} arrow className="bb-btn-glow">
              Quero um projeto
            </Button>
            <Button href="#projetos" variant="secondary">
              Ver exemplos
            </Button>
          </motion.div>

          <Stagger className="mt-12 grid grid-cols-3 gap-4 sm:gap-6" delay={0.5}>
            {clientOutcomes.map((item) => (
              <motion.div key={item.label} variants={staggerItem} className="text-center sm:text-left">
                <p className="font-display text-3xl text-paper sm:text-4xl">
                  <AnimatedCounter value={item.stat} suffix={item.suffix} />
                </p>
                <p className="mt-1 text-[11px] leading-snug text-mute sm:text-xs">{item.label}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>

        <Stagger className="space-y-4" delay={0.25}>
          {heroCards.map((card, i) => (
            <motion.article
              key={card.title}
              variants={staggerItem}
              whileHover={reduced ? undefined : { x: 6, transition: { duration: 0.25 } }}
              className="bb-panel bb-card-shine group relative overflow-hidden p-5 sm:p-6"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
                }}
              />
              <p className="font-display text-lg uppercase tracking-tight text-paper sm:text-xl">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{card.text}</p>
              <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-silver/60">
                0{i + 1} · Resultado
              </span>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
