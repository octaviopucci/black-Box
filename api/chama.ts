import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  blobConfigured,
  ChamaStore,
  metaConfigured,
  publicBaseUrl,
  uid,
  type ReplyLog,
  type ServerAutomation,
} from './_chama/store'
import {
  appId,
  exchangeCodeForToken,
  exchangeLongLivedUserToken,
  listPagesWithInstagram,
  matchKeywords,
  oauthDialogUrl,
  replyToComment,
  sendPrivateReply,
  subscribePageWebhooks,
  verifyToken,
} from './_chama/meta'

function resolvePath(req: VercelRequest): string {
  const q = req.query?.path
  if (Array.isArray(q) && q.length > 0) return '/' + q.map(String).join('/')
  if (typeof q === 'string' && q.length > 0) return '/' + q.replace(/^\/+/, '')

  const originalUrl = req.url || '/'
  const qIndex = originalUrl.indexOf('?')
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl
  const stripped = pathname.replace(/^\/api\/chama\/?/, '/') || '/'
  return stripped.startsWith('/') ? stripped : `/${stripped}`
}

function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Chama-Workspace')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.send(JSON.stringify(body))
}

function redirect(res: VercelResponse, url: string) {
  res.statusCode = 302
  res.setHeader('Location', url)
  res.end()
}

function workspaceFrom(req: VercelRequest): string | null {
  const h = req.headers['x-chama-workspace']
  if (typeof h === 'string' && h.trim()) return h.trim()
  const q = req.query?.workspace
  if (typeof q === 'string' && q.trim()) return q.trim()
  return null
}

