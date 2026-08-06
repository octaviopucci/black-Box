import type { VercelRequest, VercelResponse } from '@vercel/node'

// Bundle CJS gerado por scripts/bundle-pix-api.mjs
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gateway = require('./_pix_gateway.cjs') as {
  getGateway: () => Promise<{
    app: {
      inject: (opts: unknown) => Promise<{
        statusCode: number
        headers: Record<string, unknown>
        body: string
      }>
    }
  }>
  flushPersist: () => Promise<void>
}

function resolvePath(req: VercelRequest): string {
  const q = req.query?.path
  if (Array.isArray(q) && q.length > 0) {
    return '/' + q.map(String).join('/')
  }
  if (typeof q === 'string' && q.length > 0) {
    return '/' + q.replace(/^\/+/, '')
  }

  const originalUrl = req.url || '/'
  const qIndex = originalUrl.indexOf('?')
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl
  const stripped = pathname.replace(/^\/api\/pix\/?/, '/') || '/'
  return stripped.startsWith('/') ? stripped : `/${stripped}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { app } = await gateway.getGateway()

    const originalUrl = req.url || '/'
    const qIndex = originalUrl.indexOf('?')
    const search = qIndex >= 0 ? originalUrl.slice(qIndex) : ''
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
    params.delete('path')
    const cleanSearch = params.toString() ? `?${params.toString()}` : ''
    const url = resolvePath(req) + cleanSearch

    const payload =
      req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE'
        ? undefined
        : req.body

    const response = await app.inject({
      method: req.method || 'GET',
      url,
      headers: req.headers as Record<string, string>,
      payload,
      remoteAddress: req.socket?.remoteAddress,
    })

    for (const [key, value] of Object.entries(response.headers)) {
      if (value !== undefined) res.setHeader(key, value as string | number | string[])
    }
    res.status(response.statusCode).send(response.body)
    await gateway.flushPersist()
  } catch (err) {
    console.error('[pix-gateway] handler error', err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Erro interno no PIX Gateway',
    })
  }
}
