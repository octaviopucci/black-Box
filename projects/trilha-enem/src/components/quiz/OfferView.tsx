'use client'

import { ease, VisualFrame } from '@/components/quiz/VisualFrame'
import { offerCopy } from '@/data/quiz'
import { brand } from '@/data/site'
import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.42, ease },
}

export function OfferView({ answers }: { answers: Record<string, string> }) {
  const goal = answers.objetivo
  const block = answers.bloqueio
  const area = answers.area

  const mirrorBits = [
    goal === 'medicina' && 'Você mirou curso concorrido. Trilha foca no que pesa na nota.',
    goal === 'faculdade' && 'Você quer garantir vaga. Plano semanal corta o excesso.',
    goal === 'nota' && 'Você quer 700+. Correção mostra onde subir ponto a ponto.',
    goal === 'redacao' && 'Redação é sua prioridade. Feedback por competência entra no plano.',
    block === 'correcao' && 'Disse que falta correção. É o core do app.',
    block === 'organizacao' && 'Disse que não sabe por onde. Trilha semanal resolve.',
    block === 'redacao' && 'Redação abaixo de 800. Correção linha a linha ataca isso.',
    block === 'tempo' && 'Tempo curto. Trilha prioriza o que mais rende nota.',
    area === 'mat' && 'Matemática é seu foco. Simulados filtram por área.',
    area === 'nat' && 'Natureza é seu foco. Revisão direcionada por erro.',
    area === 'hum' && 'Humanas é seu foco. Conteúdo linkado na correção.',
    area === 'lin' && 'Linguagens e redação. Correção de texto incluída.',
  ].filter(Boolean) as string[]

  const primaryCheckout =
    offerCopy.plans.find((p) => p.highlight)?.checkout ?? offerCopy.plans[0].checkout

  return (
    <motion.section {...fadeUp} className="pb-6 pt-2">
      <VisualFrame stepId="offer" className="mb-6 aspect-[16/10] w-full border border-paper/10" />

      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
        {offerCopy.kicker}
      </p>
      <h2 className="font-display mt-3 text-[clamp(1.8rem,6vw,2.6rem)] font-bold leading-tight">
        {offerCopy.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-mist">{offerCopy.subtitle}</p>

      {mirrorBits.length ? (
        <div className="mt-5 space-y-2 border-l-2 border-signal/60 pl-3 text-sm leading-relaxed text-paper">
          {mirrorBits.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-8 text-center">
        <p className="font-display text-xl font-bold text-signal">{offerCopy.luckTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{offerCopy.luckBody}</p>
      </div>

      <div className="mt-8 border border-paper/10 bg-paper/[0.03] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
          {offerCopy.stackTitle}
        </p>
        <ul className="mt-4 space-y-2.5">
          {offerCopy.stack.map((itemText) => (
            <li key={itemText} className="flex gap-2 text-sm text-mist">
              <span className="text-signal">✓</span>
              <span>{itemText}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-ash">{offerCopy.valueBridge}</p>
      </div>

      <div className="mt-6 space-y-3" id="assinar">
        {offerCopy.plans.map((p) => (
          <motion.a
            key={p.id}
            href={p.checkout}
            whileHover={{ y: -2 }}
            className={`block border p-5 transition ${
              p.highlight
                ? 'border-signal bg-signal/10 shadow-[0_0_24px_rgba(245,213,71,0.15)]'
                : 'border-paper/12 bg-ink hover:border-signal/50'
            }`}
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                  {p.badge}
                </p>
                <p className="font-display mt-1 text-xl font-bold">{p.name}</p>
              </div>
              <p className="font-display text-2xl font-bold">
                {p.price}
                <span className="ml-1 text-xs font-normal text-ash">{p.cadence}</span>
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-ash">
              {p.perks.slice(0, 4).map((perk) => (
                <li key={perk}>· {perk}</li>
              ))}
            </ul>
            <p className="font-display mt-4 text-xs font-bold uppercase tracking-[0.14em] text-paper">
              {offerCopy.cta}
            </p>
          </motion.a>
        ))}
      </div>

      <div className="mt-6 border border-paper/15 bg-paper/[0.04] p-5">
        <p className="text-center font-display text-xl font-bold text-paper">
          {offerCopy.guaranteeTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{offerCopy.guaranteeBody}</p>
      </div>

      <a
        href={primaryCheckout}
        className="mt-8 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[0_0_28px_rgba(245,213,71,0.25)] hover:bg-signal-hot"
      >
        {offerCopy.cta}
      </a>
      <a
        href={brand.ctaWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center border border-paper/15 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper hover:border-signal/50"
      >
        {offerCopy.secondaryCta}
      </a>

      <section className="mt-12 border-t border-paper/10 pt-10">
        <VisualFrame
          stepId="social-proof"
          className="mb-6 aspect-[21/9] w-full border border-paper/10"
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          Quem subiu nota
        </p>
        <div className="mt-6 space-y-8">
          {offerCopy.proofs.map((t) => (
            <blockquote key={t.name} className="border-l-2 border-signal/50 pl-4">
              <p className="text-sm leading-relaxed text-mist">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-3">
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="font-mono text-[10px] text-ash">{t.meta}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-paper/10 pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          {offerCopy.faqTitle}
        </p>
        <div className="mt-6 space-y-6">
          {offerCopy.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-display text-base font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <a
        href={primaryCheckout}
        className="mt-10 flex w-full items-center justify-center bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink hover:bg-signal-hot"
      >
        {offerCopy.cta}
      </a>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-ash">
        {offerCopy.disclaimer}
      </p>
    </motion.section>
  )
}
