const DEFAULT_MAX_EDGE = 1280
const DEFAULT_QUALITY = 0.72
const MAX_OUTPUT_CHARS = 450_000 // ~330KB base64 — seguro para várias fotos no localStorage

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Não foi possível ler a imagem'))
    img.src = src
  })
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'))
    reader.readAsDataURL(file)
  })
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * Redimensiona e comprime a imagem para caber no localStorage do navegador.
 * Fotos de celular em resolução nativa estouram a cota e o cadastro trava.
 */
export async function compressImageFile(
  file: File,
  options?: { maxEdge?: number; quality?: number },
): Promise<string> {
  if (!file.type.startsWith('image/') && file.type !== '') {
    throw new Error(`Arquivo inválido: ${file.name}`)
  }

  const maxEdge = options?.maxEdge ?? DEFAULT_MAX_EDGE
  let quality = options?.quality ?? DEFAULT_QUALITY

  const raw = await readFileAsDataUrl(file)
  const img = await loadImage(raw)

  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas indisponível neste navegador')

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  let dataUrl = canvasToJpeg(canvas, quality)
  while (dataUrl.length > MAX_OUTPUT_CHARS && quality > 0.4) {
    quality -= 0.08
    dataUrl = canvasToJpeg(canvas, quality)
  }

  if (dataUrl.length > MAX_OUTPUT_CHARS) {
    throw new Error('Foto ainda muito grande após compressão. Tente outra imagem.')
  }

  return dataUrl
}
