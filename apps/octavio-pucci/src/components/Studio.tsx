import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { asset, media, proofs, site } from '../data/site'
import { Reveal } from './Reveal'

export function Studio() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section
      id="estudio"
      ref={ref}
      className="relative overflow-hidden border-t border-line bg-ink"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[70svh] overflow-hidden lg:min-h-[100svh]">
          <motion.div style={{ y }} className="absolute inset-0">
            <img
              src={asset(media.studio)}
              alt="Octávio Pucci tatuando em sessão no studio privado"
              className="h-full w-full object-cover object-[50%_20%]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/80" />
          </motion.div>
        </div>

        <div className="relative flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold" />
              Estúdio privado
            </p>
            <h2 className="mt-5 font-brand text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.92] tracking-[0.05em]">
              Capão Bonito.
              <br />
              <span className="text-gold">Presença total.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 space-y-5 text-base leading-relaxed text-ash sm:text-lg">
            <p>
              Aqui não é fila de walk-in. É studio privado — agenda, higiene e
              foco no seu projeto do início ao último traço.
            </p>
            <p>
              Com {site.years} anos de ofício, Octávio conduz realismo preto e
              cinza, coberturas e fine line com a mesma obsessão: composição que
              respeita o corpo e a história de quem veste.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4">
            {proofs.map((proof, i) => (
              <Reveal key={proof.who} delay={0.08 * i}>
                <blockquote className="border-l border-gold/50 pl-5">
                  <p className="font-display text-xl italic leading-snug text-bone/90 sm:text-2xl">
                    “{proof.text}”
                  </p>
                  <footer className="mt-3 text-[11px] uppercase tracking-[0.22em] text-gold">
                    {proof.who}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-12">
            <div className="relative overflow-hidden border border-line">
              <img
                src={asset(media.brand)}
                alt="Octávio Pucci — identidade visual Predestinado"
                className="aspect-[16/10] w-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 font-brand text-2xl tracking-[0.14em] text-bone">
                PREDESTINADO
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
