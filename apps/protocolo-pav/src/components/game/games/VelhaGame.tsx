import { useMemo, useState } from 'react'
import { GameShell } from '../GameShell'

type Props = { onFinish: (score: number, xp: number) => void }
type Cell = '' | 'X' | 'O'

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function winner(board: Cell[]) {
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  if (board.every(Boolean)) return 'draw'
  return null
}

function aiMove(board: Cell[]): number {
  const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
  for (const i of empty) {
    const copy = [...board]
    copy[i] = 'O'
    if (winner(copy) === 'O') return i
  }
  for (const i of empty) {
    const copy = [...board]
    copy[i] = 'X'
    if (winner(copy) === 'X') return i
  }
  if (board[4] === '') return 4
  return empty[Math.floor(Math.random() * empty.length)] ?? 0
}

export function VelhaGame({ onFinish }: Props) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(''))
  const [locked, setLocked] = useState(false)
  const [msg, setMsg] = useState('Sua vez. Você é X.')
  const result = useMemo(() => winner(board), [board])

  const play = (i: number) => {
    if (locked || board[i] || result) return
    const next = [...board]
    next[i] = 'X'
    const w = winner(next)
    if (w) {
      setBoard(next)
      finish(w)
      return
    }
    const ai = aiMove(next)
    next[ai] = 'O'
    setBoard(next)
    const w2 = winner(next)
    if (w2) finish(w2)
  }

  const finish = (w: 'X' | 'O' | 'draw') => {
    setLocked(true)
    if (w === 'X') {
      setMsg('Vitória. Onda enfraquecida.')
      onFinish(30, 22)
    } else if (w === 'draw') {
      setMsg('Empate. Tempo ganho.')
      onFinish(18, 14)
    } else {
      setMsg('Derrota. Respira e joga de novo na Arena.')
      onFinish(8, 8)
    }
  }

  return (
    <GameShell
      title="Velha"
      subtitle="Partida rápida enquanto a onda passa"
      hud={locked ? 'fim' : 'vs CPU'}
      footer={<p className="text-center text-xs text-ash">{msg}</p>}
    >
      <div className="flex h-full min-h-[55vh] items-center justify-center p-6">
        <div className="grid w-full max-w-sm grid-cols-3 gap-3">
          {board.map((cell, i) => (
            <button
              key={i}
              type="button"
              onClick={() => play(i)}
              disabled={locked || Boolean(cell)}
              className="aspect-square rounded-xl border border-line bg-steel font-display text-4xl font-bold text-paper transition hover:border-signal disabled:opacity-80"
            >
              <span className={cell === 'X' ? 'text-will' : cell === 'O' ? 'text-signal' : ''}>
                {cell}
              </span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  )
}
