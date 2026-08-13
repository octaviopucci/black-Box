import type { VercelRequest, VercelResponse } from '@vercel/node'
import { demoEdit } from './_traco/demoEdit'

/**
 * traço API
 * - GET  /api/traco?path=health
 * - POST /api/traco?path=ai/edit  { prompt, imageDataUrl, maskDataUrl?, mode }
 *
 * Optional env: OPENAI_API_KEY — when set, uses OpenAI Images edit when possible.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()

  const path = String(req.query.path || 'health')

  if (path === 'health') {
    return res.status(200).json({
      ok: true,
      service: 'traco',
      openai: Boolean(process.env.OPENAI_API_KEY),
    })
  }

  if (path === 'ai/edit' && req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
      const prompt = String(body.prompt || '').trim()
      const imageDataUrl = String(body.imageDataUrl || '')
      if (!prompt || !imageDataUrl.startsWith('data:image')) {
        return res.status(400).json({ ok: false, message: 'prompt e imageDataUrl obrigatórios' })
      }

      // Cap payload roughly (~6MB base64)
      if (imageDataUrl.length > 8_000_000) {
        return res.status(413).json({ ok: false, message: 'Imagem grande demais' })
      }

      const key = process.env.OPENAI_API_KEY
      if (key) {
        try {
          const live = await openaiEdit(key, prompt, imageDataUrl, body.maskDataUrl)
          if (live) {
            return res.status(200).json({
              ok: true,
              mode: 'live',
              imageDataUrl: live,
              message: 'IA OpenAI aplicada na seleção.',
            })
          }
        } catch (err) {
          console.error('openai edit failed', err)
        }
      }

      const demo = await demoEdit(imageDataUrl, prompt)
      if (demo.imageDataUrl === imageDataUrl) {
        // Server runtime sem canvas — cliente aplica demo localmente.
        return res.status(200).json({
          ok: false,
          mode: 'demo',
          effect: demo.effect,
          message: 'Delegado ao cliente',
          delegate: true,
        })
      }
      return res.status(200).json({
        ok: true,
        mode: 'demo',
        imageDataUrl: demo.imageDataUrl,
        effect: demo.effect,
        message: `Demo IA: efeito “${demo.effect}”. Configure OPENAI_API_KEY para geração live.`,
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        ok: false,
        message: err instanceof Error ? err.message : 'Erro interno',
      })
    }
  }

  return res.status(404).json({ ok: false, message: 'Rota não encontrada' })
}

async function openaiEdit(
  apiKey: string,
  prompt: string,
  imageDataUrl: string,
  maskDataUrl?: string,
): Promise<string | null> {
  // OpenAI images.edit expects multipart file upload; for serverless simplicity
  // we use gpt-image-1 / images edits when available via base64 JSON endpoints.
  // Fallback strategy: chat-style is not image-out; use images/generations with
  // prompt enriched — but that loses structure. Prefer edits with FormData.

  const form = new FormData()
  form.append('model', process.env.TRACO_OPENAI_IMAGE_MODEL || 'gpt-image-1')
  form.append('prompt', prompt.slice(0, 1200))
  form.append('image', dataUrlToFile(imageDataUrl, 'image.png'))
  if (maskDataUrl && String(maskDataUrl).startsWith('data:image')) {
    form.append('mask', dataUrlToFile(String(maskDataUrl), 'mask.png'))
  }

  const resp = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form as unknown as BodyInit,
  })

  if (!resp.ok) {
    const text = await resp.text()
    console.error('OpenAI images/edits', resp.status, text)
    return null
  }

  const json = (await resp.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>
  }
  const b64 = json.data?.[0]?.b64_json
  if (b64) return `data:image/png;base64,${b64}`
  const url = json.data?.[0]?.url
  if (url) {
    const img = await fetch(url)
    const buf = Buffer.from(await img.arrayBuffer())
    return `data:image/png;base64,${buf.toString('base64')}`
  }
  return null
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, b64] = dataUrl.split(',')
  const mime = /data:(.*);base64/.exec(header)?.[1] || 'image/png'
  const bin = Buffer.from(b64, 'base64')
  return new File([bin], filename, { type: mime })
}
