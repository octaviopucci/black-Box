const GRAPH = 'https://graph.facebook.com/v21.0'

export function appId() {
  return process.env.CHAMA_META_APP_ID || ''
}

export function appSecret() {
  return process.env.CHAMA_META_APP_SECRET || ''
}

export function verifyToken() {
  return process.env.CHAMA_META_VERIFY_TOKEN || ''
}

export const OAUTH_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_metadata',
  'pages_messaging',
  'instagram_basic',
  'instagram_manage_comments',
  'instagram_manage_messages',
  'business_management',
].join(',')

export function oauthDialogUrl(redirectUri: string, state: string) {
  const u = new URL('https://www.facebook.com/v21.0/dialog/oauth')
  u.searchParams.set('client_id', appId())
  u.searchParams.set('redirect_uri', redirectUri)
  u.searchParams.set('state', state)
  u.searchParams.set('scope', OAUTH_SCOPES)
  u.searchParams.set('response_type', 'code')
  return u.toString()
}

async function graphGet(path: string, params: Record<string, string> = {}) {
  const u = new URL(`${GRAPH}${path}`)
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  const res = await fetch(u)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message || `Graph GET ${path} failed`)
  }
  return data
}

async function graphPost(path: string, body: Record<string, unknown>, accessToken: string) {
  const u = new URL(`${GRAPH}${path}`)
  u.searchParams.set('access_token', accessToken)
  const res = await fetch(u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message || `Graph POST ${path} failed`)
  }
  return data
}

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  return graphGet('/oauth/access_token', {
    client_id: appId(),
    client_secret: appSecret(),
    redirect_uri: redirectUri,
    code,
  }) as Promise<{ access_token: string; token_type?: string; expires_in?: number }>
}

export async function exchangeLongLivedUserToken(shortToken: string) {
  return graphGet('/oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: appId(),
    client_secret: appSecret(),
    fb_exchange_token: shortToken,
  }) as Promise<{ access_token: string; expires_in?: number }>
}

export interface PageWithIg {
  pageId: string
  pageName: string
  pageAccessToken: string
  igUserId: string
  igUsername: string
}

export async function listPagesWithInstagram(userToken: string): Promise<PageWithIg[]> {
  const pages = await graphGet('/me/accounts', {
    access_token: userToken,
    fields: 'id,name,access_token,instagram_business_account{id,username}',
    limit: '100',
  })

  const out: PageWithIg[] = []
  for (const page of pages.data || []) {
    const ig = page.instagram_business_account
    if (!ig?.id) continue
    let username = ig.username || ''
    if (!username) {
      try {
        const igInfo = await graphGet(`/${ig.id}`, {
          access_token: page.access_token,
          fields: 'username,name',
        })
        username = igInfo.username || igInfo.name || ig.id
      } catch {
        username = ig.id
      }
    }
    out.push({
      pageId: page.id,
      pageName: page.name,
      pageAccessToken: page.access_token,
      igUserId: ig.id,
      igUsername: username,
    })
  }
  return out
}

export async function subscribePageWebhooks(pageId: string, pageAccessToken: string) {
  return graphPost(
    `/${pageId}/subscribed_apps`,
    {
      subscribed_fields: [
        'feed',
        'messages',
        'messaging_postbacks',
        'message_deliveries',
        'message_reads',
      ],
    },
    pageAccessToken,
  )
}

/** Private reply to an Instagram comment (opens DM). */
export async function sendPrivateReply(opts: {
  pageId: string
  pageAccessToken: string
  commentId: string
  text: string
}) {
  return graphPost(
    `/${opts.pageId}/messages`,
    {
      recipient: { comment_id: opts.commentId },
      message: { text: opts.text },
    },
    opts.pageAccessToken,
  )
}

/** Also reply publicly under the comment (optional). */
export async function replyToComment(opts: {
  commentId: string
  pageAccessToken: string
  text: string
}) {
  return graphPost(
    `/${opts.commentId}/replies`,
    { message: opts.text },
    opts.pageAccessToken,
  )
}

export function matchKeywords(text: string, keywords: string[]) {
  const hay = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
  return keywords.some((k) => {
    const needle = k.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    return needle.length > 0 && hay.includes(needle)
  })
}
