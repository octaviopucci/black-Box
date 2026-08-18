import { useState, type FormEvent } from 'react'
import { Link2, Plus, QrCode, SquareCode } from 'lucide-react'
import { StatusPill } from '@/components/Ui'
import { useChama } from '@/store/ChamaContext'
import type { GrowthTool } from '@/types'

const icons = {
  link: Link2,
  qr: QrCode,
  widget: SquareCode,
  ref: Link2,
}

export function GrowthPage() {
  const { state, toggleGrowth, addGrowthTool } = useChama()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    name: '',
    url: 'https://chama.app/l/',
    type: 'link' as GrowthTool['type'],
  })

  function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.url.trim()) return
    addGrowthTool({
      name: form.name.trim(),
      url: form.url.trim(),
      type: form.type,
      active: true,
    })
    setShow(false)
    setForm({ name: '', url: 'https://chama.app/l/', type: 'link' })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Growth</p>
          <h1 className="font-display text-3xl font-bold">Ferramentas de crescimento</h1>
          <p className="text-sm text-mist">Links, QR codes, widgets e referências</p>
        </div>
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night"
        >
          <Plus className="h-4 w-4" />
          Nova ferramenta
        </button>
      </div>

      {show ? (
        <form
          onSubmit={onCreate}
          className="grid gap-3 rounded-2xl border border-line bg-abyss/80 p-4 md:grid-cols-3"
        >
          <input
            required
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <input
            required
            placeholder="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm outline-none"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as GrowthTool['type'] })}
            className="rounded-xl border border-line bg-night px-3 py-2.5 text-sm"
          >
            {(['link', 'qr', 'widget', 'ref'] as const).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-flame py-2.5 text-sm font-bold text-night md:col-span-3"
          >
            Criar
          </button>
        </form>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {state.growthTools.map((g) => {
          const Icon = icons[g.type]
          return (
            <div key={g.id} className="rounded-2xl border border-line bg-abyss/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-flame/15 text-flame">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{g.name}</h3>
                    <p className="text-xs text-mist">{g.url}</p>
                  </div>
                </div>
                <button type="button" onClick={() => toggleGrowth(g.id)}>
                  <StatusPill status={g.active ? 'active' : 'paused'} />
                </button>
              </div>
              <p className="mt-4 text-sm text-mist">
                <span className="font-display text-2xl font-bold text-paper">
                  {g.clicks.toLocaleString('pt-BR')}
                </span>{' '}
                cliques
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
