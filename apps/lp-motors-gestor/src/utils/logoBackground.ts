/** Remove fundo sólido/claro de logos via canvas — ideal para PNG/JPG com fundo branco ou colorido uniforme. */

function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2)
}

function sampleRect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  size: number,
): { r: number; g: number; b: number; transparent: number } {
  let r = 0
  let g = 0
  let b = 0
  let transparent = 0
  let n = 0
  for (let y = y0; y < y0 + size && y < height; y++) {
    for (let x = x0; x < x0 + size && x < width; x++) {
      const i = (y * width + x) * 4
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      if (data[i + 3] < 200) transparent++
      n++
    }
  }
  if (!n) return { r: 255, g: 255, b: 255, transparent: 0 }
  return { r: r / n, g: g / n, b: b / n, transparent: transparent / n }
}

function detectBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): { r: number; g: number; b: number } | null {
  const patch = Math.max(4, Math.min(12, Math.floor(Math.min(width, height) * 0.04)))
  const corners = [
    sampleRect(data, width, height, 0, 0, patch),
    sampleRect(data, width, height, width - patch, 0, patch),
    sampleRect(data, width, height, 0, height - patch, patch),
    sampleRect(data, width, height, width - patch, height - patch, patch),
  ]

  const avgTransparent = corners.reduce((s, c) => s + c.transparent, 0) / corners.length
  if (avgTransparent > 0.35) return null

  const r = corners.reduce((s, c) => s + c.r, 0) / 4
  const g = corners.reduce((s, c) => s + c.g, 0) / 4
  const b = corners.reduce((s, c) => s + c.b, 0) / 4
  return { r, g, b }
}

export type LogoBackgroundOptions = {
  tolerance?: number
  feather?: number
  maxDimension?: number
}

/**
 * Torna transparente pixels próximos à cor de fundo detectada nas bordas.
 * Retorna PNG data URL. SVG e imagens já transparentes são devolvidas sem alteração.
 */
export async function removeLogoBackground(
  dataUrl: string,
  opts: LogoBackgroundOptions = {},
): Promise<string> {
  const tolerance = opts.tolerance ?? 48
  const feather = opts.feather ?? 14
  const maxDimension = opts.maxDimension ?? 1024

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      let { width, height } = img
      const scale = Math.min(1, maxDimension / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas indisponível.'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const bg = detectBackground(imageData.data, width, height)
      if (!bg) {
        resolve(dataUrl)
        return
      }

      const { data } = imageData
      for (let i = 0; i < data.length; i += 4) {
        const dist = colorDist(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b)
        if (dist <= tolerance) {
          data[i + 3] = 0
        } else if (dist <= tolerance + feather) {
          const t = (dist - tolerance) / feather
          data[i + 3] = Math.round(data[i + 3] * t)
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Não foi possível processar a imagem.'))
    img.src = dataUrl
  })
}
