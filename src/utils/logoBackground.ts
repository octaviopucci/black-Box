/** Remove fundo sólido de logos — flood-fill a partir das bordas (só apaga o que toca a borda). */

function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2)
}

type Rgb = { r: number; g: number; b: number; a: number }

function getPixel(data: Uint8ClampedArray, width: number, x: number, y: number): Rgb {
  const i = (y * width + x) * 4
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
}

/** Cor dominante na borda da imagem (fundo da logo). */
function detectBorderBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): { r: number; g: number; b: number } | null {
  const samples: Rgb[] = []

  for (let x = 0; x < width; x++) {
    samples.push(getPixel(data, width, x, 0))
    samples.push(getPixel(data, width, x, height - 1))
  }
  for (let y = 1; y < height - 1; y++) {
    samples.push(getPixel(data, width, 0, y))
    samples.push(getPixel(data, width, width - 1, y))
  }

  const transparent = samples.filter((s) => s.a < 128).length / samples.length
  if (transparent > 0.45) return null

  const opaque = samples.filter((s) => s.a >= 128)
  if (!opaque.length) return null

  const r = opaque.reduce((s, p) => s + p.r, 0) / opaque.length
  const g = opaque.reduce((s, p) => s + p.g, 0) / opaque.length
  const b = opaque.reduce((s, p) => s + p.b, 0) / opaque.length
  return { r, g, b }
}

function isBackgroundPixel(
  data: Uint8ClampedArray,
  i: number,
  bg: { r: number; g: number; b: number },
  tolerance: number,
): boolean {
  if (data[i + 3] < 10) return true
  return colorDist(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b) <= tolerance
}

/** Flood-fill: remove só pixels de fundo conectados à borda (preserva branco interno da logo). */
function floodRemoveBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  bg: { r: number; g: number; b: number },
  tolerance: number,
): number {
  const total = width * height
  const visited = new Uint8Array(total)
  const stack: number[] = []

  const tryPush = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const idx = y * width + x
    if (visited[idx]) return
    const i = idx * 4
    if (!isBackgroundPixel(data, i, bg, tolerance)) return
    stack.push(idx)
  }

  for (let x = 0; x < width; x++) {
    tryPush(x, 0)
    tryPush(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y)
    tryPush(width - 1, y)
  }

  let removed = 0
  while (stack.length) {
    const idx = stack.pop()!
    if (visited[idx]) continue
    visited[idx] = 1
    const i = idx * 4
    data[i + 3] = 0
    removed++

    const x = idx % width
    const y = Math.floor(idx / width)
    tryPush(x + 1, y)
    tryPush(x - 1, y)
    tryPush(x, y + 1)
    tryPush(x, y - 1)
  }

  return removed
}

/** Suaviza borda entre transparente e opaco. */
function featherEdges(data: Uint8ClampedArray, width: number, height: number, radius: number): void {
  const alphas = new Uint8ClampedArray(width * height)
  for (let idx = 0; idx < width * height; idx++) {
    alphas[idx] = data[idx * 4 + 3]
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const i = idx * 4
      if (alphas[idx] !== 0) continue

      let nearOpaque = 0
      let samples = 0
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          samples++
          if (alphas[ny * width + nx] > 200) nearOpaque++
        }
      }
      if (nearOpaque > 0 && samples > 0) {
        const blend = 1 - nearOpaque / samples
        data[i + 3] = Math.round(blend * 180)
      }
    }
  }
}

export type LogoBackgroundOptions = {
  tolerance?: number
  maxDimension?: number
}

export type LogoBackgroundResult = {
  dataUrl: string
  removed: boolean
}

/**
 * Remove fundo sólido e devolve PNG transparente.
 * Usa flood-fill a partir das bordas — funciona com fundo branco, preto ou colorido uniforme.
 */
export async function removeLogoBackground(
  dataUrl: string,
  opts: LogoBackgroundOptions = {},
): Promise<LogoBackgroundResult> {
  const maxDimension = opts.maxDimension ?? 1200

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      const scale = Math.min(1, maxDimension / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        reject(new Error('Canvas indisponível.'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const { data } = imageData

      let bg = detectBorderBackground(data, width, height)

      // Fallback: fundo claro típico de logos
      if (!bg) {
        const lum =
          (getPixel(data, width, 0, 0).r +
            getPixel(data, width, width - 1, 0).r +
            getPixel(data, width, 0, height - 1).r) /
          3
        if (lum > 200) bg = { r: 255, g: 255, b: 255 }
      }

      if (!bg) {
        resolve({ dataUrl, removed: false })
        return
      }

      const tolerances = [opts.tolerance ?? 52, 68, 85]
      const totalPixels = width * height
      let removed = 0
      for (const tol of tolerances) {
        removed = floodRemoveBackground(data, width, height, bg, tol)
        if (removed > totalPixels * 0.02) break
      }

      if (removed < totalPixels * 0.01) {
        resolve({ dataUrl, removed: false })
        return
      }

      featherEdges(data, width, height, 2)
      ctx.putImageData(imageData, 0, 0)
      resolve({ dataUrl: canvas.toDataURL('image/png'), removed: true })
    }
    img.onerror = () => reject(new Error('Não foi possível processar a imagem.'))
    img.src = dataUrl
  })
}
