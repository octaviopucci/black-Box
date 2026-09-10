import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cloudSync } from '@/services/sync'
import { setSession } from '@/services/database'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    storeName: '',
    ownerName: '',
    username: '',
    password: '',
    phone: '',
    city: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await cloudSync.register(form)
      if (res.session) {
        setSession(res.session)
        setSlug(res.slug || '')
        navigate('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-3">
        <h1 className="text-xl font-black">Cadastrar loja</h1>
        {slug && <p className="text-sm text-brand-silver">Código da loja: {slug}</p>}
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        {(['storeName', 'ownerName', 'username', 'password', 'phone', 'city'] as const).map((field) => (
          <input
            key={field}
            className="input"
            type={field === 'password' ? 'password' : 'text'}
            placeholder={
              {
                storeName: 'Nome da loja',
                ownerName: 'Seu nome',
                username: 'Usuário de login',
                password: 'Senha (mín. 6)',
                phone: 'WhatsApp',
                city: 'Cidade',
              }[field]
            }
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required={field !== 'phone' && field !== 'city'}
          />
        ))}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Criando...' : 'Criar loja'}
        </button>
        <p className="text-center text-sm text-brand-gray">
          Já tem conta? <Link to="/login" className="text-brand-silver hover:text-brand-accent">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
