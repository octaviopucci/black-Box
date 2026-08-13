import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { Avatar, ChannelBadge, EmptyState, StatusPill } from '@/components/Ui'
import { formatRelative, uid } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'
import type { Channel, Contact } from '@/types'

export function ContactsPage() {
  const { state, upsertContact, deleteContact } = useChama()
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    channel: 'instagram' as Channel,
    email: '',
    phone: '',
    tags: 'lead',
  })

  const allTags = useMemo(() => {
    const set = new Set<string>()
    state.contacts.forEach((c) => c.tags.forEach((t) => set.add(t)))
    return [...set]
  }, [state.contacts])

  const filtered = state.contacts.filter((c) => {
    const matchQ =
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.email?.toLowerCase().includes(q.toLowerCase()) ||
      c.phone?.includes(q)
    const matchTag = tag === 'all' || c.tags.includes(tag)
    return matchQ && matchTag
  })

  function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    const contact: Contact = {
      id: uid('c'),
      name: form.name.trim(),
      avatar: form.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      channel: form.channel,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      email: form.email || undefined,
      phone: form.phone || undefined,
      status: 'active',
      lastSeen: new Date().toISOString(),
      customFields: {},
    }
    upsertContact(contact)
    setShowForm(false)
    setForm({ name: '', channel: 'instagram', email: '', phone: '', tags: 'lead' })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Contatos</p>
          <h1 className="font-display text-3xl font-bold">Audiência</h1>
          <p className="text-sm text-mist">{state.contacts.length} contatos na base</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night hover:bg-flameHot"
        >
          <Plus className="h-4 w-4" />
          Novo contato
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-2xl border border-line bg-abyss/80 p-4 md:grid-cols-2"
        >
          <input
            required
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none ring-flame focus:ring-2"
          />
          <select
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value as Channel })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          >
            {(['instagram', 'whatsapp', 'messenger', 'telegram', 'email', 'sms'] as Channel[]).map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ),
            )}
          </select>
          <input
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <input
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <input
            placeholder="Tags (vírgula)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none md:col-span-2"
          />
          <button
            type="submit"
            className="rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night md:col-span-2"
          >
            Salvar contato
          </button>
        </form>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nome, e-mail, telefone…"
            className="w-full rounded-xl border border-line bg-abyss py-2.5 pl-9 pr-3 text-sm outline-none ring-flame focus:ring-2"
          />
        </div>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-xl border border-line bg-abyss px-3 py-2.5 text-sm"
        >
          <option value="all">Todas as tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum contato" description="Ajuste a busca ou adicione um novo." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-abyss/80">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-mist">
              <tr>
                <th className="px-4 py-3 font-semibold">Contato</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Canal</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Tags</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Status</th>
                <th className="px-4 py-3 font-semibold">Visto</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slateDeep/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar label={c.avatar} size="sm" />
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-mist">{c.email || c.phone || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <ChannelBadge channel={c.channel} />
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-line/80 px-2 py-0.5 text-[10px] font-semibold text-mist"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-mist">{formatRelative(c.lastSeen)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteContact(c.id)}
                      className="rounded-lg p-2 text-mist hover:bg-flame/10 hover:text-flame"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