function appFrontendUrl(path = '/chama/') {
  return `${publicBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

function oauthRedirectUri() {
  return `${publicBaseUrl()}/api/chama/oauth/callback`
}

async function handleCommentEvent(
  store: ChamaStore,
  payload: {
    igUserId: string
    commentId: string
    text: string
    fromUsername?: string
  },
) {
  const data = store.data()
  if (data.processedComments[payload.commentId]) {
    return { skipped: true, reason: 'already_processed' }
  }

  const connection = Object.values(data.connections).find((c) => c.igUserId === payload.igUserId)
  if (!connection) return { skipped: true, reason: 'no_connection' }

  const autos = (data.automations[connection.workspaceId] || []).filter((a) => a.active)
  const hit = autos.find((a) => matchKeywords(payload.text, a.keywords))
  if (!hit) {
    const log: ReplyLog = {
      id: uid('log'),
      workspaceId: connection.workspaceId,
      commentId: payload.commentId,
      commentText: payload.text,
      fromUsername: payload.fromUsername,
      status: 'skipped',
      detail: 'no_keyword_match',
      at: new Date().toISOString(),
    }
    data.replyLogs.unshift(log)
    data.processedComments[payload.commentId] = log.id
    store.markDirty()
    await store.persist()
    return { skipped: true, reason: 'no_keyword_match' }
  }

  try {
    await sendPrivateReply({
      pageId: connection.pageId,
      pageAccessToken: connection.pageAccessToken,
      commentId: payload.commentId,
      text: hit.replyText,
    })

    // Best-effort public reply under the comment
    try {
      await replyToComment({
        commentId: payload.commentId,
        pageAccessToken: connection.pageAccessToken,
        text: 'Te chamei no Direct 🔥',
      })
    } catch {
      // private reply is enough
    }

    hit.matches += 1
    hit.updatedAt = new Date().toISOString()
    const log: ReplyLog = {
      id: uid('log'),
      workspaceId: connection.workspaceId,
      commentId: payload.commentId,
      commentText: payload.text,
      fromUsername: payload.fromUsername,
      automationId: hit.id,
      status: 'sent',
      detail: 'private_reply_sent',
      at: new Date().toISOString(),
    }
    data.replyLogs.unshift(log)
    data.processedComments[payload.commentId] = log.id
    data.replyLogs = data.replyLogs.slice(0, 500)
    store.markDirty()
    await store.persist()
    return { sent: true, automationId: hit.id }
  } catch (err) {
    const log: ReplyLog = {
      id: uid('log'),
      workspaceId: connection.workspaceId,
      commentId: payload.commentId,
      commentText: payload.text,
      fromUsername: payload.fromUsername,
      automationId: hit.id,
      status: 'error',
      detail: err instanceof Error ? err.message : String(err),
      at: new Date().toISOString(),
    }
    data.replyLogs.unshift(log)
    data.processedComments[payload.commentId] = log.id
    store.markDirty()
    await store.persist()
    return { error: log.detail }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return json(res, 204, {})

  try {
    const store = await ChamaStore.open()
    const path = resolvePath(req)

    if (req.method === 'GET' && (path === '/' || path === '/health')) {
      return json(res, 200, {
        ok: true,
        service: 'chama',
        metaConfigured: metaConfigured(),
        blob: blobConfigured(),
        appIdConfigured: Boolean(appId()),
      })
    }

    if (req.method === 'GET' && path === '/config') {
      return json(res, 200, {
        metaConfigured: metaConfigured(),
        appId: metaConfigured() ? appId() : null,
        oauthCallback: oauthRedirectUri(),
        webhookUrl: `${publicBaseUrl()}/api/chama/webhook`,
        publicBaseUrl: publicBaseUrl(),
        setup: {
          redirectUri: oauthRedirectUri(),
          webhookUrl: `${publicBaseUrl()}/api/chama/webhook`,
          scopes: [
            'pages_show_list',
            'pages_read_engagement',
            'pages_manage_metadata',
            'pages_messaging',
            'instagram_basic',
            'instagram_manage_comments',
            'instagram_manage_messages',
          ],
        },
      })
    }

    // ---- OAuth start ----
    if (req.method === 'GET' && path === '/oauth/start') {
      if (!metaConfigured()) {
        return json(res, 503, {
          error: 'meta_not_configured',
          message:
            'Configure CHAMA_META_APP_ID, CHAMA_META_APP_SECRET e CHAMA_META_VERIFY_TOKEN na Vercel.',
        })
      }
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      const state = Buffer.from(
        JSON.stringify({ workspaceId: workspace, n: uid('st') }),
        'utf8',
      ).toString('base64url')
      return redirect(res, oauthDialogUrl(oauthRedirectUri(), state))
    }

    // ---- OAuth callback ----
    if (req.method === 'GET' && path === '/oauth/callback') {
      const err = typeof req.query.error === 'string' ? req.query.error : null
      if (err) {
        return redirect(
          res,
          `${appFrontendUrl('/chama/app/channels')}?ig=error&reason=${encodeURIComponent(err)}`,
        )
      }
      const code = typeof req.query.code === 'string' ? req.query.code : ''
      const stateRaw = typeof req.query.state === 'string' ? req.query.state : ''
      if (!code || !stateRaw) {
        return redirect(res, `${appFrontendUrl('/chama/app/channels')}?ig=error&reason=missing_code`)
      }

      let workspaceId = ''
      try {
        const parsed = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf8')) as {
          workspaceId?: string
        }
        workspaceId = parsed.workspaceId || ''
      } catch {
        return redirect(res, `${appFrontendUrl('/chama/app/channels')}?ig=error&reason=bad_state`)
      }
      if (!workspaceId) {
        return redirect(res, `${appFrontendUrl('/chama/app/channels')}?ig=error&reason=no_workspace`)
      }

      try {
        const short = await exchangeCodeForToken(code, oauthRedirectUri())
        const longLived = await exchangeLongLivedUserToken(short.access_token)
        const pages = await listPagesWithInstagram(longLived.access_token)
        if (pages.length === 0) {
          return redirect(
            res,
            `${appFrontendUrl('/chama/app/channels')}?ig=error&reason=${encodeURIComponent(
              'Nenhuma Página com Instagram Professional encontrada. Ligue o IG Business/Creator a uma Page.',
            )}`,
          )
        }

        const chosen = pages[0]
        let webhookSubscribed = false
        try {
          await subscribePageWebhooks(chosen.pageId, chosen.pageAccessToken)
          webhookSubscribed = true
        } catch {
          webhookSubscribed = false
        }

        store.data().connections[workspaceId] = {
          workspaceId,
          pageId: chosen.pageId,
          pageName: chosen.pageName,
          pageAccessToken: chosen.pageAccessToken,
          igUserId: chosen.igUserId,
          igUsername: chosen.igUsername,
          connectedAt: new Date().toISOString(),
          webhookSubscribed,
        }
        store.markDirty()
        await store.persist()

        return redirect(
          res,
          `${appFrontendUrl('/chama/app/channels')}?ig=connected&user=${encodeURIComponent(
            chosen.igUsername,
          )}`,
        )
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'oauth_failed'
        return redirect(
          res,
          `${appFrontendUrl('/chama/app/channels')}?ig=error&reason=${encodeURIComponent(msg)}`,
        )
      }
    }

    // ---- Webhook verify (Meta) ----
    if (req.method === 'GET' && path === '/webhook') {
      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']
      if (mode === 'subscribe' && token === verifyToken() && typeof challenge === 'string') {
        res.status(200).send(challenge)
        return
      }
      return json(res, 403, { error: 'verification_failed' })
    }

    // ---- Webhook events ----
    if (req.method === 'POST' && path === '/webhook') {
      const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {}
      const results: unknown[] = []

      // Instagram object comments
      if (body.object === 'instagram' && Array.isArray(body.entry)) {
        for (const entry of body.entry) {
          const igUserId = String(entry.id || '')
          for (const change of entry.changes || []) {
            if (change.field !== 'comments' && change.field !== 'live_comments') continue
            const value = change.value || {}
            const commentId = String(value.id || value.comment_id || '')
            const text = String(value.text || '')
            if (!commentId || !text) continue
            // Ignore comments from the account itself when possible
            results.push(
              await handleCommentEvent(store, {
                igUserId,
                commentId,
                text,
                fromUsername: value.from?.username,
              }),
            )
          }
        }
      }

      // Page feed comments that mention IG (fallback)
      if (body.object === 'page' && Array.isArray(body.entry)) {
        for (const entry of body.entry) {
          for (const change of entry.changes || []) {
            if (change.field !== 'feed') continue
            const value = change.value || {}
            if (value.item !== 'comment' || value.verb !== 'add') continue
            const commentId = String(value.comment_id || '')
            const text = String(value.message || '')
            if (!commentId || !text) continue
            const connection = Object.values(store.data().connections).find(
              (c) => c.pageId === String(entry.id),
            )
            if (!connection) continue
            results.push(
              await handleCommentEvent(store, {
                igUserId: connection.igUserId,
                commentId,
                text,
                fromUsername: value.from?.name,
              }),
            )
          }
        }
      }

      return json(res, 200, { ok: true, results })
    }

    // ---- Connection status ----
    if (req.method === 'GET' && path === '/connection') {
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      const conn = store.data().connections[workspace]
      if (!conn) return json(res, 200, { connected: false, metaConfigured: metaConfigured() })
      return json(res, 200, {
        connected: true,
        metaConfigured: metaConfigured(),
        igUsername: conn.igUsername,
        igUserId: conn.igUserId,
        pageName: conn.pageName,
        pageId: conn.pageId,
        connectedAt: conn.connectedAt,
        webhookSubscribed: conn.webhookSubscribed,
      })
    }

    if (req.method === 'DELETE' && path === '/connection') {
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      delete store.data().connections[workspace]
      store.markDirty()
      await store.persist()
      return json(res, 200, { ok: true, connected: false })
    }

    // ---- Automations (server-side keyword → DM) ----
    if (req.method === 'GET' && path === '/automations') {
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      return json(res, 200, {
        items: store.data().automations[workspace] || [],
      })
    }

    if (req.method === 'POST' && path === '/automations') {
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {}
      const keywords = Array.isArray(body.keywords)
        ? body.keywords.map(String)
        : String(body.trigger || '')
            .split(/[,/|]/)
            .map((s) => s.trim())
            .filter(Boolean)
      if (!body.name || !body.replyText || keywords.length === 0) {
        return json(res, 400, { error: 'name_keywords_reply_required' })
      }
      const item: ServerAutomation = {
        id: body.id || uid('au'),
        workspaceId: workspace,
        name: String(body.name),
        keywords,
        replyText: String(body.replyText),
        active: body.active !== false,
        matches: Number(body.matches || 0),
        channel: 'instagram',
        updatedAt: new Date().toISOString(),
      }
      const list = store.data().automations[workspace] || []
      const idx = list.findIndex((a) => a.id === item.id)
      if (idx >= 0) list[idx] = { ...list[idx], ...item, matches: list[idx].matches }
      else list.unshift(item)
      store.data().automations[workspace] = list
      store.markDirty()
      await store.persist()
      return json(res, 200, { ok: true, item })
    }

    if (req.method === 'POST' && path === '/automations/sync') {
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {}
      const items = Array.isArray(body.items) ? body.items : []
      const mapped: ServerAutomation[] = items.map((raw: Record<string, unknown>) => ({
        id: String(raw.id || uid('au')),
        workspaceId: workspace,
        name: String(raw.name || 'Automação'),
        keywords: Array.isArray(raw.keywords)
          ? raw.keywords.map(String)
          : String(raw.trigger || '')
              .split(/[,/|]/)
              .map((s) => s.trim())
              .filter(Boolean),
        replyText: String(
          raw.replyText ||
            'Oi! Vi seu comentário 🔥 Te chamei no Direct com o link.',
        ),
        active: raw.active !== false,
        matches: Number(raw.matches || 0),
        channel: 'instagram' as const,
        updatedAt: new Date().toISOString(),
      }))
      store.data().automations[workspace] = mapped.filter((a) => a.keywords.length > 0)
      store.markDirty()
      await store.persist()
      return json(res, 200, {
        ok: true,
        count: store.data().automations[workspace].length,
      })
    }

    if (req.method === 'GET' && path === '/logs') {
      const workspace = workspaceFrom(req)
      if (!workspace) return json(res, 400, { error: 'workspace_required' })
      const items = store.data().replyLogs.filter((l) => l.workspaceId === workspace).slice(0, 100)
      return json(res, 200, { items })
    }

    return json(res, 404, { error: 'not_found', path })
  } catch (err) {
    return json(res, 500, {
      error: 'internal',
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
