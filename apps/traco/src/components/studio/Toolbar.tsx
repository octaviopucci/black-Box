import {
  Brush,
  Circle,
  Droplets,
  Eraser,
  Hand,
  Move,
  Pipette,
  PaintBucket,
  Square,
  Sparkles,
  Waypoints,
} from 'lucide-react'
import { useStudio } from '@/store/StudioContext'
import type { ToolId } from '@/types'

const TOOLS: Array<{ id: ToolId; label: string; icon: React.ReactNode }> = [
  { id: 'brush', label: 'Pincel', icon: <Brush size={18} /> },
  { id: 'eraser', label: 'Borracha', icon: <Eraser size={18} /> },
  { id: 'smudge', label: 'Borrar', icon: <Droplets size={18} /> },
  { id: 'fill', label: 'Preencher', icon: <PaintBucket size={18} /> },
  { id: 'eyedropper', label: 'Conta-gotas', icon: <Pipette size={18} /> },
  { id: 'lasso', label: 'Laço', icon: <Waypoints size={18} /> },
  { id: 'rect', label: 'Retângulo', icon: <Square size={18} /> },
  { id: 'ellipse', label: 'Elipse', icon: <Circle size={18} /> },
  { id: 'move', label: 'Mover', icon: <Move size={18} /> },
  { id: 'hand', label: 'Mão', icon: <Hand size={18} /> },
]

export function Toolbar({ onOpenAi }: { onOpenAi: () => void }) {
  const { tool, setTool, selection } = useStudio()

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-line bg-slate/90 py-3">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          title={t.label}
          aria-label={t.label}
          onClick={() => setTool(t.id)}
          className={`grid h-10 w-10 place-items-center rounded-xl transition ${
            tool === t.id
              ? 'bg-ember text-ink shadow-glow'
              : 'text-mist hover:bg-panel hover:text-bone'
          }`}
        >
          {t.icon}
        </button>
      ))}
      <div className="my-2 h-px w-8 bg-line" />
      <button
        title="IA na seleção"
        aria-label="IA na seleção"
        onClick={onOpenAi}
        className={`grid h-10 w-10 place-items-center rounded-xl transition ${
          selection.active
            ? 'bg-jade/20 text-jade ring-1 ring-jade/50'
            : 'text-mist hover:bg-panel hover:text-bone'
        }`}
      >
        <Sparkles size={18} />
      </button>
    </aside>
  )
}
