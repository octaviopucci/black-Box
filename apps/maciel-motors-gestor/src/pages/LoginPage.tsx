import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { MacielLogo } from '@/components/common/MacielLogo'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import loginBg from '@/assets/login-luxury-cars.jpg'

const lux = [0.16, 1, 0.3, 1] as const

function InteractiveLogin() {
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [locked, setLocked] = useState(false)
  const lockOnce = useRef(false)

  const triggerLock = () => {
    if (lockOnce.current) return
    lockOnce.current = true
    setLocked(true)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password, remember)
      setLeaving(true)
      await new Promise((r) => setTimeout(r, 450))
      navigate('/')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <Toast />

      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ scale: 1.2, opacity: 0.35 }}
        animate={{
          scale: leaving ? 1.26 : 1.05,
          opacity: leaving ? 0.2 : 1,
        }}
        transition={{
          opacity: { duration: 1.8, ease: lux },
          scale: { duration: leaving ? 0.5 : 18, ease: leaving ? 'easeOut' : 'linear' },
        }}
      >
        <img
          src={loginBg}
          alt=""
          className="h-full w-full object-cover object-[center_38%]"
          draggable={false}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-black/68" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/92" />

      {/* Impacto: vermelho + flash */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.55)_0%,transparent_52%)]"
        animate={{ opacity: locked ? [0, 1, 0.3] : 0 }}
        transition={{ duration: 1, times: [0, 0.18, 1], ease: lux }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        animate={{ opacity: locked ? [0, 0.22, 0] : 0 }}
        transition={{ duration: 0.5, times: [0, 0.12, 1] }}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        animate={{
          opacity: leaving ? 0 : 1,
          y: leaving ? -18 : 0,
          scale: leaving ? 1.04 : 1,
        }}
        transition={{ duration: 0.42, ease: lux }}
      >
        <div className="mb-11 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.65, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.05 }}
          >
            <MacielLogo className="justify-center scale-110" />
          </motion.div>

          <motion.h1
            className="relative mt-10 w-full text-white"
            animate={locked ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.55, ease: lux }}
          >
            {/* As duas palavras se encontram no centro */}
            <span className="flex items-baseline justify-center gap-[0.35em] overflow-visible whitespace-nowrap font-display text-[clamp(1.7rem,7.5vw,3.1rem)] font-bold leading-none tracking-[0.14em]">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ x: '-55vw', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 48,
                  damping: 12,
                  mass: 1.15,
                  delay: 0.4,
                }}
                onAnimationComplete={triggerLock}
              >
                MACIEL
              </motion.span>
              <motion.span
                className="inline-block will-change-transform"
                initial={{ x: '55vw', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 48,
                  damping: 12,
                  mass: 1.15,
                  delay: 0.4,
                }}
              >
                MOTORS
              </motion.span>
            </span>

            <motion.span
              className="mx-auto mt-6 block h-[2px] w-48 origin-center bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_24px_rgba(255,255,255,0.45)]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={locked ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: lux }}
            />

            <motion.span
              className="mt-5 block whitespace-nowrap font-display text-[clamp(0.78rem,3vw,1.05rem)] font-semibold uppercase text-white/70"
              initial={{ opacity: 0, letterSpacing: '1.6em', x: 12 }}
              animate={
                locked
                  ? { opacity: 1, letterSpacing: '0.58em', x: 0 }
                  : { opacity: 0, letterSpacing: '1.6em', x: 12 }
              }
              transition={{ duration: 1.05, ease: lux, delay: 0.08 }}
            >
              Gestor
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-5 text-sm tracking-[0.14em] text-white/40"
            initial={{ opacity: 0, y: 8 }}
            animate={locked ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.35, duration: 0.55 }}
          >
            Gestão profissional de estoque
          </motion.p>
        </div>

        <motion.form
          onSubmit={onSubmit}
          className="space-y-4 border border-white/12 bg-black/55 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-8"
          initial={{ opacity: 0, y: 48 }}
          animate={locked ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ delay: 0.5, duration: 0.85, ease: lux }}
        >
          <label className="block">
            <span className="label-field">Usuário</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                className="input-field border-white/15 bg-black/45 pl-10"
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
                className="input-field border-white/15 bg-black/45 pl-10 pr-10"
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
  // Mesma experiência no link estável e na variante X
  return <InteractiveLogin />
}
