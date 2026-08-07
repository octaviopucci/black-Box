'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { BRAND, ROUTES } from '@/constants/brand'
import { useAppStore } from '@/stores/app-store'
import { BrandLogo } from '@/components/brand/brand-assets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeIn } from '@/animations/variants'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const login = useAppStore((s) => s.login)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    const useApi = process.env.NEXT_PUBLIC_USE_API === '1'
    if (useApi) {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (res?.error) {
        toast.error('E-mail ou senha inválidos')
        return
      }
      login()
      router.push(ROUTES.home)
      return
    }
    // Demo estático (sem banco)
    login()
    router.push(ROUTES.home)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 py-12">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex justify-center rounded-2xl bg-black p-2 shadow-lg shadow-primary/20">
            <BrandLogo size={96} href={null} priority className="rounded-xl" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Entrar no {BRAND.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{BRAND.tagline}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail />}
            autoComplete="email"
            {...register('email', { required: true })}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock />}
            autoComplete="current-password"
            {...register('password', { required: true })}
          />

          <div className="flex justify-end">
            <Link href={ROUTES.esqueciSenha} className="text-sm font-medium text-primary hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <Link href={ROUTES.cadastro} className="font-semibold text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
