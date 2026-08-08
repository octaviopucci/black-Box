import { levels, type GameId } from '@/data/site'

const KEY = 'base-pav-arena-v1'

export type ProgressState = {
  xp: number
  wavesCleared: number
  bestByGame: Partial<Record<GameId, number>>
  streak: number
  lastPlayDay: string | null
}

const defaultState = (): ProgressState => ({
  xp: 0,
  wavesCleared: 0,
  bestByGame: {},
  streak: 0,
  lastPlayDay: null,
})

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...JSON.parse(raw) }
  } catch {
    return defaultState()
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function levelFromXp(xp: number) {
  type Level = (typeof levels)[number]
  let current: Level = levels[0]
  let next: Level | null = levels[1] ?? null
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      current = levels[i]
      next = levels[i + 1] ?? null
    }
  }
  const floor = current.xp
  const ceil = next?.xp ?? current.xp + 200
  const pct = next ? Math.min(99, Math.round(((xp - floor) / (ceil - floor)) * 100)) : 100
  return { current, next, pct }
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function awardPlay(
  state: ProgressState,
  game: GameId,
  score: number,
  xpGain: number,
): ProgressState {
  const day = todayKey()
  let streak = state.streak
  if (state.lastPlayDay !== day) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yKey = yesterday.toISOString().slice(0, 10)
    streak = state.lastPlayDay === yKey ? streak + 1 : 1
  }
  const best = Math.max(state.bestByGame[game] ?? 0, score)
  return {
    ...state,
    xp: state.xp + xpGain,
    wavesCleared: state.wavesCleared + (xpGain >= 20 ? 1 : 0),
    bestByGame: { ...state.bestByGame, [game]: best },
    streak,
    lastPlayDay: day,
  }
}
