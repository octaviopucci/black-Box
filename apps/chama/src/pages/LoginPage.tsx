import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { useChama } from '@/store/ChamaContext'

export function LoginPage() {
  const { state, login } = useChama()
  const navigate = useNavigate()
  const [email, setEmail] = useState('ana@chama.app')
  const [name, setName] = useState('Ana Silva')

  if (state.user) return <Navigate to="/app" replace />

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login(email, name)
    navigate('/app')
  }

  return (
    <div className="grid min-h-screen bg-hero lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-grain opacity-10" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo size="lg" />
          <div>
            <h1 className="font-display text-5xl font-extrabold leading-tight">
              Entre e
              <span className="text-flame"> chame</span>
              <br />
              sua audiência.
            </h1>
            <p className="mt-4 max-w-md text-mist">
              Demo com dados reais simulados. Flows, inbox, broadcasts e
              automações prontos para explorar.
            </p>
          </div>
          <p className="text-xs text-mist">Login demo — qualquer senha funciona.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-3xl border border-line bg-abyss/90 p-7 shadow-soft backdrop-blur"
        >
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          <h2 className="font-display text-2xl font-bold">Entrar no chama</h2>
          <p className="mt-1 text-sm text-mist">Use o acesso demo ou seus dados.</p>

          <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-mist">
            Nome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-night px-3 py-2.5 text-sm text-paper outline-none ring-flame focus:ring-2"
            />
          </label>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-mist">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-night px-3 py-2.5 text-sm text-paper outline-none ring-flame focus:ring-2"
            />
          </label>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-mist">
            Senha
            <input
              type="password"
              defaultValue="chama123"
              className="mt-2 w-full rounded-xl border border-line bg-night px-3 py-2.5 text-sm text-paper outline-none ring-flame focus:ring-2"
            />
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-flame py-3 text-sm font-bold text-night shadow-glow transition hover:bg-flameHot"
          >
            Entrar no painel
          </button>
          <p className="mt-4 text-center text-sm text-mist">
            <Link to="/" className="text-ember hover:underline">
              Voltar ao início
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
