import type { BlendMode, BrushPreset, Point, SelectionState } from '@/types'

export function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export function clearCanvas(c: HTMLCanvasElement, color?: string) {
  const ctx = c.getContext('2d')!
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  if (color) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = color
    ctx.fillRect(0, 0, c.width, c.height)
  } else {
    ctx.clearRect(0, 0, c.width, c.height)
  }
  ctx.restore()
}

export function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const c = createCanvas(source.width, source.height)
  c.getContext('2d')!.drawImage(source, 0, 0)
  return c
}

export function canvasToDataUrl(c: HTMLCanvasElement, type = 'image/png'): string {
  return c.toDataURL(type)
}

export async function dataUrlToCanvas(dataUrl: string, w?: number, h?: number): Promise<HTMLCanvasElement> {
  const img = await loadImage(dataUrl)
  const c = createCanvas(w ?? img.naturalWidth, h ?? img.naturalHeight)
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
  return c
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function dist(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

export function stampBrush(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
  opacity: number,
  hardness: number,
  erase = false,
) {
  const r = Math.max(0.5, size / 2)
  const g = ctx.createRadialGradient(x, y, r * hardness, x, y, r)
  const alpha = Math.max(0, Math.min(1, opacity))
  if (erase) {
    ctx.globalCompositeOperation = 'destination-out'
    g.addColorStop(0, `rgba(0,0,0,${alpha})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
  } else {
    ctx.globalCompositeOperation = 'source-over'
    const rgb = hexToRgb(color)
    g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`)
    g.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`)
  }
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

export function strokePath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  brush: BrushPreset,
  color: string,
  sizeMul: number,
  opacityMul: number,
  erase = false,
) {
  if (points.length === 0) return
  const spacing = Math.max(0.5, brush.size * sizeMul * brush.spacing)
  let prev = points[0]
  paintAt(ctx, prev, brush, color, sizeMul, opacityMul, erase)

  for (let i = 1; i < points.length; i++) {
    const cur = points[i]
    const d = dist(prev, cur)
    if (d < spacing) continue
    const steps = Math.floor(d / spacing)
    for (let s = 1; s <= steps; s++) {
      const t = s / steps
      const p: Point = {
        x: prev.x + (cur.x - prev.x) * t,
        y: prev.y + (cur.y - prev.y) * t,
        pressure: lerp(prev.pressure ?? 0.7, cur.pressure ?? 0.7, t),
      }
      paintAt(ctx, p, brush, color, sizeMul, opacityMul, erase)
    }
    prev = cur
  }
}

function paintAt(
  ctx: CanvasRenderingContext2D,
  p: Point,
  brush: BrushPreset,
  color: string,
  sizeMul: number,
  opacityMul: number,
  erase: boolean,
) {
  const pressure = p.pressure ?? 0.7
  const size =
    brush.size * sizeMul * (brush.pressureSize ? 0.35 + pressure * 0.9 : 1)
  const opacity =
    brush.opacity *
    opacityMul *
    brush.flow *
    (brush.pressureOpacity ? 0.25 + pressure * 0.9 : 1)
  stampBrush(ctx, p.x, p.y, color, size, opacity, brush.hardness, erase)
}

export function smudgeStroke(
  layer: HTMLCanvasElement,
  points: Point[],
  size: number,
  strength = 0.35,
) {
  if (points.length < 2) return
  const ctx = layer.getContext('2d')!
  const r = Math.max(2, size / 2)
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const sample = ctx.getImageData(
      Math.max(0, Math.round(a.x - r)),
      Math.max(0, Math.round(a.y - r)),
      Math.min(layer.width, Math.round(r * 2)),
      Math.min(layer.height, Math.round(r * 2)),
    )
    const tmp = createCanvas(sample.width, sample.height)
    tmp.getContext('2d')!.putImageData(sample, 0, 0)
    ctx.save()
    ctx.globalAlpha = strength
    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(tmp, b.x - r, b.y - r)
    ctx.restore()
  }
}

export function floodFill(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  fillColor: string,
  tolerance = 32,
) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const { width, height } = canvas
  const img = ctx.getImageData(0, 0, width, height)
  const data = img.data
  const sx = Math.floor(x)
  const sy = Math.floor(y)
  if (sx < 0 || sy < 0 || sx >= width || sy >= height) return

  const start = (sy * width + sx) * 4
  const tr = data[start]
  const tg = data[start + 1]
  const tb = data[start + 2]
  const ta = data[start + 3]
  const fill = hexToRgb(fillColor)
  if (colorClose(tr, tg, tb, ta, fill.r, fill.g, fill.b, 255, 0)) return

  const stack: number[] = [sx, sy]
  const visited = new Uint8Array(width * height)

  while (stack.length) {
    const cy = stack.pop()!
    const cx = stack.pop()!
    const idx = cy * width + cx
    if (visited[idx]) continue
    visited[idx] = 1
    const i = idx * 4
    if (!colorClose(data[i], data[i + 1], data[i + 2], data[i + 3], tr, tg, tb, ta, tolerance)) {
      continue
    }
    data[i] = fill.r
    data[i + 1] = fill.g
    data[i + 2] = fill.b
    data[i + 3] = 255
    if (cx > 0) stack.push(cx - 1, cy)
    if (cx < width - 1) stack.push(cx + 1, cy)
    if (cy > 0) stack.push(cx, cy - 1)
    if (cy < height - 1) stack.push(cx, cy + 1)
  }
  ctx.putImageData(img, 0, 0)
}

export function sampleColor(canvas: HTMLCanvasElement, x: number, y: number): string {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const px = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
  return rgbToHex(px[0], px[1], px[2])
}

export function compositeLayers(
  width: number,
  height: number,
  layers: Array<{
    canvas: HTMLCanvasElement
    visible: boolean
    opacity: number
    blendMode: BlendMode
  }>,
  background = '#FFFFFF',
): HTMLCanvasElement {
  const out = createCanvas(width, height)
  const ctx = out.getContext('2d')!
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)
  for (const layer of layers) {
    if (!layer.visible) continue
    ctx.save()
    ctx.globalAlpha = layer.opacity
    ctx.globalCompositeOperation = layer.blendMode
    ctx.drawImage(layer.canvas, 0, 0)
    ctx.restore()
  }
  return out
}

export function selectionPath(sel: SelectionState): Path2D | null {
  if (!sel.active) return null
  const path = new Path2D()
  if (sel.kind === 'lasso' && sel.points.length > 2) {
    path.moveTo(sel.points[0].x, sel.points[0].y)
    for (let i = 1; i < sel.points.length; i++) {
      path.lineTo(sel.points[i].x, sel.points[i].y)
    }
    path.closePath()
    return path
  }
  if ((sel.kind === 'rect' || sel.kind === 'ellipse') && sel.bounds) {
    const { x, y, w, h } = sel.bounds
    if (sel.kind === 'rect') path.rect(x, y, w, h)
    else path.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2)
    return path
  }
  return null
}

export function selectionBounds(sel: SelectionState): { x: number; y: number; w: number; h: number } | null {
  if (sel.bounds) {
    const { x, y, w, h } = sel.bounds
    return {
      x: Math.min(x, x + w),
      y: Math.min(y, y + h),
      w: Math.abs(w),
      h: Math.abs(h),
    }
  }
  if (sel.points.length < 2) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of sel.points) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

export function extractSelection(
  layer: HTMLCanvasElement,
  sel: SelectionState,
): { image: HTMLCanvasElement; mask: HTMLCanvasElement; bounds: { x: number; y: number; w: number; h: number } } | null {
  const bounds = selectionBounds(sel)
  const path = selectionPath(sel)
  if (!bounds || !path || bounds.w < 1 || bounds.h < 1) return null

  const image = createCanvas(Math.ceil(bounds.w), Math.ceil(bounds.h))
  const mask = createCanvas(Math.ceil(bounds.w), Math.ceil(bounds.h))
  const ictx = image.getContext('2d')!
  const mctx = mask.getContext('2d')!

  mctx.fillStyle = '#000'
  mctx.fillRect(0, 0, mask.width, mask.height)
  mctx.save()
  mctx.translate(-bounds.x, -bounds.y)
  mctx.fillStyle = '#fff'
  mctx.fill(path)
  mctx.restore()

  ictx.drawImage(
    layer,
    bounds.x,
    bounds.y,
    bounds.w,
    bounds.h,
    0,
    0,
    bounds.w,
    bounds.h,
  )
  ictx.globalCompositeOperation = 'destination-in'
  ictx.drawImage(mask, 0, 0)

  return { image, mask, bounds }
}

export function applyImageToLayer(
  layer: HTMLCanvasElement,
  image: HTMLCanvasElement | HTMLImageElement,
  bounds: { x: number; y: number; w: number; h: number },
  mask?: HTMLCanvasElement | null,
  replace = true,
) {
  const ctx = layer.getContext('2d')!
  ctx.save()
  if (mask) {
    const clip = createCanvas(layer.width, layer.height)
    const cctx = clip.getContext('2d')!
    cctx.drawImage(mask, bounds.x, bounds.y, bounds.w, bounds.h)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.drawImage(clip, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
  } else if (replace) {
    ctx.clearRect(bounds.x, bounds.y, bounds.w, bounds.h)
  }
  ctx.drawImage(image, bounds.x, bounds.y, bounds.w, bounds.h)
  ctx.restore()
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  )
}

function colorClose(
  r1: number,
  g1: number,
  b1: number,
  a1: number,
  r2: number,
  g2: number,
  b2: number,
  a2: number,
  tol: number,
) {
  return (
    Math.abs(r1 - r2) <= tol &&
    Math.abs(g1 - g2) <= tol &&
    Math.abs(b1 - b2) <= tol &&
    Math.abs(a1 - a2) <= tol
  )
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
