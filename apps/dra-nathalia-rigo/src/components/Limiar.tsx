import { motion, useReducedMotion } from 'framer-motion'
import { brand, media } from '@/data/site'
import { Link } from 'react-router-dom'

export function Limiar() {
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-dvh overflow-hidden bg-ink text-ice">
      <motion.img
        src={media.frost}
        alt="Cristais de gelo em vidro — a temperatura da criolipólise, traduzida em matéria."
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.12 }}
        animate={reduce ? undefined : { scale: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/20" />

      <div className="relative z-10 flex min-h-dvh flex-col justify-end px-5 pb-16 pt-28 md:px-12 md:pb-20 lg:px-16">
        <p className="mb-6 text-[11px] uppercase tracking-mark text-ice/70">
          Enfermeira esteta · Parque São Bento
        </p>
        <h1 className="display max-w-[13ch] text-[clamp(4.2rem,16vw,12.5rem)] font-medium leading-[0.84] tracking-[-0.04em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Nathalia
          </motion.span>
          <motion.span
            className="block text-sage"
            initial={reduce ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            Rigo
          </motion.span>
        </h1>
        <div className="mt-10 flex max-w-xl flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
          <p className="max-w-measure text-[1.15rem] leading-relaxed text-ice/90 md:text-xl">
            Realçar, sem substituir.
            <span className="mt-3 block text-base text-ice/70">
              {brand.bioLine} Doze anos de enfermagem em Sorocaba.
            </span>
          </p>
          <div className="flex flex-col gap-3 text-[11px] uppercase tracking-mark">
            <Link to="/avaliacao" className="text-ice underline decoration-sage/70 underline-offset-4">
              Pedir avaliação
            </Link>
            <Link to="/protocolos" className="text-ice/70">
              Ver os três protocolos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
