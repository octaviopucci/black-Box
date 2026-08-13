import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { BRUSHES } from '@/lib/brushes'
import { requestAiEdit } from '@/lib/aiClient'
import {
  applyImageToLayer,
  canvasToDataUrl,
  clearCanvas,
  cloneCanvas,
  compositeLayers,
  createCanvas,
  dataUrlToCanvas,
  extractSelection,
  floodFill,
  sampleColor,
  selectionBounds,
  selectionPath,
  smudgeStroke,
  strokePath,
} from '@/lib/canvasOps'
import { uid } from '@/lib/id'
import { loadDocument, saveDocument } from '@/lib/storage'
import type {
  BlendMode,
  BrushId,
  DocumentMeta,
  LayerMeta,
  Point,
  SelectionState,
  ToolId,
} from '@/types'

interface LayerRuntime extends LayerMeta {
  canvas: HTMLCanvasElement
}

interface HistoryEntry {
  layerId: string
  image: ImageData
}

interface StudioState {
  docId: string
  name: string
  width: number
  height: number
  background: string
  layers: LayerMeta[]
  activeLayerId: string
  tool: ToolId
  brushId: BrushId
  color: string
  brushSize: number
  brushOpacity: number
  selection: SelectionState
  zoom: number
  panX: number
  panY: number
  canUndo: boolean
  canRedo: boolean
  aiBusy: boolean
  aiMessage: string | null
  dirty: boolean
}

interface StudioApi extends StudioState {
  engineRef: React.MutableRefObject<{
    layers: Map<string, LayerRuntime>
    view: HTMLCanvasElement | null
  }>
  setTool: (t: ToolId) => void
  setBrushId: (id: BrushId) => void
  setColor: (c: string) => void
  setBrushSize: (n: number) => void
  setBrushOpacity: (n: number) => void
  setZoom: (z: number) => void
  setPan: (x: number, y: number) => void
  setName: (n: string) => void
  attachView: (c: HTMLCanvasElement | null) => void
  redraw: () => void
  pointerDown: (p: Point, buttons: number, shiftKey: boolean) => void
  pointerMove: (p: Point) => void
  pointerUp: () => void
  addLayer: () => void
  deleteLayer: (id: string) => void
  duplicateLayer: (id: string) => void
  setActiveLayer: (id: string) => void
  reorderLayer: (id: string, dir: -1 | 1) => void
  updateLayer: (id: string, patch: Partial<LayerMeta>) => void
  clearActiveLayer: () => void
  undo: () => void
  redo: () => void
  clearSelection: () => void
  selectActiveLayer: () => void
  exportPng: () => void
  saveNow: () => Promise<void>
  runAi: (prompt: string) => Promise<void>
  getCompositeDataUrl: () => string
}

const StudioContext = createContext<StudioApi | null>(null)

const emptySelection = (): SelectionState => ({
  kind: null,
  points: [],
  bounds: null,
  active: false,
})

