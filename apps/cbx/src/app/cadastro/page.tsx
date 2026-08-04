'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { BRAND, ROUTES } from '@/constants/brand'
import { useAppStore } from '@/stores/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeIn } from '@/animations/variants'

interface CadastroForm {
  name: string
  email: string
  phone: string
  password: string
}

export default function CadastroPage() {
  const router = useRouter()
  const login = useAppStore((s) => s.login)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CadastroForm>({
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const onSubmit = () => {
    login()
    router.push(ROUTES.home)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-accent/5 to-background px-4 py-12">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Criar conta no {BRAND.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Junte-se ao marketplace de {BRAND.city}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            leftIcon={<User />}
            autoComplete="name"
            {...register('name', { required: true })}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail />}
            autoComplete="email"
            {...register('email', { required: true })}
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="(15) 99999-9999"
            leftIcon={<Phone />}
            autoComplete="tel"
            {...register('phone', { required: true })}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            leftIcon={<Lock />}
            autoComplete="new-password"
            {...register('password', { required: true, minLength: 6 })}
          />

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link href={ROUTES.login} className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
