import { BRUSH_LIST, DEFAULT_PALETTE } from '@/lib/brushes'
import { useStudio } from '@/store/StudioContext'

export function BrushDock() {
  const {
    brushId,
    setBrushId,
    brushSize,
    setBrushSize,
    brushOpacity,
    setBrushOpacity,
    color,
    setColor,
    tool,
  } = useStudio()

  if (tool !== 'brush' && tool !== 'eraser' && tool !== 'smudge') {
    return (
      <div className="border-t border-line bg-slate/80 px-4 py-3 text-xs text-mist">
        Ferramenta: <span className="text-bone">{tool}</span>
        {(tool === 'lasso' || tool === 'rect' || tool === 'ellipse') &&
          ' — trace a seleção e abra a IA para pedir alterações.'}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-line bg-slate/80 px-4 py-3">
      <div className="flex flex-wrap gap-1.5">
        {BRUSH_LIST.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setBrushId(b.id)
              setBrushSize(b.size)
              setBrushOpacity(b.opacity)
            }}
            className={`rounded-lg px-2.5 py-1.5 text-xs transition ${
              brushId === b.id
                ? 'bg-ember text-ink'
                : 'bg-panel text-mist hover:text-bone'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs text-mist">
        Tamanho
        <input
          type="range"
          min={1}
          max={120}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-28 accent-ember"
        />
        <span className="w-8 text-bone">{brushSize}</span>
      </label>

      <label className="flex items-center gap-2 text-xs text-mist">
        Opacidade
        <input
          type="range"
          min={0.05}
          max={1}
          step={0.05}
          value={brushOpacity}
          onChange={(e) => setBrushOpacity(Number(e.target.value))}
          className="w-28 accent-ember"
        />
        <span className="w-10 text-bone">{Math.round(brushOpacity * 100)}%</span>
      </label>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border border-line bg-transparent"
        />
        <div className="flex flex-wrap gap-1">
          {DEFAULT_PALETTE.map((c) => (
            <button
              key={c}
              title={c}
              onClick={() => setColor(c)}
              className="h-5 w-5 rounded-full border border-white/10"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
