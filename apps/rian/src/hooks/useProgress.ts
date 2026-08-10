import { useCallback, useEffect, useState } from 'react'
import type { GameId } from '@/data/site'
import {
  awardPlay,
  levelFromXp,
  loadProgress,
  saveProgress,
  type ProgressState,
} from '@/lib/progress'

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const record = useCallback((game: GameId, score: number, xp: number) => {
    setState((prev) => awardPlay(prev, game, score, xp))
  }, [])

  const level = levelFromXp(state.xp)
  return { state, record, level }
}
