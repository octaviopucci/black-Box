import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'

export function Threshold() {
  const { reduced } = useMotion()

  return (
    <section id="orcar" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden bg-navy-lift">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sun/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-sky/20 blur-3xl"
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative px-6 py-16 sm:px-12 sm:py-20"
        >
          <BrandMark className="h-16 w-16" />
          <p className="eyebrow mt-6">Reserva</p>
          <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-5xl">
            Vamos garantir a diversão da sua festa?
          </h2>
          <p className="mt-4 max-w-xl text-paper/70">
            Chame agora e confirme data, brinquedo e horário. A G&amp;L Locações responde rápido e
            monta tudo no local.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {site.phones.map((p) => (
              <a
                key={p.label}
                href={whatsappUrl(
                  `Olá, G&L Locações! Vim pelo site e quero reservar. Meu contato preferencial: ${p.label}`,
                )}
                className="cta-sun"
              >
                <MessageCircle className="h-4 w-4" />
                {p.label}
              </a>
            ))}
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
