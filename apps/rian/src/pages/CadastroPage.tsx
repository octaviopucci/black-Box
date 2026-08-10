import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { affiliate, brand } from '@/data/site'

const STORAGE_KEY = 'rian-base-lead'

export function CadastroPage() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nome.trim()) {
      setError('Informe seu nome.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.')
      return
    }
    if (senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const lead = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      affiliate: affiliate.slug,
      afid: affiliate.afid,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lead))
    } catch {
      /* ignore quota */
    }

    const q = new URLSearchParams({ email: lead.email })
    navigate(`/planos?${q.toString()}`)
  }

  return (
    <div className="min-h-dvh bg-ink px-4 py-8 text-paper sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/quiz" className="opacity-90">
            <img src={brand.logo} alt="BASE" className="h-7 w-auto" draggable={false} />
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            {affiliate.label}
          </p>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          Use o mesmo e-mail quando pagar na Kiwify. O sistema libera o app automaticamente quando a
          compra constar como aprovada.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ash">Nome</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-line bg-[#111] px-4 py-3 text-sm text-paper outline-none transition focus:border-signal"
              placeholder="Como você se chama"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ash">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-line bg-[#111] px-4 py-3 text-sm text-paper outline-none transition focus:border-signal"
              placeholder="seu@email.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ash">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-line bg-[#111] px-4 py-3 text-sm text-paper outline-none transition focus:border-signal"
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          {error ? <p className="text-sm text-signal">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-signal py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-signalHot disabled:opacity-70"
          >
            Continuar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ash">
          Já tenho conta?{' '}
          <Link to="/planos" className="text-paper underline-offset-2 hover:underline">
            Ir para planos
          </Link>
        </p>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-ash">{brand.disclaimer}</p>
      </div>
    </div>
  )
}
