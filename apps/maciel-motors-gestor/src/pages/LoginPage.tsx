import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { MacielLogo } from '@/components/common/MacielLogo'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { isInteractive } from '@/config/variant'

const brandTitle = 'MACIEL MOTORS GESTOR'.split('')

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
  const [phase, setPhase] = useState<'enter' | 'ready' | 'leaving'>('enter')

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })
  const orbX = useTransform(springX, [0, 1], [-40, 40])
  const orbY = useTransform(springY, [0, 1], [-30, 30])
  const glowX = useTransform(springX, [0, 1], ['20%', '80%'])
  const glowY = useTransform(springY, [0, 1], ['25%', '70%'])

  useEffect(() => {
    const t = window.setTimeout(() => setPhase('ready'), 900)
    return () => window.clearTimeout(t)
  }, [])

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password, remember)
      setPhase('leaving')
      await new Promise((r) => setTimeout(r, 520))
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error')
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      onPointerMove={onPointerMove}
    >
      <Toast />

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[#090909]" />
      <motion.div
        className="pointer-events-none absolute h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/25 blur-[110px]"
        style={{ left: glowX, top: glowY }}
      />
      <motion.div
        className="pointer-events-none absolute -left-10 top-16 h-72 w-72 rounded-full bg-zinc-400/10 blur-3xl"
        style={{ x: orbX, y: orbY }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-8 h-96 w-96 rounded-full bg-brand-red/15 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <AnimatePresence mode="wait">
        <motion.div
          key={phase === 'leaving' ? 'leaving' : 'stage'}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'leaving' ? 0 : 1, scale: phase === 'leaving' ? 1.04 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="mb-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.05 }}
            >
              <MacielLogo className="justify-center" />
            </motion.div>

            <h1 className="mt-7 font-display text-3xl font-bold tracking-[0.14em] text-white sm:text-4xl">
              <span className="sr-only">MACIEL MOTORS GESTOR</span>
              <span aria-hidden className="inline-flex flex-wrap justify-center">
                {brandTitle.map((ch, i) => (
                  <motion.span
                    key={`${ch}-${i}`}
                    className={ch === ' ' ? 'inline-block w-2 sm:w-3' : 'inline-block'}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.028, duration: 0.35 }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              className="mt-3 max-w-sm text-sm text-white/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              Experiência interativa · mesma gestão, entrada com mais presença
            </motion.p>

            <motion.span
              className="mt-4 inline-flex items-center rounded-full border border-brand-red/40 bg-brand-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              Versão X · Interativa
            </motion.span>
          </div>

          <motion.form
            onSubmit={onSubmit}
            className="relative space-y-4 overflow-hidden rounded-2xl border border-white/10 bg-brand-graphite/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: phase === 'ready' || phase === 'enter' ? 1 : 0, y: 0 }}
            transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/70 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            />

            <motion.label
              className="block"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
            >
              <span className="label-field">Usuário</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  className="input-field pl-10 transition duration-300 focus:shadow-[0_0_0_3px_rgba(196,30,58,0.18)]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </motion.label>

            <motion.label
              className="block"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
            >
              <span className="label-field">Senha</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  className="input-field pl-10 pr-10 transition duration-300 focus:shadow-[0_0_0_3px_rgba(196,30,58,0.18)]"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.label>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
            >
              <Checkbox
                label="Lembrar acesso"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Entrar
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function LoginPage() {
  return isInteractive ? <InteractiveLogin /> : <ClassicLogin />
}
