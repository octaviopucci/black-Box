import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { LpLogo } from '@/components/common/LpLogo'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { brandFullName } from '@/utils/brand'

export function LoginPage() {
  const { login, toast, settings } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password, remember)
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <Toast />
      <div className="pointer-events-none absolute inset-0 bg-lp-hero" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--lp-steel) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--lp-steel) 12%, transparent) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8 text-center">
          <LpLogo size="lg" className="mx-auto justify-center" />
          <h1 className="mt-6 font-cinema text-4xl text-lp-ink sm:text-5xl">
            {brandFullName(settings)}
          </h1>
          <p className="section-sub">
            {settings.slogan || 'Gestão profissional de estoque automotivo'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="panel space-y-4 p-6 sm:p-8">
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
        </form>
      </motion.div>
    </div>
  )
}
