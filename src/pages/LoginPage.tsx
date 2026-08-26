import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { LpLogo } from '@/components/common/LpLogo'
import { AuthScreenShell, authFadeUp } from '@/components/common/AuthScreenShell'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { brandFullName } from '@/utils/brand'
import { normalizeUsername } from '@/utils/authUsername'

export function LoginPage() {
  const { login, toast, settings } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [store, setStore] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(normalizeUsername(username), password, remember, store.trim() || undefined)
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error')
      setLoading(false)
    }
  }

  return (
    <AuthScreenShell>
      <Toast />

      <motion.div className="mb-8 text-center" variants={authFadeUp}>
        <LpLogo size="lg" className="mx-auto justify-center" />
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-lp-accent/90">
          Showroom digital
        </p>
        <h1 className="mt-3 font-cinema text-4xl text-lp-ink sm:text-5xl">
          {brandFullName(settings)}
        </h1>
        <p className="section-sub mt-2">
          {settings.slogan || 'Cada loja com o próprio sistema'}
        </p>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        className="panel space-y-4 border-white/10 p-6 shadow-lift sm:p-8"
        variants={authFadeUp}
      >
        <label className="block">
          <span className="label-field">Usuário</span>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
            <input
              className="input-field pl-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="label-field">Senha</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
            <input
              className="input-field pl-10 pr-10"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lp-steel hover:text-lp-ink"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="label-field">Código da loja</span>
          <input
            className="input-field"
            value={store}
            onChange={(e) => setStore(e.target.value.toLowerCase().trim())}
            placeholder="ex.: silva-motors"
            autoComplete="organization"
          />
          <p className="mt-1.5 text-xs text-lp-steel">
            Obrigatório em outro celular ou aba anônima. Veja em Configurações → Nuvem.
          </p>
        </label>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Lembrar acesso"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Entrar no showroom
        </Button>

        <p className="text-center text-sm text-lp-steel">
          Primeira vez?{' '}
          <Link className="font-semibold text-lp-accent" to="/cadastro">
            Cadastrar minha loja
          </Link>
        </p>
      </motion.form>
    </AuthScreenShell>
  )
}
