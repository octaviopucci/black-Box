import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { MacielLogo } from '@/components/common/MacielLogo'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'

export function LoginPage() {
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <Toast />
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-zinc-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <MacielLogo />
          <h1 className="mt-6 font-display text-3xl font-bold tracking-[0.12em] text-white">
            MACIEL MOTORS GESTOR
          </h1>
          <p className="mt-2 text-sm text-white/50">Sistema profissional de gestão automotiva</p>
        </div>

        <form onSubmit={onSubmit} className="panel space-y-4 p-6 sm:p-8">
          <label className="block">
            <span className="label-field">Usuário</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
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
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <Checkbox
            label="Lembrar acesso"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Entrar
          </Button>

          <p className="text-center text-xs text-white/35">
            Acesso inicial: <span className="text-white/60">admin / admin123</span>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
