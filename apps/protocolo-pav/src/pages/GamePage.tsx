import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { GameId } from '@/data/site'
import { games } from '@/data/site'
import { useProgress } from '@/hooks/useProgress'
import { RunnerGame } from '@/components/game/games/RunnerGame'
import { ReflexGame } from '@/components/game/games/ReflexGame'
import { SnakeGame } from '@/components/game/games/SnakeGame'
import { BlocksGame } from '@/components/game/games/BlocksGame'
import { VelhaGame } from '@/components/game/games/VelhaGame'

const ids = new Set(games.map((g) => g.id))

export function GamePage() {
  const { gameId } = useParams()
  const { record, level, state } = useProgress()
  const [result, setResult] = useState<{ score: number; xp: number } | null>(null)
  const finished = useRef(false)

  const id = gameId as GameId | undefined
  const meta = useMemo(() => games.find((g) => g.id === id), [id])

  const onFinish = useCallback(
    (score: number, xp: number) => {
      if (!id || finished.current) return
      finished.current = true
      record(id, score, xp)
      setResult({ score, xp })
    },
    [id, record],
  )

  if (!id || !ids.has(id) || !meta) return <Navigate to="/arena" replace />

  if (result) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-4 text-center text-paper">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">{meta.name}</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Onda registrada</h1>
        <p className="mt-3 text-mist">
          Score {result.score} · +{result.xp} XP · Total {state.xp} XP
        </p>
        <p className="mt-1 font-mono text-xs text-ash">
          Nível {level.current.id} · {level.current.name}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              finished.current = false
              setResult(null)
            }}
            className="rounded-xl bg-signal px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            Jogar de novo
          </button>
          <Link
            to="/arena"
            className="rounded-xl border border-line px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper"
          >
            Voltar à Arena
          </Link>
          <Link
            to="/protocolo"
            className="rounded-xl border border-will/40 px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-will"
          >
            Abrir Protocolo
          </Link>
        </div>
      </div>
    )
  }

  if (id === 'runner') return <RunnerGame onFinish={onFinish} />
  if (id === 'reflex') return <ReflexGame onFinish={onFinish} />
  if (id === 'snake') return <SnakeGame onFinish={onFinish} />
  if (id === 'blocks') return <BlocksGame onFinish={onFinish} />
  return <VelhaGame onFinish={onFinish} />
}
