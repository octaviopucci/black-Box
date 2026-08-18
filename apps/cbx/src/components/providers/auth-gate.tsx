'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ROUTES } from '@/constants/brand'
import { useAppStore } from '@/stores/app-store'

const apiEnabled = process.env.NEXT_PUBLIC_USE_API === '1'

function normalize(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

const PUBLIC_PATHS = new Set<string>([
  ROUTES.login,
  ROUTES.cadastro,
  ROUTES.esqueciSenha,
  ROUTES.splash,
  ROUTES.onboarding,
  ROUTES.termos,
  ROUTES.privacidade,
])

function AuthGateApi({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const login = useAppStore((s) => s.login)
  const logout = useAppStore((s) => s.logout)
  const session = useSession()

  useEffect(() => {
    if (session.status === 'authenticated') {
      login()
      return
    }
    if (session.status !== 'unauthenticated') return
    logout()
    const path = normalize(pathname || '/')
    if (PUBLIC_PATHS.has(path)) return
    router.replace(`${ROUTES.login}?callbackUrl=${encodeURIComponent(pathname || '/')}`)
  }, [session.status, pathname, router, login, logout])

  return <>{children}</>
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  if (!apiEnabled) return <>{children}</>
  return <AuthGateApi>{children}</AuthGateApi>
}
