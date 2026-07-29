import { motion } from 'framer-motion'
import { ShieldCheck, Smartphone } from 'lucide-react'
import { trustStats } from '../data/site'

export function Trust() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gov">
            Desempenho dos serviços
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            A confiança do Governo Federal, com menos atrito
          </h2>
          <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
            Premium no setor público é clareza, acessibilidade e conclusão — com a identidade que o
            cidadão já reconhece.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 border-t-4 border-gov/20 pt-10 sm:grid-cols-3">
          {trustStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <p className="font-display text-4xl font-extrabold tracking-tight text-gov sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-mute">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-gov" />
            <div>
              <p className="text-xl font-extrabold text-ink">Conta gov.br</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Identidade única para acessar serviços de órgãos federais, com níveis de segurança
                reconhecidos.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Smartphone className="mt-1 h-6 w-6 shrink-0 text-gov" />
            <div>
              <p className="text-xl font-extrabold text-ink">Aplicativos oficiais</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                gov.br, Carteira Digital de Trânsito e Meu INSS — a mesma identidade, no bolso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
