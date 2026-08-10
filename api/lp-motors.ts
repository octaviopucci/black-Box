import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getStore,
  hashPassword,
  issueToken,
  safeEqual,
  type CloudOrg,
  type CloudUser,
} from './_lp-motors/store'

function resolvePath(req: VercelRequest): string {
  const q = req.query?.path
  if (Array.isArray(q) && q.length > 0) return '/' + q.map(String).join('/')
  if (typeof q === 'string' && q.length > 0) return '/' + q.replace(/^\/+/, '')

  const originalUrl = req.url || '/'
  const qIndex = originalUrl.indexOf('?')
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl
  const stripped = pathname.replace(/^\/api\/lp-motors\/?/, '/') || '/'
  return stripped.startsWith('/') ? stripped : `/${stripped}`
}

function readBearer(req: VercelRequest): string | null {
  const h = req.headers.authorization
  if (!h || typeof h !== 'string') return null
  const m = h.match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : null
}

function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  res.send(JSON.stringify(body))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  try {
    const store = await getStore()
    const path = resolvePath(req)

    if (req.method === 'GET' && (path === '/health' || path === '/')) {
      return json(res, 200, {
        ok: true,
        service: 'lp-motors',
        blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        orgs: Object.keys(store.data().organizations).length,
      })
    }

    if (req.method === 'POST' && path === '/auth/login') {
      const body = (req.body || {}) as { username?: string; password?: string }
      const username = String(body.username || '').trim()
      const password = String(body.password || '')
      if (!username || !password) {
        return json(res, 400, { error: 'Informe usuário e senha.' })
      }

      const user = store.findUserByUsername(username)
      if (!user || !safeEqual(user.passwordHash, hashPassword(password))) {
        return json(res, 401, { error: 'Usuário ou senha inválidos.' })
      }

      const token = issueToken()
      store.data().tokens[token] = {
        organizationId: user.organizationId,
        userId: user.id,
        createdAt: new Date().toISOString(),
      }
      store.markDirty()
      await store.persist()

      const dbRec = store.data().databases[user.organizationId]
      return json(res, 200, {
        token,
        session: {
          userId: user.id,
          username: user.username,
          nome: user.nome,
          role: user.role,
          organizationId: user.organizationId,
        },
        database: dbRec?.data || null,
        version: dbRec?.version || 0,
      })
    }

    if (req.method === 'POST' && path === '/auth/bootstrap') {
      const body = (req.body || {}) as {
        username?: string
        password?: string
        session?: { userId?: string; nome?: string; role?: string; organizationId?: string }
        database?: {
          organization?: CloudOrg
          users?: Array<{
            id: string
            username: string
            password: string
            nome: string
            role: string
            active: boolean
            organizationId?: string
          }>
          settings?: Array<{ nomeEmpresa?: string }>
        }
      }

      const username = String(body.username || '').trim().toLowerCase()
      const password = String(body.password || '')
      if (!username || !password || !body.database) {
        return json(res, 400, { error: 'Dados insuficientes para sincronizar.' })
      }

      let existing = store.findUserByUsername(username)
      let orgId = body.session?.organizationId || body.database.organization?.id || `org_${Date.now().toString(36)}`

      if (!existing) {
        const orgName =
          body.database.organization?.name ||
          body.database.settings?.[0]?.nomeEmpresa ||
          'LP Motors'
        const org: CloudOrg = {
          id: orgId,
          name: orgName,
          slug: (body.database.organization?.slug || 'lp-motors').toLowerCase(),
          createdAt: new Date().toISOString(),
        }
        store.data().organizations[orgId] = org

        // Import all users from local DB with hashed passwords
        for (const u of body.database.users || []) {
          const cloudUser: CloudUser = {
            id: u.id,
            organizationId: orgId,
            username: u.username,
            passwordHash: hashPassword(u.password),
            nome: u.nome,
            role: u.role || 'vendedor',
            active: u.active !== false,
          }
          store.data().users[u.id] = cloudUser
        }

        // Ensure logging-in user exists
        if (!store.findUserByUsername(username)) {
          const id = body.session?.userId || `user_${Date.now().toString(36)}`
          store.data().users[id] = {
            id,
            organizationId: orgId,
            username,
            passwordHash: hashPassword(password),
            nome: body.session?.nome || username,
            role: body.session?.role || 'admin',
            active: true,
          }
          existing = store.data().users[id]
        } else {
          existing = store.findUserByUsername(username)
        }

        store.data().databases[orgId] = {
          version: 1,
          updatedAt: new Date().toISOString(),
          data: body.database,
        }
      } else {
        orgId = existing.organizationId
        // Only allow bootstrap push when password matches the cloud user
        if (!safeEqual(existing.passwordHash, hashPassword(password))) {
          return json(res, 401, { error: 'Usuário ou senha inválidos.' })
        }
        store.data().databases[orgId] = {
          version: (store.data().databases[orgId]?.version || 0) + 1,
          updatedAt: new Date().toISOString(),
          data: body.database,
        }
      }

      const user = existing || store.findUserByUsername(username)
      if (!user) return json(res, 500, { error: 'Falha ao criar usuário na nuvem.' })

      const token = issueToken()
      store.data().tokens[token] = {
        organizationId: user.organizationId,
        userId: user.id,
        createdAt: new Date().toISOString(),
      }
      store.markDirty()
      await store.persist()

      return json(res, 200, {
        token,
        session: {
          userId: user.id,
          username: user.username,
          nome: user.nome,
          role: user.role,
          organizationId: user.organizationId,
        },
        version: store.data().databases[user.organizationId]?.version || 1,
      })
    }

    const token = readBearer(req)
    const session = token ? store.resolveToken(token) : null

    if (req.method === 'GET' && path === '/db') {
      if (!session) return json(res, 401, { error: 'Sessão inválida. Faça login novamente.' })
      const rec = store.data().databases[session.organizationId]
      if (!rec) return json(res, 404, { error: 'Nenhum dado encontrado para esta organização.' })
      return json(res, 200, { database: rec.data, version: rec.version, updatedAt: rec.updatedAt })
    }

    if (req.method === 'PUT' && path === '/db') {
      if (!session) return json(res, 401, { error: 'Sessão inválida. Faça login novamente.' })
      const body = (req.body || {}) as { database?: unknown; clientVersion?: number }
      if (!body.database) return json(res, 400, { error: 'Payload sem database.' })

      // Ensure tenant isolation — stamp organization id
      const data = body.database as { organization?: { id?: string } }
      if (data.organization && data.organization.id && data.organization.id !== session.organizationId) {
        return json(res, 403, { error: 'Acesso negado a outra organização.' })
      }

      const prev = store.data().databases[session.organizationId]
      const nextVersion = (prev?.version || 0) + 1
      store.data().databases[session.organizationId] = {
        version: nextVersion,
        updatedAt: new Date().toISOString(),
        data: body.database,
      }
      store.markDirty()
      await store.persist()
      return json(res, 200, { ok: true, version: nextVersion })
    }

    return json(res, 404, { error: `Rota não encontrada: ${path}` })
  } catch (err) {
    console.error('[lp-motors] handler error', err)
    return json(res, 500, {
      error: err instanceof Error ? err.message : 'Erro interno no LP Motors API',
    })
  }
}
