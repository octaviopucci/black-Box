import { motion } from 'framer-motion'
import { site, whatsappUrl } from '../data/site'

export function Contact() {
  return (
    <section id="contato" className="px-5 pb-20 sm:px-8 sm:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-[2rem] bg-ink text-white lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="relative p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,52,42,0.45),transparent_50%)]" />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/55">Contato</p>
            <h2 className="mt-4 max-w-lg font-display text-5xl leading-[0.95] sm:text-6xl">
              Pronto para o próximo imóvel?
            </h2>
            <p className="mt-5 max-w-md text-white/70">
              Atendimento em Capão Bonito/SP. Compra, venda e locação com acompanhamento próximo.
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-brand px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-deep"
            >
              WhatsApp agora
            </a>
          </div>
        </div>
        <div className="space-y-6 border-t border-white/10 p-8 sm:p-12 lg:border-l lg:border-t-0">
          <Info label="Endereço" value={site.address} href={site.mapsUrl} />
          <Info
            label="Telefones"
            value={site.phones.map((p) => p.label).join(' · ')}
            href={site.phones[0].href}
          />
          <Info label="E-mail" value={site.email} href={`mailto:${site.email}`} />
        </div>
      </motion.div>
    </section>
  )
}

function Info({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">{label}</p>
      <a href={href} target="_blank" rel="noreferrer" className="mt-2 block text-sm leading-relaxed text-white/85 hover:text-white">
        {value}
      </a>
    </div>
  )
}
