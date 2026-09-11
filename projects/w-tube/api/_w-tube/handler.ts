import type { VercelRequest, VercelResponse } from '@vercel/node'
import { issueSessionToken } from './auth-token'
import {
  blobConfigured,
  blobDiagnostics,
  getStore,
  hashPassword,
  probeBlobStorage,
  safeEqual,
  setRuntimeOidcToken,
} from './store'
import { buildPublicCatalog, getPublicProductBySlug } from './catalog'
import { ensureIphoneImportsStore, STORE_SLUG } from './seed'
import type { OrgDatabase } from './types'

function resolvePath(req: VercelRequest): string {
  const q = req.query?.path
  if (Array.isArray(q) && q.length > 0) return '/' + q.map(String).join('/')
  if (typeof q === 'string' && q.length > 0) return '/' + q.replace(/^\/+/, '')

  const originalUrl = req.url || '/'
  const qIndex = originalUrl.indexOf('?')
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl
  const stripped = pathname.replace(/^\/api\/w-tube\/?/, '/') || '/'
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

function readOidcHeader(req: VercelRequest): string | undefined {
  const raw = req.headers['x-vercel-oidc-token']
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim()
  return undefined
}

function blobSetupHint(storage: ReturnType<typeof blobDiagnostics>): string {
  if (storage.hasToken) return ''
  if (storage.hasStoreId && !storage.hasOidc && !storage.hasOidcHeader) {
    return 'BLOB_STORE_ID existe mas OIDC não chegou na function. Faça Redeploy ou adicione BLOB_READ_WRITE_TOKEN manualmente.'
  }
  if ((storage.hasOidc || storage.hasOidcHeader) && !storage.hasStoreId) {
    return 'OIDC ok mas BLOB_STORE_ID ausente — o Blob provavelmente está conectado a OUTRO projeto Vercel. Em Storage → seu Blob → Projects → conecte loja-iphoneimports (Production + Preview).'
  }
  if (storage.blobEnvKeys.length === 0) {
    return 'Nenhuma variável BLOB/OIDC nesta function. Storage → Blob → ⋯ → Update Project Connection → loja-iphoneimports. Ou adicione BLOB_READ_WRITE_TOKEN em Environment Variables e redeploy.'
  }
  return 'Vercel → loja-iphoneimports → Storage → Blob → Connect. Depois Redeploy. Ou adicione BLOB_READ_WRITE_TOKEN em Environment Variables.'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hasOidcHeader = Boolean(readOidcHeader(req))
  setRuntimeOidcToken(readOidcHeader(req))

  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  try {
    const store = await getStore()
    const path = resolvePath(req)

    if (req.method === 'POST' && path === '/init') {
      const body = (req.body || {}) as { force?: boolean }
      const result = await ensureIphoneImportsStore(store, { force: Boolean(body.force) })
      return json(res, 200, { ok: true, slug: STORE_SLUG, ...result })
    }

    await ensureIphoneImportsStore(store)

    if (req.method === 'GET' && (path === '/health' || path === '/')) {
      const org = store.findOrgBySlug(STORE_SLUG)
      const rec = org ? store.data().databases[org.id] : null
      const db = rec?.data as OrgDatabase | undefined
      const storage = blobDiagnostics(hasOidcHeader)
      const probe = await probeBlobStorage()
      const blobOk = probe.ok || (storage.hasToken && storage.configured)
      return json(res, 200, {
        ok: true,
        service: 'w-tube',
        blob: blobOk,
        storage: { ...storage, probe },
        setup: blobOk ? undefined : blobSetupHint(storage),
        slug: STORE_SLUG,
        products: db?.products.length ?? 0,
        inventory: db?.inventory.filter((u) => u.status === 'available').length ?? 0,
        updatedAt: rec?.updatedAt,
      })
    }

    // ---- Catálogo público (site) ----
    if (req.method === 'GET' && path.startsWith('/catalog/')) {
      const slug = decodeURIComponent(path.replace(/^\/catalog\//, '').replace(/\/$/, ''))
      const org = store.findOrgBySlug(slug)
      if (!org) return json(res, 404, { error: 'Loja não encontrada.' })

      const rec = store.data().databases[org.id]
      if (!rec?.data) return json(res, 404, { error: 'Catálogo não configurado.' })

      const db = rec.data as OrgDatabase
      const catalog = buildPublicCatalog(db)
      return json(res, 200, catalog)
    }

    if (req.method === 'GET' && path.startsWith('/product/')) {
      const parts = path.replace(/^\/product\//, '').split('/')
      const slug = decodeURIComponent(parts[0] || '')
      const storeSlug = decodeURIComponent(parts[1] || slug)
      const org = store.findOrgBySlug(storeSlug)
      if (!org) return json(res, 404, { error: 'Loja não encontrada.' })

      const rec = store.data().databases[org.id]
      if (!rec?.data) return json(res, 404, { error: 'Produto não encontrado.' })

      const db = rec.data as OrgDatabase
      const product = getPublicProductBySlug(db, slug)
      if (!product) return json(res, 404, { error: 'Produto não encontrado.' })
      return json(res, 200, product)
    }

    // ---- Auth (loja única) ----
    if (req.method === 'POST' && path === '/auth/register') {
      return json(res, 403, {
        error: 'Cadastro desativado. Use o login admin da W-Tube.',
        slug: STORE_SLUG,
      })
    }

    if (req.method === 'POST' && path === '/auth/login') {
      const body = (req.body || {}) as { username?: string; password?: string; store?: string }
      const username = String(body.username || '').trim().toLowerCase()
      const password = String(body.password || '')
      const storeSlug = String(body.store || STORE_SLUG).trim()
      if (!username || !password) {
        return json(res, 400, { error: 'Informe usuário e senha.' })
      }

      const found = store.findUserForLogin(username, storeSlug)
      if (Array.isArray(found)) {
        const options = found.map((u) => {
          const org = store.data().organizations[u.organizationId]
          return { slug: org?.slug || '', name: org?.name || 'Loja' }
        })
        return json(res, 409, {
          error: 'Várias lojas usam este login. Informe o código da loja.',
          stores: options,
        })
      }
      const user = found
      if (!user || !safeEqual(user.passwordHash, hashPassword(password))) {
        return json(res, 401, { error: 'Usuário, senha ou loja inválidos.' })
      }

      const session = store.toSession(user)
      const token = issueSessionToken(session)
      const dbRec = store.data().databases[user.organizationId]
      const storage = blobDiagnostics(hasOidcHeader)
      return json(res, 200, {
        token,
        session,
        database: dbRec?.data || null,
        version: dbRec?.version || 0,
        storage,
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

      const data = body.database as { organization?: { id?: string } }
      if (data.organization?.id && data.organization.id !== session.organizationId) {
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
      const persisted = await store.persist()
      const storage = blobDiagnostics(hasOidcHeader)
      const warning =
        process.env.VERCEL && !persisted.blob
          ? `Dados salvos só nesta instância. ${blobSetupHint(storage)}`
          : undefined
      return json(res, 200, {
        ok: true,
        version: nextVersion,
        persisted,
        storage,
        warning,
      })
    }

    return json(res, 404, { error: `Rota não encontrada: ${path}` })
  } catch (err) {
    console.error('[w-tube] handler error', err)
    return json(res, 500, {
      error: err instanceof Error ? err.message : 'Erro interno no W-Tube API',
    })
  }
}
