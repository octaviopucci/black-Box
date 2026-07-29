import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { asset, languages } from '../data/site'
import { Reveal } from './Reveal'

function LanguagePanel({
  item,
  index,
}: {
  item: (typeof languages)[number]
  index: number
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const clip = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7],
    ['inset(12% 8% 12% 8%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  )

  return (
    <article
      ref={ref}
      className="relative min-h-[85svh] overflow-hidden border-t border-line"
    >
      <motion.div style={{ y, clipPath: clip }} className="absolute inset-0">
        <img
          src={asset(item.image)}
          alt={`${item.title} — trabalho de Octávio Pucci`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[85svh] max-w-7xl flex-col justify-end px-5 py-16 sm:px-8 lg:justify-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold">
          {String(index + 1).padStart(2, '0')} · {item.accent}
        </p>
        <h3 className="mt-4 max-w-xl font-brand text-[clamp(2.4rem,7vw,5rem)] leading-[0.92] tracking-[0.04em] text-bone">
          {item.title}
        </h3>
        <p className="mt-4 max-w-md font-display text-2xl italic text-bone/85 sm:text-3xl">
          {item.line}
        </p>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone/60 sm:text-base">
          {item.detail}
        </p>
      </div>
    </article>
  )
}

export function Languages() {
  return (
    <section id="linguagens" className="bg-void">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-gold" />
            Linguagens
          </p>
          <h2 className="mt-5 font-brand text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] tracking-[0.05em]">
            Três caminhos.
            <br />
            <span className="text-gold">Uma mão.</span>
          </h2>
        </Reveal>
      </div>

      {languages.map((item, index) => (
        <LanguagePanel key={item.id} item={item} index={index} />
      ))}
    </section>
  )
}
