import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SiteNav } from '@/components/brand/SiteNav'
import { SiteFooter } from '@/components/brand/SiteFooter'
import { CharacterStage } from '@/components/game/CharacterStage'
import { brand, faqs, features, games, plans, testimonials, vices } from '@/data/site'

export function HomePage() {
  return (
    <div className="bg-ink text-paper">
      <SiteNav />

      <section className="relative min-h-dvh overflow-hidden bg-ink pt-16">
        <div className="absolute inset-0">
          <CharacterStage
            pose="resist"
            className="h-full w-full scale-110"
            label="Avatar da vontade BASE"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-10 sm:px-6 lg:justify-center lg:pb-20">
          <div className="max-w-xl">
            <motion.img
              src={brand.logo}
              alt="BASE"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 h-10 w-auto sm:h-12"
              draggable={false}
            />
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.6rem,8vw,5rem)] font-bold leading-[0.92] tracking-[-0.03em] text-balance"
            >
              {brand.tagline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.65 }}
              className="mt-5 max-w-md text-base leading-relaxed text-mist sm:text-lg"
            >
              Arena da vontade com jogos reais e personagem animado nos minutos da fissura.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/arena"
                className="rounded-xl bg-signal px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-signalHot"
              >
                Entrar na Arena
              </Link>
              <a
                href={brand.cadastroExternal}
                className="rounded-xl border border-white/20 bg-black/30 px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-paper backdrop-blur-sm transition hover:border-signal/50"
              >
                Quero minha base
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-20 sm:px-6" id="problema">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/01 O problema</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Você já tentou. E caiu. De novo.
          </h2>
          <p className="mt-4 max-w-xl text-mist">
            O problema não é falta de força de vontade. É falta de BASE.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: '01',
                t: 'Força de vontade falha',
                b: 'Disciplina sem sistema é roleta russa. Hoje cedo, amanhã não.',
              },
              {
                n: '02',
                t: 'Você está sozinho',
                b: 'Ninguém vê seu esforço. Ninguém te cobra. Ninguém te lembra do porquê.',
              },
              {
                n: '03',
                t: 'Recaída = colapso',
                b: 'Sem fundação, qualquer tropeço derruba tudo o que você construiu.',
              },
            ].map((item) => (
              <div key={item.n} className="border-t border-signal/40 pt-5">
                <p className="font-mono text-[11px] text-signal">/{item.n}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 px-4 py-20 sm:px-6" id="sistema">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            // sistema_gamificado · v3
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Dois atos. <span className="text-signal">Vontade no jogo.</span> BASE no protocolo.
          </h2>
          <p className="mt-4 max-w-2xl text-mist">
            Primeiro você atravessa a onda da fissura com mini-jogos reais, XP e personagem animado.
            Depois o PAV entra: protocolo de 9 etapas, rotina e substituição do vício por estrutura.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {games.map((g, i) => (
              <Link
                key={g.id}
                to={`/arena/${g.id}`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-ink p-4 transition hover:border-signal/50"
              >
                <div
                  className="mb-4 h-1.5 w-10 rounded-full transition group-hover:w-16"
                  style={{ background: g.accent }}
                />
                <p className="font-mono text-[10px] text-ash">0{i + 1}</p>
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
              to="/arena"
              className="inline-flex rounded-xl bg-signal px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white hover:bg-signalHot"
            >
              Abrir Arena completa
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-20 sm:px-6" id="funcionalidades">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/03 Funcionalidades</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Tudo que o app entrega.</h2>
          <p className="mt-3 text-mist">Jogo na crise · protocolo no dia · evolução na semana.</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {features.map((f) => (
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

      <section className="border-t border-line px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/04 Vícios combatidos</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Qualquer padrão que te derruba.</h2>
          <p className="mt-2 text-mist">Não importa qual é o seu. O sistema se adapta.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {vices.map((v) => (
              <span
                key={v}
                className="rounded-full border border-line bg-panel px-3 py-1.5 text-sm text-mist"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/05 Prova</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Quem reconstruiu.</h2>
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

      <section className="border-t border-line px-4 py-20 sm:px-6" id="investimento">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/06 Investimento</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Quanto vale ter base?</h2>
          <p className="mt-3 text-mist">Menos do que você gasta em um final de semana caindo.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border p-6 ${
                  p.highlight ? 'border-signal bg-signal/10' : 'border-line bg-panel'
                }`}
              >
                {p.highlight ? (
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                    Mais escolhido
                  </p>
                ) : null}
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
                  Começar
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ash">
            30 dias de garantia incondicional. Se em 30 dias o BASE não fizer diferença, devolução
            total.
          </p>
        </div>
      </section>

      <section className="border-t border-line px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">/07 FAQ</p>
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

      <section className="border-t border-line px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
            // decisao_final.exe
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Você vai cair de novo hoje?
            <br />
            <span className="text-signal">Ou vai começar a se levantar?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-mist">
            A diferença entre quem se reconstrói e quem continua caindo é uma decisão. Agora.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/arena"
              className="rounded-xl bg-signal px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-white hover:bg-signalHot"
            >
              Começar na Arena
            </Link>
            <a
              href={brand.cadastroExternal}
              className="rounded-xl border border-line px-6 py-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-paper"
            >
              Criar conta BASE
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
