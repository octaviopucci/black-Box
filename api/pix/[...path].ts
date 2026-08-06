import type { VercelRequest, VercelResponse } from '@vercel/node'

// Bundle CJS gerado em vercel-build / bundle-pix-api.mjs
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gateway = require('./_gateway.cjs') as {
  getGateway: () => Promise<{ app: { inject: (opts: unknown) => Promise<{ statusCode: number; headers: Record<string, unknown>; body: string }> } }>
  flushPersist: () => Promise<void>
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { app } = await gateway.getGateway()

    const originalUrl = req.url || '/'
    const qIndex = originalUrl.indexOf('?')
    const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl
    const search = qIndex >= 0 ? originalUrl.slice(qIndex) : ''
    const strippedPath = pathname.replace(/^\/api\/pix\/?/, '/') || '/'
    const url = (strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`) + search

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
