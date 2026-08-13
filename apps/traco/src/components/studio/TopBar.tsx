import { Link } from 'react-router-dom'
import {
  Download,
  Redo2,
  Save,
  Undo2,
  ZoomIn,
  ZoomOut,
  Trash2,
  Ban,
} from 'lucide-react'
import { useStudio } from '@/store/StudioContext'

export function TopBar() {
  const studio = useStudio()

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-slate/95 px-3">
      <Link to="/gallery" className="font-display text-lg font-bold tracking-tight text-bone">
        traço
      </Link>
      <input
        value={studio.name}
        onChange={(e) => studio.setName(e.target.value)}
        className="min-w-0 max-w-[220px] truncate rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-bone outline-none hover:border-line focus:border-line"
      />
      <span className="text-[11px] text-mist">
        {studio.dirty ? 'Salvando…' : 'Salvo'}
      </span>

      <div className="ml-auto flex items-center gap-1">
        <BarBtn title="Desfazer" onClick={studio.undo} disabled={!studio.canUndo}>
          <Undo2 size={16} />
        </BarBtn>
        <BarBtn title="Refazer" onClick={studio.redo} disabled={!studio.canRedo}>
          <Redo2 size={16} />
        </BarBtn>
        <BarBtn title="Limpar seleção" onClick={studio.clearSelection}>
          <Ban size={16} />
        </BarBtn>
        <BarBtn title="Limpar camada" onClick={studio.clearActiveLayer}>
          <Trash2 size={16} />
        </BarBtn>
        <div className="mx-1 h-5 w-px bg-line" />
        <BarBtn title="Menos zoom" onClick={() => studio.setZoom(Math.max(0.2, studio.zoom * 0.9))}>
          <ZoomOut size={16} />
        </BarBtn>
        <BarBtn title="Mais zoom" onClick={() => studio.setZoom(Math.min(4, studio.zoom * 1.1))}>
          <ZoomIn size={16} />
        </BarBtn>
        <BarBtn title="Salvar" onClick={() => void studio.saveNow()}>
          <Save size={16} />
        </BarBtn>
        <button
          onClick={studio.exportPng}
          className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-bone px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white"
        >
          <Download size={14} />
          Exportar
        </button>
      </div>
    </header>
  )
}

function BarBtn({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  disabled?: boolean
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg text-mist hover:bg-panel hover:text-bone disabled:opacity-30"
    >
      {children}
    </button>
  )
}
