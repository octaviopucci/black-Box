import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Avatar, ChannelBadge, StatusPill } from '@/components/Ui'
import { formatRelative } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'

export function InboxPage() {
  const {
    state,
    sendMessage,
    markConversationRead,
    setConversationStatus,
  } = useChama()
  const sorted = useMemo(
    () =>
      [...state.conversations].sort(
        (a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt),
      ),
    [state.conversations],
  )
  const [selectedId, setSelectedId] = useState(sorted[0]?.id || '')
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all')

  useEffect(() => {
    if (!sorted.find((c) => c.id === selectedId) && sorted[0]) {
      setSelectedId(sorted[0].id)
    }
  }, [selectedId, sorted])

  const filtered = sorted.filter((c) => (filter === 'all' ? true : c.status === filter))
  const selected = state.conversations.find((c) => c.id === selectedId)
  const contact = state.contacts.find((c) => c.id === selected?.contactId)
  const messages = state.messages
    .filter((m) => m.conversationId === selectedId)
    .sort((a, b) => +new Date(a.at) - +new Date(b.at))

  useEffect(() => {
    if (selectedId) markConversationRead(selectedId)
  }, [selectedId, markConversationRead])

  function onSend(e: FormEvent) {
    e.preventDefault()
    if (!selectedId || !draft.trim()) return
    sendMessage(selectedId, draft, 'agent')
    setDraft('')
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Inbox</p>
        <h1 className="font-display text-3xl font-bold">Conversas ao vivo</h1>
      </div>

      <div className="grid h-[calc(100vh-11rem)] min-h-[520px] overflow-hidden rounded-2xl border border-line bg-abyss/80 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col border-r border-line">
          <div className="flex gap-1 border-b border-line p-2">
            {(['all', 'open', 'pending', 'closed'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase ${
                  filter === f ? 'bg-flame/15 text-flame' : 'text-mist hover:text-paper'
                }`}
              >
                {f === 'all' ? 'Todas' : f}
              </button>
            ))}
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.map((cv) => {
              const ct = state.contacts.find((c) => c.id === cv.contactId)
              return (
                <li key={cv.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(cv.id)}
                    className={`flex w-full items-start gap-3 border-b border-line px-3 py-3 text-left transition ${
                      selectedId === cv.id ? 'bg-slateDeep' : 'hover:bg-slateDeep/40'
                    }`}
                  >
                    <Avatar label={ct?.avatar || '?'} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{ct?.name}</p>
                        <span className="text-[10px] text-mist">
                          {formatRelative(cv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-mist">{cv.preview}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <ChannelBadge channel={cv.channel} compact />
                        {cv.unread > 0 ? (
                          <span className="rounded-full bg-flame px-1.5 text-[10px] font-bold text-night">
                            {cv.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col">
          {selected && contact ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar label={contact.avatar} />
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <div className="flex items-center gap-2">
                      <ChannelBadge channel={selected.channel} />
                      <StatusPill status={selected.status} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConversationStatus(selected.id, 'closed')}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-mist hover:text-signal"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Resolver
                  </button>
                  <button
                    type="button"
                    onClick={() => setConversationStatus(selected.id, 'open')}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-mist hover:text-paper"
                  >
                    Reabrir
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === 'contact' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        m.from === 'contact'
                          ? 'rounded-tl-md bg-slateDeep text-paper'
                          : m.from === 'bot'
                            ? 'rounded-tr-md border border-flame/30 bg-flame/10 text-paper'
                            : 'rounded-tr-md bg-flame text-night'
                      }`}
                    >
                      {m.from === 'bot' ? (
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-flame">
                          Bot
                        </p>
                      ) : null}
                      <p>{m.text}</p>
                      <p
                        className={`mt-1 text-[10px] ${m.from === 'agent' ? 'text-night/70' : 'text-mist'}`}
                      >
                        {formatRelative(m.at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={onSend} className="border-t border-line p-3">
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Escreva uma resposta…"
                    className="flex-1 rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none ring-flame focus:ring-2"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night hover:bg-flameHot"
                  >
                    <Send className="h-4 w-4" />
                    Enviar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-mist">
              Selecione uma conversa
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
