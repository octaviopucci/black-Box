import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExternalLink, Camera, ShieldAlert } from 'lucide-react'
import { ChannelBadge, StatusPill } from '@/components/Ui'
import {
  disconnectInstagram,
  fetchChamaConfig,
  fetchConnection,
  fetchReplyLogs,
  oauthStartUrl,
  syncAutomations,
  type ChamaConfig,
  type ChamaConnection,
} from '@/lib/api'
import { CHANNEL_LABEL } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'

export function ChannelsPage() {
  const { state, toggleChannel } = useChama()
  const [params, setParams] = useSearchParams()
  const [config, setConfig] = useState<ChamaConfig | null>(null)
  const [ig, setIg] = useState<ChamaConnection | null>(null)
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([])
  const [busy, setBusy] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      const [c, conn, l] = await Promise.all([
        fetchChamaConfig(),
        fetchConnection(),
        fetchReplyLogs().catch(() => ({ items: [] })),
      ])
      setConfig(c)
      setIg(conn)
      setLogs(l.items || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao carregar API')
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  useEffect(() => {
    const igStatus = params.get('ig')
    if (!igStatus) return
    if (igStatus === 'connected') {
      setBanner(`Instagram conectado: @${params.get('user') || 'conta'}`)
      void refresh()
      void syncAutomations(
        state.automations.map((a) => ({
          id: a.id,
          name: a.name,
          trigger: a.trigger,
          active: a.active,
          matches: a.matches,
          replyText:
            state.flows.find((f) => f.id === a.flowId)?.nodes.find((n) => n.type === 'message')
              ?.content ||
            'Oi! Vi seu comentário 🔥 Te chamei no Direct com o material.',
        })),
      ).catch(() => undefined)
    } else if (igStatus === 'error') {
      setError(params.get('reason') || 'Falha ao conectar Instagram')
    }
    setParams({}, { replace: true })
  }, [params, setParams, state.automations, state.flows])

  async function connectInstagram() {
    setBusy(true)
    setError(null)
    try {
      // Sync current keyword automations before OAuth
      await syncAutomations(
        state.automations.map((a) => ({
          id: a.id,
          name: a.name,
          trigger: a.trigger,
          active: a.active,
          matches: a.matches,
          replyText:
            state.flows.find((f) => f.id === a.flowId)?.nodes.find((n) => n.type === 'message')
              ?.content ||
            'Oi! Vi seu comentário 🔥 Te chamei no Direct com o material.',
        })),
      )
    } catch {
      // still allow oauth if sync fails (e.g. first connect)
    }
    window.location.href = oauthStartUrl()
  }

  async function onDisconnectIg() {
    setBusy(true)
    try {
      await disconnectInstagram()
      setBanner('Instagram desconectado')
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao desconectar')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Canais</p>
        <h1 className="font-display text-3xl font-bold">Conexões</h1>
        <p className="text-sm text-mist">
          Instagram ao vivo via Meta Graph API — comentário com palavra-chave vira DM automática
        </p>
      </div>

      {banner ? (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-signal">
          {banner}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-flame/30 bg-flame/10 px-4 py-3 text-sm text-flame">
          {error}
        </div>
      ) : null}

      {!config?.metaConfigured ? (
        <div className="rounded-2xl border border-ember/40 bg-ember/10 p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
            <div className="space-y-2 text-sm">
              <p className="font-display text-lg font-bold text-paper">
                Falta configurar o App Meta
              </p>
              <p className="text-mist">
                Sem <code className="text-ember">CHAMA_META_APP_ID</code>,{' '}
                <code className="text-ember">CHAMA_META_APP_SECRET</code> e{' '}
                <code className="text-ember">CHAMA_META_VERIFY_TOKEN</code> na Vercel, o OAuth
                real não inicia. Crie o app em{' '}
                <a
                  className="text-ember underline"
                  href="https://developers.facebook.com/apps"
                  target="_blank"
                  rel="noreferrer"
                >
                  developers.facebook.com
                </a>
                .
              </p>
              <ul className="list-disc space-y-1 pl-5 text-mist">
                <li>
                  Redirect OAuth:{' '}
                  <code className="text-paper">
                    {config?.setup.redirectUri || 'https://blckbox.vercel.app/api/chama/oauth/callback'}
                  </code>
                </li>
                <li>
                  Webhook:{' '}
                  <code className="text-paper">
                    {config?.setup.webhookUrl || 'https://blckbox.vercel.app/api/chama/webhook'}
                  </code>
                </li>
                <li>Instagram Professional ligado a uma Página do Facebook</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-line bg-abyss/80 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Instagram (ao vivo)</h2>
              <p className="mt-1 text-sm text-mist">
                {ig?.connected
                  ? `@${ig.igUsername} · Page ${ig.pageName}`
                  : 'Conecte sua conta Professional para responder comentários no Direct'}
              </p>
              {ig?.connected ? (
                <p className="mt-1 text-xs text-mist">
                  Webhook: {ig.webhookSubscribed ? 'inscrito' : 'pendente — confira o App Meta'}
                </p>
              ) : null}
            </div>
          </div>
          <StatusPill status={ig?.connected ? 'connected' : 'draft'} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {ig?.connected ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onDisconnectIg()}
              className="rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-mist hover:border-flame hover:text-flame"
            >
              Desconectar Instagram
            </button>
          ) : (
            <button
              type="button"
              disabled={busy || config?.metaConfigured === false}
              onClick={() => void connectInstagram()}
              className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night hover:bg-flameHot disabled:opacity-50"
            >
              <ExternalLink className="h-4 w-4" />
              Conectar Instagram com Meta
            </button>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-mist hover:text-paper"
          >
            Atualizar status
          </button>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="rounded-2xl border border-line bg-abyss/80 p-4">
          <h3 className="font-display text-lg font-bold">Últimas respostas automáticas</h3>
          <ul className="mt-3 divide-y divide-line">
            {logs.slice(0, 8).map((l) => (
              <li key={String(l.id)} className="flex items-start justify-between gap-3 py-2 text-sm">
                <div>
                  <p className="font-medium">
                    {String(l.fromUsername || 'comentário')} · “{String(l.commentText)}”
                  </p>
                  <p className="text-xs text-mist">{String(l.detail || l.status)}</p>
                </div>
                <StatusPill status={String(l.status) === 'sent' ? 'sent' : 'draft'} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.channels
          .filter((c) => c.channel !== 'instagram')
          .map((c) => (
            <div key={c.channel} className="rounded-2xl border border-line bg-abyss/80 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <ChannelBadge channel={c.channel} />
                  <h3 className="mt-3 font-display text-xl font-bold">
                    {CHANNEL_LABEL[c.channel]}
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    {c.connected ? c.accountName || 'Conta conectada' : 'Demo local (em breve API)'}
                  </p>
                </div>
                <StatusPill status={c.connected ? 'connected' : 'draft'} />
              </div>
              <button
                type="button"
                onClick={() => toggleChannel(c.channel)}
                className={`mt-5 w-full rounded-xl py-2.5 text-sm font-bold ${
                  c.connected
                    ? 'border border-line text-mist hover:border-flame hover:text-flame'
                    : 'bg-slateDeep text-paper hover:bg-line'
                }`}
              >
                {c.connected ? 'Desconectar (demo)' : 'Simular conexão'}
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
