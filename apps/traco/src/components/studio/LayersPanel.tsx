import {
  Copy,
  Eye,
  EyeOff,
  Lock,
  LockOpen,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useStudio } from '@/store/StudioContext'
import type { BlendMode } from '@/types'

const BLENDS: { id: BlendMode; label: string }[] = [
  { id: 'source-over', label: 'Normal' },
  { id: 'multiply', label: 'Multiplicar' },
  { id: 'screen', label: 'Tela' },
  { id: 'overlay', label: 'Sobrepor' },
  { id: 'darken', label: 'Escurecer' },
  { id: 'lighten', label: 'Clarear' },
  { id: 'soft-light', label: 'Luz suave' },
  { id: 'hard-light', label: 'Luz dura' },
  { id: 'difference', label: 'Diferença' },
]

export function LayersPanel() {
  const studio = useStudio()
  const active = studio.layers.find((l) => l.id === studio.activeLayerId)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-line bg-slate/90">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">Camadas</h2>
        <div className="flex gap-1">
          <IconBtn title="Nova camada" onClick={studio.addLayer}>
            <Plus size={14} />
          </IconBtn>
          <IconBtn
            title="IA nesta camada"
            onClick={() => {
              studio.selectActiveLayer()
            }}
          >
            <Sparkles size={14} />
          </IconBtn>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {studio.layers.map((layer) => {
          const selected = layer.id === studio.activeLayerId
          return (
            <div
              key={layer.id}
              onClick={() => studio.setActiveLayer(layer.id)}
              className={`cursor-pointer rounded-xl border px-2 py-2 transition ${
                selected
                  ? 'border-ember/50 bg-panel'
                  : 'border-transparent bg-ink/40 hover:border-line'
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  title={layer.visible ? 'Ocultar' : 'Mostrar'}
                  onClick={(e) => {
                    e.stopPropagation()
                    studio.updateLayer(layer.id, { visible: !layer.visible })
                  }}
                  className="text-mist hover:text-bone"
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <input
                  value={layer.name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => studio.updateLayer(layer.id, { name: e.target.value })}
                  className="min-w-0 flex-1 bg-transparent text-sm text-bone outline-none"
                />
                <button
                  title={layer.locked ? 'Desbloquear' : 'Bloquear'}
                  onClick={(e) => {
                    e.stopPropagation()
                    studio.updateLayer(layer.id, { locked: !layer.locked })
                  }}
                  className="text-mist hover:text-bone"
                >
                  {layer.locked ? <Lock size={13} /> : <LockOpen size={13} />}
                </button>
              </div>
              {selected && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2 text-[11px] text-mist">
                    Opacidade
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={layer.opacity}
                      onChange={(e) =>
                        studio.updateLayer(layer.id, { opacity: Number(e.target.value) })
                      }
                      className="flex-1 accent-ember"
                    />
                  </label>
                  <select
                    value={layer.blendMode}
                    onChange={(e) =>
                      studio.updateLayer(layer.id, {
                        blendMode: e.target.value as BlendMode,
                      })
                    }
                    className="w-full rounded-lg border border-line bg-ink px-2 py-1 text-[11px] text-bone"
                  >
                    {BLENDS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <IconBtn title="Subir" onClick={() => studio.reorderLayer(layer.id, -1)}>
                      <ChevronUp size={14} />
                    </IconBtn>
                    <IconBtn title="Descer" onClick={() => studio.reorderLayer(layer.id, 1)}>
                      <ChevronDown size={14} />
                    </IconBtn>
                    <IconBtn title="Duplicar" onClick={() => studio.duplicateLayer(layer.id)}>
                      <Copy size={14} />
                    </IconBtn>
                    <IconBtn title="Apagar" onClick={() => studio.deleteLayer(layer.id)}>
                      <Trash2 size={14} />
                    </IconBtn>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {active && (
        <div className="border-t border-line p-3 text-[11px] leading-relaxed text-mist">
          Ativa: <span className="text-bone">{active.name}</span>
          <br />
          Selecione com laço/retângulo/elipse ou use ✨ para a camada inteira, depois peça à IA.
        </div>
      )}
    </aside>
  )
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-lg text-mist hover:bg-panel hover:text-bone"
    >
      {children}
    </button>
  )
}
