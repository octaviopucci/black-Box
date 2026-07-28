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
import loginBg from '@/assets/login-luxury-cars.jpg'
import { cn } from '@/utils'

const easeLux = [0.16, 1, 0.3, 1] as const

/** Letras partem espalhadas e se juntam no centro — uma linha só, sem quebra. */
function AssemblingLine({
  text,
  className,
  delay = 0,
  spread = 36,
}: {
  text: string
  className?: string
  delay?: number
  spread?: number
}) {
  const chars = Array.from(text)
  const mid = (chars.length - 1) / 2

  return (
    <span className={cn('inline-flex max-w-full items-baseline justify-center whitespace-nowrap', className)}>
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => {
        const fromCenter = i - mid
        return (
          <motion.span
            key={`${text}-${i}-${ch}`}
            aria-hidden
            className="inline-block will-change-transform"
            style={{ minWidth: ch === ' ' ? '0.32em' : undefined }}
            initial={{
              opacity: 0,
              x: fromCenter * spread,
              y: 12,
              filter: 'blur(10px)',
              scale: 1.2,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
            }}
            transition={{
              duration: 1.05,
              delay: delay + Math.abs(fromCenter) * 0.045,
              ease: easeLux,
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        )
      })}
    </span>
  )
}

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
      await new Promise((r) => setTimeout(r, 420))
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <Toast />

      {/* Cinematic background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ scale: 1.12, opacity: 0.65 }}
        animate={{
          scale: leaving ? 1.16 : 1.02,
          opacity: leaving ? 0.35 : 1,
        }}
        transition={{
          scale: { duration: leaving ? 0.45 : 14, ease: leaving ? 'easeOut' : 'linear' },
          opacity: { duration: leaving ? 0.4 : 1.4, ease: easeLux },
        }}
      >
        <img
          src={loginBg}
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-black/72" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/88" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.22)_0%,transparent_55%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0.45] }}
        transition={{ duration: 2.2, times: [0, 0.45, 1], ease: easeLux }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md"
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -12 : 0, filter: leaving ? 'blur(6px)' : 'blur(0px)' }}
        transition={{ duration: 0.4, ease: easeLux }}
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: easeLux }}
          >
            <MacielLogo className="justify-center" />
          </motion.div>

          <h1 className="relative mt-8 w-full text-white">
            <AssemblingLine
              text="MACIEL MOTORS"
              delay={0.25}
              spread={42}
              className="w-full font-display text-[clamp(1.55rem,6.2vw,2.65rem)] font-bold leading-none tracking-[0.14em]"
            />

            {/* Linha cromada que se fecha sob a marca */}
            <motion.span
              className="mx-auto mt-5 block h-px origin-center bg-gradient-to-r from-transparent via-white/70 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.7, ease: easeLux }}
            />

            <motion.span
              className="mt-4 block overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.4 }}
            >
              <AssemblingLine
                text="GESTOR"
                delay={1.3}
                spread={22}
                className="w-full font-display text-[clamp(0.72rem,2.6vw,0.95rem)] font-semibold tracking-[0.48em] text-white/60"
              />
            </motion.span>

            {/* Flash de luz passando na marca */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-[-10%] top-0 h-14 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ x: '-60%', opacity: 0 }}
              animate={{ x: '60%', opacity: [0, 1, 0] }}
              transition={{ delay: 1.05, duration: 0.85, ease: 'easeInOut' }}
            />
          </h1>

          <motion.p
            className="mt-5 text-sm tracking-wide text-white/40"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.65, duration: 0.55, ease: easeLux }}
          >
            Gestão profissional de estoque
          </motion.p>
        </div>

        <motion.form
          onSubmit={onSubmit}
          className="relative space-y-4 border border-white/10 bg-black/50 p-6 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 1.75, duration: 0.75, ease: easeLux }}
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