export function StudioProvider({
  docId,
  children,
}: {
  docId: string
  children: ReactNode
}) {
  const engineRef = useRef({
    layers: new Map<string, LayerRuntime>(),
    view: null as HTMLCanvasElement | null,
  })
  const strokeRef = useRef<Point[]>([])
  const drawingRef = useRef(false)
  const selectStartRef = useRef<Point | null>(null)
  const historyRef = useRef<HistoryEntry[]>([])
  const redoRef = useRef<HistoryEntry[]>([])
  const beforeStrokeRef = useRef<ImageData | null>(null)

  const [name, setName] = useState('Sem título')
  const [width, setWidth] = useState(1280)
  const [height, setHeight] = useState(720)
  const [background, setBackground] = useState('#FFFFFF')
  const [layers, setLayers] = useState<LayerMeta[]>([])
  const [activeLayerId, setActiveLayerId] = useState('')
  const [tool, setTool] = useState<ToolId>('brush')
  const [brushId, setBrushId] = useState<BrushId>('ink')
  const [color, setColor] = useState('#1a1a1a')
  const [brushSize, setBrushSize] = useState(12)
  const [brushOpacity, setBrushOpacity] = useState(1)
  const [selection, setSelection] = useState<SelectionState>(emptySelection)
  const [zoom, setZoom] = useState(0.85)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [ready, setReady] = useState(false)

  const syncHistoryFlags = () => {
    setCanUndo(historyRef.current.length > 0)
    setCanRedo(redoRef.current.length > 0)
  }

  const pushHistory = useCallback((layerId: string) => {
    const layer = engineRef.current.layers.get(layerId)
    if (!layer) return
    const img = layer.canvas.getContext('2d')!.getImageData(0, 0, layer.canvas.width, layer.canvas.height)
    historyRef.current.push({ layerId, image: img })
    if (historyRef.current.length > 40) historyRef.current.shift()
    redoRef.current = []
    syncHistoryFlags()
    setDirty(true)
  }, [])

  const redraw = useCallback(() => {
    const view = engineRef.current.view
    if (!view || !ready) return
    const ordered = layers
      .slice()
      .reverse()
      .map((meta) => {
        const runtime = engineRef.current.layers.get(meta.id)!
        return {
          canvas: runtime.canvas,
          visible: meta.visible,
          opacity: meta.opacity,
          blendMode: meta.blendMode,
        }
      })
    const composed = compositeLayers(width, height, ordered, background)
    const ctx = view.getContext('2d')!
    ctx.clearRect(0, 0, view.width, view.height)
    ctx.drawImage(composed, 0, 0)

    // selection marching ants
    const path = selectionPath(selection)
    if (path && selection.active) {
      ctx.save()
      ctx.strokeStyle = '#FF6B3D'
      ctx.lineWidth = 1.5
      ctx.setLineDash([6, 4])
      ctx.stroke(path)
      ctx.strokeStyle = '#F2EEE6'
      ctx.lineDashOffset = 5
      ctx.stroke(path)
      ctx.restore()
    }
  }, [background, height, layers, ready, selection, width])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const existing = loadDocument(docId)
      engineRef.current.layers.clear()
      historyRef.current = []
      redoRef.current = []

      if (existing) {
        setName(existing.meta.name)
        setWidth(existing.meta.width)
        setHeight(existing.meta.height)
        setBackground(existing.background)
        const metas: LayerMeta[] = []
        for (const layer of existing.layers) {
          const canvas = await dataUrlToCanvas(layer.image, existing.meta.width, existing.meta.height)
          const meta: LayerMeta = {
            id: layer.id,
            name: layer.name,
            visible: layer.visible,
            opacity: layer.opacity,
            blendMode: layer.blendMode,
            locked: layer.locked,
          }
          engineRef.current.layers.set(meta.id, { ...meta, canvas })
          metas.push(meta)
        }
        if (!cancelled) {
          setLayers(metas)
          setActiveLayerId(existing.activeLayerId || metas[0]?.id || '')
        }
      } else {
        const w = 1280
        const h = 720
        const id = uid('layer')
        const canvas = createCanvas(w, h)
        const meta: LayerMeta = {
          id,
          name: 'Camada 1',
          visible: true,
          opacity: 1,
          blendMode: 'source-over',
          locked: false,
        }
        engineRef.current.layers.set(id, { ...meta, canvas })
        if (!cancelled) {
          setWidth(w)
          setHeight(h)
          setBackground('#FFFFFF')
          setName('Sem título')
          setLayers([meta])
          setActiveLayerId(id)
        }
      }
      if (!cancelled) {
        setReady(true)
        setDirty(false)
        syncHistoryFlags()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [docId])

  useEffect(() => {
    redraw()
  }, [redraw])

  const activeLayer = () => engineRef.current.layers.get(activeLayerId)

  const clipToSelection = (ctx: CanvasRenderingContext2D) => {
    const path = selectionPath(selection)
    if (path && selection.active) {
      ctx.save()
      ctx.clip(path)
      return true
    }
    return false
  }

  const pointerDown = (p: Point, buttons: number, _shiftKey: boolean) => {
    if (tool === 'hand' || buttons === 2) {
      drawingRef.current = true
      strokeRef.current = [p]
      return
    }

    const layer = activeLayer()
    if (!layer) return
    const meta = layers.find((l) => l.id === layer.id)
    if (meta?.locked) return

    if (tool === 'eyedropper') {
      const composed = getCompositeCanvas()
      setColor(sampleColor(composed, p.x, p.y))
      return
    }

    if (tool === 'lasso' || tool === 'rect' || tool === 'ellipse') {
      drawingRef.current = true
      selectStartRef.current = p
      setSelection({
        kind: tool,
        points: [p],
        bounds: tool === 'lasso' ? null : { x: p.x, y: p.y, w: 0, h: 0 },
        active: true,
      })
      return
    }

    if (tool === 'fill') {
      pushHistory(layer.id)
      const ctx = layer.canvas.getContext('2d')!
      const clipped = clipToSelection(ctx)
      floodFill(layer.canvas, p.x, p.y, color)
      if (clipped) ctx.restore()
      redraw()
      return
    }

    if (tool === 'brush' || tool === 'eraser' || tool === 'smudge') {
      drawingRef.current = true
      strokeRef.current = [p]
      beforeStrokeRef.current = layer.canvas
        .getContext('2d')!
        .getImageData(0, 0, layer.canvas.width, layer.canvas.height)
      return
    }
  }

  const pointerMove = (p: Point) => {
    if (!drawingRef.current) return

    if (tool === 'hand') {
      const prev = strokeRef.current[0]
      if (prev) {
        setPanX((x) => x + (p.x - prev.x) * zoom)
        setPanY((y) => y + (p.y - prev.y) * zoom)
        strokeRef.current = [p]
      }
      return
    }

    if (tool === 'lasso') {
      setSelection((s) => ({ ...s, points: [...s.points, p], active: true, kind: 'lasso' }))
      return
    }
    if (tool === 'rect' || tool === 'ellipse') {
      const start = selectStartRef.current
      if (!start) return
      setSelection({
        kind: tool,
        points: [start, p],
        bounds: { x: start.x, y: start.y, w: p.x - start.x, h: p.y - start.y },
        active: true,
      })
      return
    }

    const layer = activeLayer()
    if (!layer) return
    strokeRef.current.push(p)
    const pts = strokeRef.current.slice(-3)
    const brush = { ...BRUSHES[brushId], size: brushSize, opacity: brushOpacity }
    const ctx = layer.canvas.getContext('2d')!
    const clipped = clipToSelection(ctx)

    if (tool === 'smudge') {
      smudgeStroke(layer.canvas, pts, brushSize, 0.4)
    } else if (tool === 'brush' || tool === 'eraser') {
      strokePath(ctx, pts, brush, color, 1, 1, tool === 'eraser')
    }
    if (clipped) ctx.restore()
    // keep last point as anchor for spacing continuity
    strokeRef.current = [strokeRef.current[strokeRef.current.length - 1]]
    redraw()
  }

  const pointerUp = () => {
    if (!drawingRef.current) return
    drawingRef.current = false

    if (tool === 'brush' || tool === 'eraser' || tool === 'smudge') {
      const layer = activeLayer()
      if (layer && beforeStrokeRef.current) {
        historyRef.current.push({ layerId: layer.id, image: beforeStrokeRef.current })
        if (historyRef.current.length > 40) historyRef.current.shift()
        redoRef.current = []
        syncHistoryFlags()
        setDirty(true)
      }
      beforeStrokeRef.current = null
      strokeRef.current = []
    }

    if (tool === 'lasso' || tool === 'rect' || tool === 'ellipse') {
      setSelection((s) => {
        if (s.kind === 'lasso' && s.points.length < 3) return emptySelection()
        const b = selectionBounds(s)
        if (b && (b.w < 2 || b.h < 2)) return emptySelection()
        return { ...s, active: true }
      })
    }
    selectStartRef.current = null
    redraw()
  }

  const getCompositeCanvas = () => {
    const ordered = layers
      .slice()
      .reverse()
      .map((meta) => {
        const runtime = engineRef.current.layers.get(meta.id)!
        return {
          canvas: runtime.canvas,
          visible: meta.visible,
          opacity: meta.opacity,
          blendMode: meta.blendMode,
        }
      })
    return compositeLayers(width, height, ordered, background)
  }

  const getCompositeDataUrl = () => canvasToDataUrl(getCompositeCanvas())

  const addLayer = () => {
    const id = uid('layer')
    const canvas = createCanvas(width, height)
    const meta: LayerMeta = {
      id,
      name: `Camada ${layers.length + 1}`,
      visible: true,
      opacity: 1,
      blendMode: 'source-over',
      locked: false,
    }
    engineRef.current.layers.set(id, { ...meta, canvas })
    setLayers((prev) => [meta, ...prev])
    setActiveLayerId(id)
    setDirty(true)
  }

  const deleteLayer = (id: string) => {
    if (layers.length <= 1) return
    engineRef.current.layers.delete(id)
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id)
      if (activeLayerId === id) setActiveLayerId(next[0]?.id || '')
      return next
    })
    setDirty(true)
  }

  const duplicateLayer = (id: string) => {
    const src = engineRef.current.layers.get(id)
    const meta = layers.find((l) => l.id === id)
    if (!src || !meta) return
    const newId = uid('layer')
    const canvas = cloneCanvas(src.canvas)
    const copy: LayerMeta = { ...meta, id: newId, name: `${meta.name} cópia` }
    engineRef.current.layers.set(newId, { ...copy, canvas })
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id)
      const next = [...prev]
      next.splice(idx, 0, copy)
      return next
    })
    setActiveLayerId(newId)
    setDirty(true)
  }

  const reorderLayer = (id: string, dir: -1 | 1) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id)
      const target = idx + dir
      if (idx < 0 || target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.splice(target, 0, item)
      return next
    })
    setDirty(true)
  }

  const updateLayer = (id: string, patch: Partial<LayerMeta>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
    const runtime = engineRef.current.layers.get(id)
    if (runtime) Object.assign(runtime, patch)
    setDirty(true)
  }

  const clearActiveLayer = () => {
    const layer = activeLayer()
    if (!layer) return
    pushHistory(layer.id)
    clearCanvas(layer.canvas)
    redraw()
  }

  const undo = () => {
    const entry = historyRef.current.pop()
    if (!entry) return
    const layer = engineRef.current.layers.get(entry.layerId)
    if (!layer) return
    const current = layer.canvas.getContext('2d')!.getImageData(0, 0, width, height)
    redoRef.current.push({ layerId: entry.layerId, image: current })
    layer.canvas.getContext('2d')!.putImageData(entry.image, 0, 0)
    syncHistoryFlags()
    setDirty(true)
    redraw()
  }

  const redo = () => {
    const entry = redoRef.current.pop()
    if (!entry) return
    const layer = engineRef.current.layers.get(entry.layerId)
    if (!layer) return
    const current = layer.canvas.getContext('2d')!.getImageData(0, 0, width, height)
    historyRef.current.push({ layerId: entry.layerId, image: current })
    layer.canvas.getContext('2d')!.putImageData(entry.image, 0, 0)
    syncHistoryFlags()
    setDirty(true)
    redraw()
  }

  const clearSelection = () => setSelection(emptySelection())

  const selectActiveLayer = () => {
    setSelection({
      kind: 'layer',
      points: [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height },
      ],
      bounds: { x: 0, y: 0, w: width, h: height },
      active: true,
    })
  }

  const exportPng = () => {
    const url = getCompositeDataUrl()
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/\s+/g, '-').toLowerCase() || 'traco'}.png`
    a.click()
  }

  const saveNow = async () => {
    const persistedLayers = []
    for (const meta of layers) {
      const runtime = engineRef.current.layers.get(meta.id)
      if (!runtime) continue
      persistedLayers.push({
        ...meta,
        image: canvasToDataUrl(runtime.canvas),
      })
    }
    const thumb = getCompositeDataUrl()
    const meta: DocumentMeta = {
      id: docId,
      name,
      width,
      height,
      updatedAt: Date.now(),
      thumbnail: thumb,
    }
    saveDocument({
      meta,
      layers: persistedLayers,
      activeLayerId,
      background,
    })
    setDirty(false)
  }

  const runAi = async (prompt: string) => {
    const layer = activeLayer()
    if (!layer || !prompt.trim()) return
    const meta = layers.find((l) => l.id === layer.id)
    if (meta?.locked) {
      setAiMessage('Camada bloqueada.')
      return
    }

    setAiBusy(true)
    setAiMessage('IA trabalhando na seleção…')
    try {
      let imageDataUrl: string
      let maskDataUrl: string | null = null
      let bounds = { x: 0, y: 0, w: width, h: height }
      let mode: 'selection' | 'layer' | 'canvas' = 'layer'

      if (selection.active && selection.kind !== 'layer') {
        const extracted = extractSelection(layer.canvas, selection)
        if (!extracted) {
          setAiMessage('Seleção inválida.')
          setAiBusy(false)
          return
        }
        imageDataUrl = canvasToDataUrl(extracted.image)
        maskDataUrl = canvasToDataUrl(extracted.mask)
        bounds = extracted.bounds
        mode = 'selection'
      } else {
        imageDataUrl = canvasToDataUrl(layer.canvas)
        mode = selection.kind === 'layer' ? 'layer' : 'canvas'
      }

      const result = await requestAiEdit({
        prompt,
        imageDataUrl,
        maskDataUrl,
        mode,
      })

      if (!result.ok || !result.imageDataUrl) {
        setAiMessage(result.message || 'Falha na IA')
        setAiBusy(false)
        return
      }

      pushHistory(layer.id)
      const resultCanvas = await dataUrlToCanvas(result.imageDataUrl)
      if (mode === 'selection') {
        const extracted = extractSelection(layer.canvas, selection)
        applyImageToLayer(layer.canvas, resultCanvas, bounds, extracted?.mask ?? null, true)
      } else {
        clearCanvas(layer.canvas)
        layer.canvas.getContext('2d')!.drawImage(resultCanvas, 0, 0, width, height)
      }
      redraw()
      setAiMessage(result.message || `IA (${result.mode || 'demo'}) aplicada.`)
    } catch (e) {
      setAiMessage(e instanceof Error ? e.message : 'Erro na IA')
    } finally {
      setAiBusy(false)
    }
  }

  const attachView = (c: HTMLCanvasElement | null) => {
    engineRef.current.view = c
    if (c) {
      c.width = width
      c.height = height
      redraw()
    }
  }

  useEffect(() => {
    const view = engineRef.current.view
    if (view) {
      view.width = width
      view.height = height
      redraw()
    }
  }, [width, height, redraw])

  // autosave
  useEffect(() => {
    if (!ready || !dirty) return
    const t = window.setTimeout(() => {
      void saveNow()
    }, 1200)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, layers, name, ready])

  const api = useMemo<StudioApi>(
    () => ({
      docId,
      name,
      width,
      height,
      background,
      layers,
      activeLayerId,
      tool,
      brushId,
      color,
      brushSize,
      brushOpacity,
      selection,
      zoom,
      panX,
      panY,
      canUndo,
      canRedo,
      aiBusy,
      aiMessage,
      dirty,
      engineRef,
      setTool,
      setBrushId,
      setColor,
      setBrushSize,
      setBrushOpacity,
      setZoom,
      setPan: (x, y) => {
        setPanX(x)
        setPanY(y)
      },
      setName,
      attachView,
      redraw,
      pointerDown,
      pointerMove,
      pointerUp,
      addLayer,
      deleteLayer,
      duplicateLayer,
      setActiveLayer: setActiveLayerId,
      reorderLayer,
      updateLayer,
      clearActiveLayer,
      undo,
      redo,
      clearSelection,
      selectActiveLayer,
      exportPng,
      saveNow,
      runAi,
      getCompositeDataUrl,
    }),
    // intentional broad deps for studio surface
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      docId,
      name,
      width,
      height,
      background,
      layers,
      activeLayerId,
      tool,
      brushId,
      color,
      brushSize,
      brushOpacity,
      selection,
      zoom,
      panX,
      panY,
      canUndo,
      canRedo,
      aiBusy,
      aiMessage,
      dirty,
      ready,
    ],
  )

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-mist">
        Preparando tela…
      </div>
    )
  }

  return <StudioContext.Provider value={api}>{children}</StudioContext.Provider>
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio fora do provider')
  return ctx
}

export function createBlankDocMeta(): DocumentMeta {
  return {
    id: uid('doc'),
    name: 'Sem título',
    width: 1280,
    height: 720,
    updatedAt: Date.now(),
    thumbnail: '',
  }
}

export type { BlendMode }
