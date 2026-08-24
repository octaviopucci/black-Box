import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Eye, EyeOff, Lock, MapPin, Phone, User } from 'lucide-react'
import { LpLogo } from '@/components/common/LpLogo'
import { AuthScreenShell, authFadeUp } from '@/components/common/AuthScreenShell'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'

/** Letras/números sem acento — acentos e espaços viram formato válido automaticamente. */
function normalizeUsername(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 32)
}

export function RegisterPage() {
  const { registerStore, toast } = useApp()
  const navigate = useNavigate()
  const [storeName, setStoreName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loginUser = normalizeUsername(username)
    if (loginUser.length < 3) {
      toast('Usuário: use pelo menos 3 letras ou números (ex.: joao ou silva.motors).', 'error')
      return
    }
    if (password !== confirm) {
      toast('As senhas não coincidem.', 'error')
      return
    }
    setLoading(true)
    try {
      const slug = await registerStore({
        storeName,
        ownerName,
        username: loginUser,
        password,
        city,
        phone,
      })
      toast(`Guarde o código da loja: ${slug}`, 'info')
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no cadastro', 'error')
      setLoading(false)
    }
  }

  return (
    <AuthScreenShell className="py-16">
      <Toast />

      <motion.div className="mb-8 text-center" variants={authFadeUp}>
        <LpLogo size="lg" className="mx-auto justify-center" />
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-lp-accent/90">
          Nova concessionária
        </p>
        <h1 className="mt-3 font-cinema text-4xl text-lp-ink sm:text-5xl">Abrir minha loja</h1>
        <p className="section-sub mt-2">Cada loja ganha o próprio sistema, isolado das outras.</p>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        className="panel space-y-4 border-white/10 p-6 shadow-lift sm:p-8"
        variants={authFadeUp}
      >
        <label className="block">
          <span className="label-field">Nome da loja</span>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
            <input
              className="input-field pl-10"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex.: Silva Motors"
              required
              minLength={2}
            />
          </div>
        </label>

        <label className="block">
          <span className="label-field">Seu nome</span>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
            <input
              className="input-field pl-10"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              minLength={2}
            />
          </div>
        </label>

        <label className="block">
          <span className="label-field">Usuário (admin da loja)</span>
          <input
            className="input-field"
            value={username}
            onChange={(e) => setUsername(normalizeUsername(e.target.value))}
            autoComplete="username"
            placeholder="ex.: joao ou silva.motors"
            required
            minLength={3}
            maxLength={32}
          />
          <p className="mt-1.5 text-xs text-lp-steel">
            Letras, números, ponto, hífen ou underline. Acentos viram letra simples (João → joao).
          </p>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label-field">Senha</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
              <input
                className="input-field pl-10 pr-10"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
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
            <span className="label-field">Confirmar senha</span>
            <input
              className="input-field"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label-field">Cidade (opcional)</span>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
              <input
                className="input-field pl-10"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </label>
          <label className="block">
            <span className="label-field">WhatsApp (opcional)</span>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
              <input
                className="input-field pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </label>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Criar minha loja
        </Button>

        <p className="text-center text-sm text-lp-steel">
          Já tem loja?{' '}
          <Link className="font-semibold text-lp-accent" to="/login">
            Entrar
          </Link>
        </p>
      </motion.form>
    </AuthScreenShell>
  )
}
