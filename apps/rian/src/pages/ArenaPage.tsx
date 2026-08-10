import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SiteNav } from '@/components/brand/SiteNav'
import { SiteFooter } from '@/components/brand/SiteFooter'
import { WaveMeter } from '@/components/arena/WaveMeter'
import { CharacterStage } from '@/components/game/CharacterStage'
import { games } from '@/data/site'
import { useProgress } from '@/hooks/useProgress'

export function ArenaPage() {
  const { state, level } = useProgress()
  const impulse = Math.max(18, 78 - state.wavesCleared * 4)
  const will = Math.min(92, 22 + state.xp / 18 + state.wavesCleared * 3)
  const featured = games.find((g) => g.featured) ?? games[0]
  const sideGames = games.filter((g) => !g.featured)

  return (
    <div className="bg-ink text-paper">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              Ato I · Arena da vontade
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              A luta contra o vício.
            </h1>
            <p className="mt-3 max-w-xl text-mist">
              Força de vontade sozinha não sustenta. O vício ganha. Com BASE (estrutura, rotina,
              propósito, protocolo), a mesma onda fica possível de atravessar.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-panel px-4 py-3 text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
              Nível {String(level.current.id).padStart(2, '0')} · {level.current.name}
            </p>
            <p className="font-display text-2xl font-bold text-will">{state.xp} XP</p>
            <p className="font-mono text-[11px] text-ash">
              Streak {state.streak} · Ondas {state.wavesCleared}
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-panel">
            <CharacterStage
              pose={will > impulse ? 'win' : 'resist'}
              className="h-[360px] w-full sm:h-[440px]"
            />
          </div>
          <div className="space-y-4">
            <WaveMeter
              impulse={impulse}
              will={will}
              wave={state.wavesCleared}
              xp={state.xp}
            />
            <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                Desafio central
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">{featured.name}</h2>
              <p className="mt-2 text-sm text-mist">{featured.blurb}</p>
              <ol className="mt-3 space-y-1 font-mono text-[11px] text-ash">
                <li>1. Só vontade → o vício vence</li>
                <li>2. Construa a BASE (3 pilares)</li>
                <li>3. Com BASE → a onda fica atravessável</li>
              </ol>
            </div>
            <Link
              to={`/arena/${featured.id}`}
              className="flex min-h-14 w-full items-center justify-center rounded-xl bg-signal px-4 py-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-signalHot active:bg-signalHot"
            >
              Jogar no celular
            </Link>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
              Feito para o dedo · também roda no PC
            </p>
            <Link
              to="/protocolo"
              className="flex w-full items-center justify-center rounded-xl border border-line px-4 py-3 font-display text-xs font-semibold uppercase tracking-[0.16em] text-mist hover:border-will/40 hover:text-will"
            >
              Depois da luta: Protocolo PAV
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold">Ferramentas na fissura</h2>
          <p className="mt-2 text-sm text-ash">
            Mini-jogos para ocupar a mente nos minutos críticos. O desafio que explica o método é A
            Luta.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sideGames.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/arena/${g.id}`}
                  className="block h-full rounded-2xl border border-line bg-panel p-5 transition hover:border-signal/45"
                >
                  <div className="mb-4 h-24 overflow-hidden rounded-xl border border-white/5 bg-ink">
                    <MiniPreview id={g.id} accent={g.accent} />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{g.name}</h3>
                  <p className="mt-2 text-sm text-ash">{g.blurb}</p>
                  <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="text-will">Melhor {state.bestByGame[g.id] ?? 0}</span>
                    <span className="text-mist">{g.duration}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function MiniPreview({ id, accent }: { id: string; accent: string }) {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className="h-10 w-10 rounded-full opacity-80"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 70%)`,
          boxShadow: `0 0 40px ${accent}55`,
        }}
      />
      <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
        {id}
      </span>
    </div>
  )
}
