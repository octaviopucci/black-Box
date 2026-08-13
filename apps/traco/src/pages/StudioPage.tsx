import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AiPanel } from '@/components/studio/AiPanel'
import { BrushDock } from '@/components/studio/BrushDock'
import { CanvasStage } from '@/components/studio/CanvasStage'
import { LayersPanel } from '@/components/studio/LayersPanel'
import { Toolbar } from '@/components/studio/Toolbar'
import { TopBar } from '@/components/studio/TopBar'
import { StudioProvider } from '@/store/StudioContext'

export function StudioPage() {
  const { docId = '' } = useParams()
  if (!docId) return <div className="p-8 text-mist">Documento inválido</div>

  return (
    <StudioProvider docId={docId}>
      <StudioShell />
    </StudioProvider>
  )
}

function StudioShell() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-ink">
      <TopBar />
      <div className="relative flex min-h-0 flex-1">
        <Toolbar onOpenAi={() => setAiOpen(true)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <CanvasStage />
          <BrushDock />
        </div>
        <LayersPanel />
        <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
    </div>
  )
}
