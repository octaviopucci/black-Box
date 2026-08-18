export type ToolId =
  | 'brush'
  | 'eraser'
  | 'smudge'
  | 'fill'
  | 'eyedropper'
  | 'lasso'
  | 'rect'
  | 'ellipse'
  | 'move'
  | 'hand'

export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'soft-light'
  | 'hard-light'
  | 'difference'
  | 'exclusion'

export type BrushId =
  | 'ink'
  | 'pencil'
  | 'soft'
  | 'airbrush'
  | 'marker'
  | 'watercolor'
  | 'charcoal'
  | 'pixel'

export interface BrushPreset {
  id: BrushId
  name: string
  size: number
  opacity: number
  hardness: number
  spacing: number
  flow: number
  pressureSize: boolean
  pressureOpacity: boolean
}

export interface LayerMeta {
  id: string
  name: string
  visible: boolean
  opacity: number
  blendMode: BlendMode
  locked: boolean
}

export interface Point {
  x: number
  y: number
  pressure?: number
}

export type SelectionKind = 'lasso' | 'rect' | 'ellipse' | 'layer' | null

export interface SelectionState {
  kind: SelectionKind
  points: Point[]
  bounds: { x: number; y: number; w: number; h: number } | null
  active: boolean
}

export interface DocumentMeta {
  id: string
  name: string
  width: number
  height: number
  updatedAt: number
  thumbnail: string
}

export interface PersistedDocument {
  meta: DocumentMeta
  layers: Array<LayerMeta & { image: string }>
  activeLayerId: string
  background: string
}

export interface AiEditRequest {
  prompt: string
  imageDataUrl: string
  maskDataUrl?: string | null
  mode: 'selection' | 'layer' | 'canvas'
}

export interface AiEditResponse {
  ok: boolean
  imageDataUrl?: string
  mode?: 'live' | 'demo'
  message?: string
  effect?: string
}
