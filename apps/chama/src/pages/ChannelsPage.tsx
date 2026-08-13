import { ChannelBadge, StatusPill } from '@/components/Ui'
import { CHANNEL_LABEL } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'

export function ChannelsPage() {
  const { state, toggleChannel } = useChama()

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Canais</p>
        <h1 className="font-display text-3xl font-bold">Conexões</h1>
        <p className="text-sm text-mist">
          Conecte Instagram, WhatsApp, Messenger, Telegram, E-mail e SMS
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.channels.map((c) => (
          <div key={c.channel} className="rounded-2xl border border-line bg-abyss/80 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <ChannelBadge channel={c.channel} />
                <h3 className="mt-3 font-display text-xl font-bold">
                  {CHANNEL_LABEL[c.channel]}
                </h3>
                <p className="mt-1 text-sm text-mist">
                  {c.connected
                    ? c.accountName || 'Conta conectada'
                    : 'Não conectado'}
                </p>
                {c.connected && c.followers != null ? (
                  <p className="mt-1 text-xs text-mist">
                    {c.followers.toLocaleString('pt-BR')} seguidores / contatos
                  </p>
                ) : null}
              </div>
              <StatusPill status={c.connected ? 'connected' : 'draft'} />
            </div>
            <button
              type="button"
              onClick={() => toggleChannel(c.channel)}
              className={`mt-5 w-full rounded-xl py-2.5 text-sm font-bold ${
                c.connected
                  ? 'border border-line text-mist hover:border-flame hover:text-flame'
                  : 'bg-flame text-night hover:bg-flameHot'
              }`}
            >
              {c.connected ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
