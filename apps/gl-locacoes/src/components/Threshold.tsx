import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'

export function Threshold() {
  const { reduced } = useMotion()

  return (
    <section id="orcar" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl overflow-hidden bg-night-lift">
        <div className="relative px-6 py-16 sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sun/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-coral/20 blur-3xl"
          />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-2xl"
          >
            <p className="eyebrow">Orçamento</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">
              Vamos montar a sua festa?
            </h2>
            <p className="mt-4 text-paper/70">
              Aceitamos cartões débito e crédito. Fale com a G&amp;L Fest e receba o pacote ideal
              para a data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappUrl()} className="cta-sun">
                <MessageCircle className="h-4 w-4" />
                {site.phone.label}
              </a>
              <a href={`mailto:${site.email}`} className="cta-ghost">
                {site.email}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
