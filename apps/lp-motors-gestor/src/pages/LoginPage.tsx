import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--lp-steel) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--lp-steel) 10%, transparent) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <LpLogo size="lg" className="mx-auto justify-center" />
          <h1 className="section-title mt-6">{brandFullName(settings)}</h1>
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
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <Checkbox label="Lembrar acesso" checked={remember} onChange={(e) => setRemember(e.target.checked)} />

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Entrar
          </Button>

          <p className="rounded-lg bg-lp-mist/80 px-3 py-2 text-center text-xs text-lp-steel">
            Acesso demo: <strong className="text-lp-ink">admin</strong> /{' '}
            <strong className="text-lp-ink">LPMotors123</strong>
          </p>
        </form>
      </div>
    </div>
  )
}
