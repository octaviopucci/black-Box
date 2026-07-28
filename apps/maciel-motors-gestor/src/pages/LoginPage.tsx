import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { MacielLogo } from '@/components/common/MacielLogo'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { isInteractive } from '@/config/variant'

const ease = [0.22, 1, 0.36, 1] as const
const bgUrl = `${import.meta.env.BASE_URL}login-luxury-cars.jpg`

function ClassicLogin() {
  const { login, toast } = useApp()
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
        </form>
      </motion.div>
    </div>
  )
}

function InteractiveLogin() {
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password, remember)
      setLeaving(true)
      await new Promise((r) => setTimeout(r, 380))
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <Toast />

      {/* Full-bleed luxury cars + black veil */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: leaving ? 1.1 : 1 }}
        transition={{ duration: leaving ? 0.4 : 12, ease: leaving ? 'easeOut' : 'linear' }}
      >
        <img
          src={bgUrl}
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-black/78" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/85" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -8 : 0 }}
        transition={{ duration: leaving ? 0.35 : 0.7, ease }}
      >
        <motion.div
          className="mb-9 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
        >
          <MacielLogo className="justify-center" />

          {/* Brand hierarchy — intentional lines, never mid-word wrap */}
          <h1 className="mt-7 text-white">
            <span className="block font-display text-[clamp(1.75rem,7vw,2.75rem)] font-bold leading-none tracking-[0.18em] whitespace-nowrap">
              MACIEL MOTORS
            </span>
            <span className="mt-2 block font-display text-[clamp(0.7rem,2.8vw,0.95rem)] font-semibold tracking-[0.42em] text-white/55 whitespace-nowrap">
              GESTOR
            </span>
          </h1>

          <p className="mt-4 text-sm text-white/45">Gestão profissional de estoque</p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="space-y-4 border border-white/10 bg-black/45 p-6 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.22 }}
        >
          <label className="block">
            <span className="label-field">Usuário</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                className="input-field border-white/15 bg-black/40 pl-10"
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
                className="input-field border-white/15 bg-black/40 pl-10 pr-10"
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
        </motion.form>
      </motion.div>
    </div>
  )
}

export function LoginPage() {
  return isInteractive ? <InteractiveLogin /> : <ClassicLogin />
}
