'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/constants/brand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fadeIn, scaleIn } from '@/animations/variants'

interface RecoveryForm {
  email: string
}

export default function EsqueciSenhaPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RecoveryForm>({
    defaultValues: { email: '' },
  })

  const onSubmit = (data: RecoveryForm) => {
    setEmail(data.email)
    setSent(true)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Link
          href={ROUTES.login}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar ao login
        </Link>

        {!sent ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Recuperar senha</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                leftIcon={<Mail />}
                autoComplete="email"
                {...register('email', { required: true })}
              />
              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                Enviar link de recuperação
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-8 text-success" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-bold">E-mail enviado!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Se existir uma conta com <strong className="text-foreground">{email}</strong>, você
              receberá instruções para redefinir sua senha em instantes.
            </p>
            <Button className="mt-6 w-full" onClick={() => setSent(false)} variant="outline">
              Tentar outro e-mail
            </Button>
            <Link href={ROUTES.login} className="mt-4 block text-sm font-medium text-primary hover:underline">
              Voltar ao login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
