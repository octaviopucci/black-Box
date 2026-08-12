import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getStore,
  hashPassword,
  issueToken,
  safeEqual,
  type CloudOrg,
  type CloudUser,
} from './_lp-motors/store'
import {
  estimateIpva,
  fipeDetailByCode,
  fipeFetch,
  fipeTextSearch,
  lookupPlateExternal,
  normalizePlate,
  normalizeTextSearchResults,
  plateFormats,
  plateProviderConfigured,
  type FipeVehicleType,
} from './_lp-motors/fipe'

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
        plateApi: plateProviderConfigured(),
        plateProvider: process.env.LP_MOTORS_PLACAFIP_TOKEN || process.env.PLACAFIP_TOKEN
          ? 'placafipe'
          : process.env.LP_MOTORS_PLATE_API_URL
            ? 'custom'
            : 'none',
        fipe: true,
        orgs: Object.keys(store.data().organizations).length,
      })
    }

    // ---- FIPE / Placa (público autenticado ou anônimo — só leitura de mercado) ----
    if (req.method === 'GET' && path === '/fipe/references') {
      const r = await fipeFetch('/references')
      return json(res, r.status, r.data)
    }

    if (req.method === 'GET' && path === '/fipe/search') {
      const q = String(req.query?.q || '').trim()
      if (q.length < 2) return json(res, 400, { error: 'Informe pelo menos 2 caracteres.' })
      const r = await fipeTextSearch(q)
      if (!r.ok) return json(res, r.status, r.data)
      return json(res, 200, normalizeTextSearchResults(r.data))
    }

    // Resolve FIPE by code + optional year (lists years, picks fuel suffix correctly)
    // GET /fipe/:type/code/:code?year=2009
    {
      const codeMatch = path.match(/^\/fipe\/(cars|motorcycles|trucks)\/code\/([^/]+)\/?$/)
      if (req.method === 'GET' && codeMatch) {
        const type = codeMatch[1] as FipeVehicleType
        const code = decodeURIComponent(codeMatch[2])
        const year = Number(req.query?.year || 0) || undefined
        const r = await fipeDetailByCode(type, code, year)
        return json(res, r.status, r.data)
      }
    }

    if (req.method === 'GET' && path.startsWith('/fipe/')) {
      const parts = path.split('/').filter(Boolean) // fipe, cars, brands...
      // /fipe/:type/brands
      // /fipe/:type/brands/:brandId/models
      // /fipe/:type/brands/:brandId/models/:modelId/years
      // /fipe/:type/brands/:brandId/models/:modelId/years/:yearId
      // /fipe/:type/:fipeCode/years
      // /fipe/:type/:fipeCode/years/:yearId
      if (parts[0] !== 'fipe' || parts.length < 2) {
        return json(res, 400, { error: 'Rota FIPE inválida' })
      }
      const rest = '/' + parts.slice(1).join('/')
      // Legacy wrong path /fipe-code/:code → rewrite to Parallelum /:code/years
      const legacyCode = rest.match(/^\/(cars|motorcycles|trucks)\/fipe-code\/([^/]+)(?:\/years(?:\/([^/]+))?)?$/)
      if (legacyCode) {
        const type = legacyCode[1] as FipeVehicleType
        const code = decodeURIComponent(legacyCode[2])
        const yearHint = legacyCode[3] ? Number(String(legacyCode[3]).split('-')[0]) : undefined
        const r = await fipeDetailByCode(type, code, yearHint)
        return json(res, r.status, r.data)
      }
      const safe =
        rest === '/references' ||
        /^\/(cars|motorcycles|trucks)\/brands$/.test(rest) ||
        /^\/(cars|motorcycles|trucks)\/brands\/\d+\/models$/.test(rest) ||
        /^\/(cars|motorcycles|trucks)\/brands\/\d+\/models\/\d+\/years$/.test(rest) ||
        /^\/(cars|motorcycles|trucks)\/brands\/\d+\/models\/\d+\/years\/[^/]+$/.test(rest) ||
        /^\/(cars|motorcycles|trucks)\/(?!brands(?:\/|$))[^/]+\/years$/.test(rest) ||
        /^\/(cars|motorcycles|trucks)\/(?!brands(?:\/|$))[^/]+\/years\/[^/]+$/.test(rest)
      if (!safe) return json(res, 400, { error: 'Caminho FIPE não permitido', path: rest })
      const r = await fipeFetch(rest)
      return json(res, r.status, r.data)
    }

    if (req.method === 'GET' && path.startsWith('/placa/')) {
      const plate = normalizePlate(decodeURIComponent(path.replace(/^\/placa\//, '')))
      if (plate.length < 7) {
        return json(res, 400, { error: 'Informe a placa completa (7 caracteres).' })
      }
      const formats = plateFormats(plate)
      const external = await lookupPlateExternal(plate)
      let fipe: unknown = null
      let ipva: unknown = null
      const uf = String(req.query?.uf || 'SP')
      const type = (String(req.query?.type || 'cars') as FipeVehicleType) || 'cars'
      let suggestions: unknown[] = []

      // 1) PlacaFIPE já trouxe preço — usa o melhor match
      if (external.ok && external.bestFipe?.price) {
        const best = external.bestFipe
        fipe = {
          brand: best.brand,
          model: best.model,
          modelYear: best.modelYear,
          fuel: best.fuel,
          codeFipe: best.fipeCode,
          price: best.priceLabel || `R$ ${best.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          referenceMonth: best.referenceMonth,
        }
        ipva = estimateIpva(best.price, uf)
      } else if (external.ok && external.vehicle?.fipeCode) {
        // 2) Só veio código → resolve na Parallelum
        const detail = await fipeDetailByCode(
          type,
          external.vehicle.fipeCode,
          external.vehicle.modelYear,
        )
        if (detail.ok) {
          fipe = detail.data
          const priceRaw = (detail.data as { price?: string })?.price || ''
          const price = Number(String(priceRaw).replace(/[^\d,]/g, '').replace(',', '.')) || 0
          if (price > 0) ipva = estimateIpva(price, uf)
        }
      } else if (external.ok && external.vehicle?.brand && external.vehicle?.model) {
        // 3) Marca/modelo sem FIPE → busca textual gratuita
        const q = `${external.vehicle.brand} ${external.vehicle.model} ${external.vehicle.modelYear || ''}`.trim()
        const search = await fipeTextSearch(q)
        if (search.ok) {
          const normalized = normalizeTextSearchResults(search.data)
          suggestions = normalized.results.slice(0, 8)
          const top = normalized.results[0]
          if (top?.price && top.codigo_fipe) {
            fipe = {
              brand: top.brand_name,
              model: top.model_name,
              modelYear: top.model_year,
              fuel: top.fuel_name,
              codeFipe: top.codigo_fipe,
              price: top.value_label || `R$ ${Number(top.price).toLocaleString('pt-BR')}`,
              referenceMonth: top.reference_month,
            }
            ipva = estimateIpva(Number(top.price), uf)
          }
        }
      }

      return json(res, 200, {
        ...external,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        fipe,
        ipva,
        suggestions,
        plateConfigured: plateProviderConfigured(),
      })
    }

    if (req.method === 'POST' && path === '/fipe/ipva') {
      const body = (req.body || {}) as { value?: number; uf?: string }
      const value = Number(body.value || 0)
      if (!value) return json(res, 400, { error: 'Informe o valor FIPE.' })
      return json(res, 200, estimateIpva(value, body.uf || 'SP'))
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
