/**
 * Server-side demo image edit when no OpenAI key is configured.
 * Applies prompt-driven pixel effects to a PNG/JPEG data URL.
 */

type Effect =
  | 'warm'
  | 'cool'
  | 'invert'
  | 'blur'
  | 'sketch'
  | 'glow'
  | 'remove'
  | 'saturate'
  | 'noir'
  | 'ember'
  | 'jade'
  | 'recolor'

export async function demoEdit(
  imageDataUrl: string,
  prompt: string,
): Promise<{ imageDataUrl: string; effect: string }> {
  // Prefer canvas via pure buffer math — no native deps.
  // Decode PNG/JPEG with built-in fetch + createImageBitmap if available,
  // otherwise return original with metadata (client has local fallback).
  const effect = pickEffect(prompt)

  if (typeof createImageBitmap === 'function' && typeof OffscreenCanvas !== 'undefined') {
    try {
      const blob = dataUrlToBlob(imageDataUrl)
      const bmp = await createImageBitmap(blob)
      const canvas = new OffscreenCanvas(bmp.width, bmp.height)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bmp, 0, 0)
      applyEffect(ctx, bmp.width, bmp.height, effect, prompt)
      const out = await canvas.convertToBlob({ type: 'image/png' })
      const buf = Buffer.from(await out.arrayBuffer())
      return {
        imageDataUrl: `data:image/png;base64,${buf.toString('base64')}`,
        effect,
      }
    } catch {
      // fall through
    }
  }

  // Minimal fallback: return original; client local AI will still run if needed.
  return { imageDataUrl, effect }
}

function pickEffect(prompt: string): Effect {
  const p = prompt.toLowerCase()
  if (/(remov|apag|limp|delet|erase|clear)/.test(p)) return 'remove'
  if (/(desfoc|blur|suav)/.test(p)) return 'blur'
  if (/(esbo[cç]o|sketch|linha|contorno)/.test(p)) return 'sketch'
  if (/(brilho|glow|neon|luz)/.test(p)) return 'glow'
  if (/(invert|negativo)/.test(p)) return 'invert'
  if (/(quente|warm|sunset|laranja)/.test(p)) return 'warm'
  if (/(frio|cool|azul|blue|gelo)/.test(p)) return 'cool'
  if (/(pb|preto.?e.?branco|noir|mono)/.test(p)) return 'noir'
  if (/(satura|vibran|viva)/.test(p)) return 'saturate'
  if (/(verde|jade|floresta)/.test(p)) return 'jade'
  if (/(fogo|ember|vermelho|magm)/.test(p)) return 'ember'
  return 'recolor'
}

function applyEffect(
  ctx: OffscreenCanvasRenderingContext2D,
  w: number,
  h: number,
  effect: Effect,
  prompt: string,
) {
  if (effect === 'remove') {
    ctx.clearRect(0, 0, w, h)
    return
  }
  if (effect === 'blur') {
    ctx.filter = 'blur(3px)'
    const snap = ctx.getImageData(0, 0, w, h)
    const tmp = new OffscreenCanvas(w, h)
    tmp.getContext('2d')!.putImageData(snap, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(tmp, 0, 0)
    ctx.filter = 'none'
    return
  }

  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const hue = hashHue(prompt)
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i]
    let g = d[i + 1]
    let b = d[i + 2]
    const a = d[i + 3]
    if (a < 8) continue

    if (effect === 'invert') {
      r = 255 - r
      g = 255 - g
      b = 255 - b
    } else if (effect === 'warm') {
      r = clamp(r + 28)
      g = clamp(g + 8)
      b = clamp(b - 18)
    } else if (effect === 'cool') {
      r = clamp(r - 16)
      g = clamp(g + 4)
      b = clamp(b + 30)
    } else if (effect === 'noir') {
      const y = 0.299 * r + 0.587 * g + 0.114 * b
      r = g = b = y
    } else if (effect === 'saturate') {
      const y = 0.299 * r + 0.587 * g + 0.114 * b
      r = clamp(y + (r - y) * 1.7)
      g = clamp(y + (g - y) * 1.7)
      b = clamp(y + (b - y) * 1.7)
    } else if (effect === 'ember') {
      r = clamp(r * 1.25 + 20)
      g = clamp(g * 0.75)
      b = clamp(b * 0.45)
    } else if (effect === 'jade') {
      r = clamp(r * 0.55)
      g = clamp(g * 1.2 + 10)
      b = clamp(b * 0.85 + 8)
    } else if (effect === 'recolor' || effect === 'glow') {
      const mix = effect === 'glow' ? 0.35 : 0.55
      const c = hslToRgb(hue, 0.7, 0.55)
      r = clamp(r * (1 - mix) + c.r * mix)
      g = clamp(g * (1 - mix) + c.g * mix)
      b = clamp(b * (1 - mix) + c.b * mix)
    } else if (effect === 'sketch') {
      const y = 0.299 * r + 0.587 * g + 0.114 * b
      const v = y > 140 ? 255 : y < 70 ? 20 : y
      r = g = b = v
    }
    d[i] = r
    d[i + 1] = g
    d[i + 2] = b
  }
  ctx.putImageData(img, 0, 0)
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(',')
  const mime = /data:(.*);base64/.exec(header)?.[1] || 'image/png'
  const bin = Buffer.from(b64, 'base64')
  return new Blob([bin], { type: mime })
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function hashHue(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h % 360
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}
