import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SiteFooter } from '@/components/brand/SiteFooter'
import { CharacterStage } from '@/components/game/CharacterStage'
import { Reveal } from '@/components/Reveal'
import { PageProgress } from '@/components/sales/PageProgress'
import { StickyCta } from '@/components/sales/StickyCta'
import { brand, faqs, games, plans, sales, testimonials, vices } from '@/data/site'

export function HomePage() {
  const s = sales
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.2])

  return (
    <div className="bg-ink text-paper">
      <PageProgress />

      {/* Minimal sales nav — not the old game nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="#topo" className="flex items-center gap-2">
            <img src={brand.logo} alt="BASE" className="h-7 w-auto" draggable={false} />
          </a>
          <div className="flex items-center gap-4">
            <Link
              to="/quiz"
              className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ash hover:text-paper sm:inline"
            >
              Diagnóstico
            </Link>
            <Link
              to="/quiz"
              className="rounded-md bg-signal px-3 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-signalHot"
            >
              Fazer diagnóstico
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — full bleed, brand as the dominant signal */}
      <section
        id="topo"
        ref={heroRef}
        className="relative min-h-[100svh] overflow-hidden pt-14"
      >
        <motion.div style={{ y: heroY, opacity: heroFade }} className="absolute inset-0">
          <CharacterStage
            pose="resist"
            alignX={0.55}
            showFloor={false}
            scaleBoost={1.55}
            className="h-full w-full opacity-90"
            label="Avatar da vontade BASE"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-grain opacity-[0.12] mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col justify-end px-4 pb-16 pt-20 sm:px-6 lg:justify-center lg:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-signal"
          >
            {s.hero.kicker}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.35em' }}
            animate={{ opacity: 1, letterSpacing: '0.12em' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.4rem,14vw,8.5rem)] font-bold uppercase leading-[0.82] text-paper"
          >
            BASE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-4 max-w-2xl font-display text-[clamp(1.6rem,4.5vw,2.75rem)] font-bold leading-[1.05] tracking-tight"
          >
            {s.hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.65 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-mist sm:text-lg"
          >
            {s.hero.support}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              to="/quiz"
              className="inline-flex min-h-14 items-center justify-center bg-signal px-7 py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-signalHot"
            >
              Fazer diagnóstico grátis
            </Link>
            <a
              href="#mecanismo"
              className="inline-flex min-h-14 items-center justify-center border border-white/25 px-7 py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-paper transition hover:border-signal/60"
            >
              Ver o mecanismo
            </a>
          </motion.div>
        </div>
      </section>

      {/* Opening letter — narrow column, sales letter feel */}
      <section className="sales-letter border-t border-signal/30 px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-[38rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            Carta de abertura
          </p>
          <p className="mt-8 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {s.pattern.line}
          </p>
          <div className="mt-8 space-y-5 text-[1.05rem] leading-[1.75] text-mist">
            <p>{s.pattern.body}</p>
            <p>
              Este não é mais um app de “dias limpos” pra você se sentir bem por 48 horas. É o
              protocolo que assume uma verdade desconfortável: <strong className="text-paper">vontade
              sozinha perde</strong>. Sempre. A menos que exista fundação.
            </p>
            <p>
              Se você já prometeu “a partir de amanhã” mais vezes do que consegue contar — continua
              lendo. O resto desta página não é inspiração. É estrutura.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Problem — full bleed red rail */}
      <section className="sales-rail px-4 py-20 sm:px-6 sm:py-28" id="problema">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 1 — O diagnóstico
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.problem.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.problem.lead}</p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {s.problem.items.map((item, i) => (
              <Reveal key={item.n} delay={i * 0.05}>
                <div className="border-l-2 border-signal pl-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                    Falha {item.n}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{item.t}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ash">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="border-t border-line px-4 py-20 sm:px-6 sm:py-28" id="custo">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 2 — A conta
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.cost.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.cost.lead}</p>
          </Reveal>
          <ol className="mt-12 space-y-8">
            {s.cost.items.map((item, i) => (
              <Reveal key={item.t} delay={i * 0.05}>
                <li className="flex gap-5">
                  <span className="font-display text-4xl font-bold text-signal/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{item.t}</h3>
                    <p className="mt-2 text-base leading-relaxed text-ash">{item.b}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* False solutions */}
      <section className="border-t border-line bg-panel/60 px-4 py-20 sm:px-6 sm:py-28" id="erros">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 3 — O que já quebrou
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.falseSolutions.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.falseSolutions.lead}</p>
          </Reveal>
          <div className="mt-12 space-y-8">
            {s.falseSolutions.items.map((item) => (
              <Reveal key={item.t}>
                <div>
                  <h3 className="font-display text-xl font-semibold text-signal">{item.t}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ash">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanism */}
      <section className="border-t border-line px-4 py-20 sm:px-6 sm:py-28" id="mecanismo">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 4 — O mecanismo
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.mechanism.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.mechanism.lead}</p>
          </Reveal>

          <div className="mt-14 space-y-12">
            {s.mechanism.pillars.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.06}>
                <article>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-will">
                    Pilar {p.n}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{p.t}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ash">{p.b}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 space-y-8 border-t border-line pt-12">
            <p className="font-display text-xl font-semibold">As leis que o protocolo obedece</p>
            {s.mechanism.laws.map((law) => (
              <Reveal key={law.t}>
                <div>
                  <h3 className="font-display text-lg font-semibold">{law.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash sm:text-base">{law.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Acts — cinematic strip */}
      <section className="border-t border-line bg-ink px-4 py-20 sm:px-6 sm:py-24" id="luta">
        <div className="mx-auto max-w-5xl">
          <Reveal className="max-w-[38rem]">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 5 — A metáfora jogável
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Três atos. <span className="text-signal">Vontade perde.</span> BASE sustenta.
            </h2>
            <p className="mt-5 text-lg text-mist">{s.acts.lead}</p>
          </Reveal>

          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {s.acts.steps.map((step) => (
              <div key={step.n} className="bg-ink p-6 sm:p-8">
                <p className="font-mono text-[11px] text-signal">ATO {step.n}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">{step.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{step.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {games.map((g) => (
              <Link
                key={g.id}
                to={`/arena/${g.id}`}
                className="border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mist transition hover:border-signal hover:text-paper"
              >
                {g.name}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              to="/arena/luta"
              className="inline-flex bg-signal px-6 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-signalHot"
            >
              Jogar A Luta — sentir o método
            </Link>
          </div>
        </div>
      </section>

      {/* Features as manifesto list */}
      <section className="border-t border-line px-4 py-20 sm:px-6 sm:py-28" id="fundacao">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 6 — O que você recebe
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.features.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.features.lead}</p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {s.features.items.map((f) => (
              <Reveal key={f.code}>
                <div className="flex gap-4">
                  <span className="font-mono text-sm text-signal">{f.code}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-ash">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vices strip */}
      <section className="border-y border-line bg-panel/40 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            Se adapta ao seu padrão
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {vices.map((v) => (
              <span key={v} className="font-display text-lg text-mist sm:text-xl">
                {v}
                <span className="ml-4 text-line">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="px-4 py-20 sm:px-6 sm:py-28" id="para-quem">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 7 — Filtro
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">{s.forWho.title}</h2>
          </Reveal>
          <div className="mt-12 space-y-10">
            <Reveal>
              <h3 className="font-display text-lg font-semibold text-will">Entre se…</h3>
              <ul className="mt-4 space-y-3">
                {s.forWho.yes.map((line) => (
                  <li key={line} className="border-b border-line/80 pb-3 text-sm leading-relaxed text-mist">
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <h3 className="font-display text-lg font-semibold text-signal">Saia se…</h3>
              <ul className="mt-4 space-y-3">
                {s.forWho.no.map((line) => (
                  <li key={line} className="border-b border-line/80 pb-3 text-sm leading-relaxed text-ash">
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section className="border-t border-line bg-panel/50 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 8 — A virada
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
              {s.transformation.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.transformation.lead}</p>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">Antes</p>
              <ul className="mt-4 space-y-3 text-sm text-ash">
                {s.transformation.before.map((line) => (
                  <li key={line}>— {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Com BASE</p>
              <ul className="mt-4 space-y-3 text-sm text-mist">
                {s.transformation.after.map((line) => (
                  <li key={line}>— {line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-line px-4 py-20 sm:px-6 sm:py-28" id="prova">
        <div className="mx-auto max-w-[38rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 9 — Prova
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {s.socialProof.title}
            </h2>
            <p className="mt-4 text-mist">{s.socialProof.lead}</p>
          </Reveal>
          <div className="mt-12 space-y-12">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="border-l-2 border-signal pl-5">
                <p className="text-lg leading-relaxed text-mist">“{t.quote}”</p>
                <footer className="mt-4">
                  <p className="font-display font-semibold">{t.name}</p>
                  <p className="font-mono text-[11px] text-ash">
                    {t.meta} · {t.days} dias limpo
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER — dominant block */}
      <section
        className="relative overflow-hidden border-t border-signal/40 bg-ink px-4 py-20 sm:px-6 sm:py-28"
        id="oferta"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,6,0,0.22),transparent_55%)]" />
        <div className="relative mx-auto max-w-[40rem]">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
              Capítulo 10 — A oferta
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.offer.title}
            </h2>
            <p className="mt-5 text-lg text-mist">{s.offer.lead}</p>
          </Reveal>

          <Reveal className="mt-10 border border-signal/50 bg-panel/80 p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
              {s.offer.stackTitle}
            </p>
            <ul className="mt-5 space-y-3">
              {s.offer.stack.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-mist sm:text-base">
                  <span className="mt-0.5 text-will">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-10 space-y-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`border p-5 sm:p-6 ${
                  p.highlight ? 'border-signal bg-signal/10' : 'border-line bg-panel/40'
                }`}
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                      {p.badge}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold">{p.name}</h3>
                  </div>
                  <p className="font-display text-3xl font-bold">
                    {p.price}
                    <span className="ml-1 text-sm font-normal text-ash">{p.cadence}</span>
                  </p>
                </div>
                <ul className="mt-4 grid gap-1.5 text-sm text-mist sm:grid-cols-2">
                  {p.perks.map((perk) => (
                    <li key={perk}>· {perk}</li>
                  ))}
                </ul>
                <a
                  href={p.checkout}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex w-full items-center justify-center px-4 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.16em] ${
                    p.highlight
                      ? 'bg-signal text-white hover:bg-signalHot'
                      : 'border border-line text-paper hover:border-signal/50'
                  }`}
                >
                  Quero o plano {p.name}
                </a>
              </div>
            ))}
          </div>

          <Reveal className="mt-10 border border-will/40 bg-willDim/30 p-6 text-center">
            <h3 className="font-display text-2xl font-bold">{s.guarantee.title}</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist">
              {s.guarantee.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line px-4 py-20 sm:px-6 sm:py-24" id="faq">
        <div className="mx-auto max-w-[38rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            Objeções
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">Perguntas que travam a decisão</h2>
          <div className="mt-10 space-y-8">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-line pb-8">
                <h3 className="font-display text-lg font-semibold">{f.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ash sm:text-base">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final close */}
      <section className="relative overflow-hidden border-t border-line px-4 py-28 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-signal/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-[38rem] text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">
            Decisão final
          </p>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {s.close.title}
            <br />
            <span className="text-signal">{s.close.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-mist">{s.close.body}</p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={`${import.meta.env.BASE_URL}cadastro`.replace(/\/+/g, '/')}
              className="bg-signal px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-signalHot"
            >
              {s.close.primaryCta}
            </a>
            <Link
              to="/arena"
              className="border border-line px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-paper hover:border-signal/50"
            >
              {s.close.secondaryCta}
            </Link>
          </div>
          <p className="mx-auto mt-10 max-w-md text-xs leading-relaxed text-ash">
            {brand.disclaimer}
          </p>
        </div>
      </section>

      <SiteFooter />
      <StickyCta />
      <div className="h-16" aria-hidden />
    </div>
  )
}
