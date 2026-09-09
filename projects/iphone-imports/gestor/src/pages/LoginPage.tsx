import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Apple } from 'lucide-react'
import { cloudSync } from '@/services/sync'
import { setSession } from '@/services/database'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [store, setStore] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await cloudSync.login(username, password, store || undefined)
      if (res.session) {
        setSession(res.session)
        navigate('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-4">
        <div className="flex items-center gap-2">
          <Apple className="h-8 w-8 text-brand-yellow" />
          <h1 className="text-xl font-black">Gestor iPhone Imports</h1>
        </div>
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <input className="input" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className="input" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="input" placeholder="Código da loja (se tiver várias)" value={store} onChange={(e) => setStore(e.target.value)} />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-center text-sm text-brand-gray">
          Não tem conta? <Link to="/cadastro" className="text-brand-yellow">Cadastrar loja</Link>
        </p>
      </form>
    </div>
  )
}
