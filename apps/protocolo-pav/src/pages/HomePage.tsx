import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SiteNav } from '@/components/brand/SiteNav'
import { SiteFooter } from '@/components/brand/SiteFooter'
import { CharacterStage } from '@/components/game/CharacterStage'
import { Reveal } from '@/components/Reveal'
import { brand, faqs, games, plans, sales, testimonials, vices } from '@/data/site'

export function HomePage() {
  const s = sales

  return (
    <div className="bg-ink text-paper">
      <SiteNav />

      {/* HERO — brand first, one composition */}
      <section className="relative min-h-dvh overflow-hidden bg-ink pt-16">
        <div className="pointer-events-none absolute inset-0">
          <CharacterStage
            pose="resist"
            alignX={0.72}
            showFloor={false}
            scaleBoost={1.35}
            className="h-full w-full"
            label="Avatar da vontade BASE"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink from-25% via-ink/70 via-55% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
          <div className="absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-signal/15 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-10 sm:px-6 lg:justify-center lg:pb-20">
          <div className="max-w-xl">
            <motion.img
              src={brand.logo}
              alt="BASE"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-5 h-12 w-auto sm:h-14"
              draggable={false}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.5 }}
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal"
            >
              {s.hero.kicker}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.6rem,8vw,5rem)] font-bold leading-[0.92] tracking-[-0.03em] text-balance"
            >
              {s.hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.65 }}
              className="mt-5 max-w-md text-base leading-relaxed text-mist sm:text-lg"
            >
              {s.hero.support}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href={brand.cadastroExternal}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-signal px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-signalHot active:bg-signalHot"
              >
                {s.hero.primaryCta}
              </a>
              <Link
                to="/arena/luta"
                className="rounded-xl border border-white/20 bg-black/30 px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-paper backdrop-blur-sm transition hover:border-signal/50"
              >
                {s.hero.secondaryCta}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pattern interrupt */}
      <section className="border-t border-line bg-panel/50 px-4 py-16 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl">
            {s.pattern.line}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist">
            {s.pattern.body}
          </p>
        </Reveal>
      </section>

      {/* Problem */}
      <section className="border-t border-line px-4 py-20 sm:px-6" id="problema">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.problem.code} O problema
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.problem.title}
            </h2>
            <p className="mt-4 max-w-xl text-mist">{s.problem.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {s.problem.items.map((item, i) => (
              <Reveal key={item.n} delay={i * 0.06}>
                <div className="border-t border-signal/40 pt-5">
                  <p className="font-mono text-[11px] text-signal">/{item.n}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cost of inaction */}
      <section className="border-t border-line bg-panel/40 px-4 py-20 sm:px-6" id="custo">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.cost.code} O custo
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.cost.title}
            </h2>
            <p className="mt-4 max-w-2xl text-mist">{s.cost.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {s.cost.items.map((item, i) => (
              <Reveal key={item.t} delay={i * 0.06}>
                <div className="h-full border border-line bg-ink/50 p-6">
                  <h3 className="font-display text-xl font-semibold text-signal">{item.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* False solutions */}
      <section className="border-t border-line px-4 py-20 sm:px-6" id="erros">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.falseSolutions.code} Falsas saídas
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.falseSolutions.title}
            </h2>
            <p className="mt-4 max-w-2xl text-mist">{s.falseSolutions.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {s.falseSolutions.items.map((item, i) => (
              <Reveal key={item.t} delay={i * 0.05}>
                <div className="border-l border-signal/50 pl-4">
                  <h3 className="font-display text-lg font-semibold">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Unique mechanism */}
      <section className="border-t border-line bg-panel/30 px-4 py-20 sm:px-6" id="sistema">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.mechanism.code} O mecanismo
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {s.mechanism.title}
            </h2>
            <p className="mt-4 max-w-2xl text-mist">{s.mechanism.lead}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {s.mechanism.pillars.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.06}>
                <div className="h-full border border-line bg-ink/60 p-5">
                  <p className="font-mono text-[11px] text-signal">PILAR {p.n}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{p.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {s.mechanism.laws.map((law, i) => (
              <Reveal key={law.t} delay={i * 0.05}>
                <div className="flex gap-4">
                  <span className="font-mono text-sm text-will">◆</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{law.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ash">{law.b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Three acts + games */}
      <section className="border-t border-line px-4 py-20 sm:px-6" id="arena">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.acts.code} A Luta
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Três atos. <span className="text-signal">Vontade perde.</span> BASE sustenta.
            </h2>
            <p className="mt-4 max-w-2xl text-mist">{s.acts.lead}</p>
          </Reveal>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {s.acts.steps.map((step) => (
              <div key={step.n} className="border border-line bg-ink/60 p-5">
                <p className="font-mono text-[11px] text-signal">ATO {step.n}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{step.t}</h3>
                <p className="mt-2 text-sm text-ash">{step.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g, i) => (
              <Link
                key={g.id}
                to={`/arena/${g.id}`}
                className={`group relative overflow-hidden rounded-2xl border bg-ink p-4 transition hover:border-signal/50 ${
                  g.featured ? 'border-signal/50 sm:col-span-2 lg:col-span-1' : 'border-line'
                }`}
              >
                <div
                  className="mb-4 h-1.5 w-10 rounded-full transition group-hover:w-16"
                  style={{ background: g.accent }}
                />
                <p className="font-mono text-[10px] text-ash">
                  {g.featured ? 'DESAFIO CENTRAL' : `0${i}`}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{g.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ash">{g.blurb}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-will">
                  Jogar · {g.duration}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/arena/luta"
              className="inline-flex rounded-xl bg-signal px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white hover:bg-signalHot"
            >
              Jogar A Luta agora
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line bg-panel/40 px-4 py-20 sm:px-6" id="funcionalidades">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.features.code} Fundação
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              {s.features.title}
            </h2>
            <p className="mt-3 text-mist">{s.features.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {s.features.items.map((f) => (
              <div key={f.code} className="flex gap-4">
                <span className="font-mono text-sm text-signal">/{f.code}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vices */}
      <section className="border-t border-line px-4 py-16 sm:px-6" id="padroes">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /Padrões
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Qualquer padrão que te derruba.
            </h2>
            <p className="mt-2 text-mist">Não importa qual é o seu. O sistema se adapta.</p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {vices.map((v) => (
              <span
                key={v}
                className="border border-line bg-panel px-3 py-1.5 text-sm text-mist"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="border-t border-line bg-panel/30 px-4 py-20 sm:px-6" id="para-quem">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.forWho.code} Filtro
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              {s.forWho.title}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-lg font-semibold text-will">Sim — entre</h3>
              <ul className="mt-4 space-y-3">
                {s.forWho.yes.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-mist">
                    <span className="text-will">+</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="font-display text-lg font-semibold text-signal">Não — saia</h3>
              <ul className="mt-4 space-y-3">
                {s.forWho.no.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-ash">
                    <span className="text-signal">−</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section className="border-t border-line px-4 py-20 sm:px-6" id="transformacao">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.transformation.code} Transformação
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-5xl">
              {s.transformation.title}
            </h2>
            <p className="mt-4 max-w-2xl text-mist">{s.transformation.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="border border-line bg-ink/50 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
                  Antes
                </p>
                <ul className="mt-4 space-y-3">
                  {s.transformation.before.map((line) => (
                    <li key={line} className="text-sm text-ash">
                      · {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="border border-signal/40 bg-signal/5 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                  Com BASE
                </p>
                <ul className="mt-4 space-y-3">
                  {s.transformation.after.map((line) => (
                    <li key={line} className="text-sm text-mist">
                      · {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-line bg-panel/30 px-4 py-20 sm:px-6" id="prova">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.socialProof.code} Prova
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              {s.socialProof.title}
            </h2>
            <p className="mt-3 max-w-2xl text-mist">{s.socialProof.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="border-l border-signal/50 pl-4">
                <p className="text-sm leading-relaxed text-mist">“{t.quote}”</p>
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

      {/* Offer */}
      <section className="border-t border-line px-4 py-20 sm:px-6" id="investimento">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              /{s.offer.code} Investimento
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              {s.offer.title}
            </h2>
            <p className="mt-3 text-mist">{s.offer.lead}</p>
          </Reveal>

          <Reveal className="mt-8 border border-line bg-panel/60 p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
              {s.offer.stackTitle}
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {s.offer.stack.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-mist">
                  <span className="text-will">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border p-6 ${
                  p.highlight ? 'border-signal bg-signal/10' : 'border-line bg-panel'
                }`}
              >
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                  {p.badge}
                </p>
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 font-display text-3xl font-bold">
                  {p.price}
                  <span className="ml-1 text-sm font-normal text-ash">{p.cadence}</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm text-mist">
                  {p.perks.map((perk) => (
                    <li key={perk}>· {perk}</li>
                  ))}
                </ul>
                <a
                  href={brand.cadastroExternal}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] ${
                    p.highlight
                      ? 'bg-signal text-white hover:bg-signalHot'
                      : 'border border-line text-paper hover:border-signal/50'
                  }`}
                >
                  Começar com {p.name}
                </a>
              </div>
            ))}
          </div>

          <Reveal className="mt-10 border border-will/30 bg-willDim/40 p-6 text-center sm:p-8">
            <h3 className="font-display text-2xl font-bold">{s.guarantee.title}</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-mist">
              {s.guarantee.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line px-4 py-16 sm:px-6" id="faq">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Objeções. Resolvidas.</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-lg font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final close */}
      <section className="relative overflow-hidden border-t border-line px-4 py-24 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-signal/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            /{s.close.code} Decisão
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {s.close.title}
            <br />
            <span className="text-signal">{s.close.highlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-mist">{s.close.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={brand.cadastroExternal}
              className="rounded-xl bg-signal px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white hover:bg-signalHot"
            >
              {s.close.primaryCta}
            </a>
            <Link
              to="/arena"
              className="rounded-xl border border-line px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-paper hover:border-signal/50"
            >
              {s.close.secondaryCta}
            </Link>
          </div>
          <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-ash">
            {brand.disclaimer}
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
