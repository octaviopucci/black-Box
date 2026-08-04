'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Megaphone, Store } from 'lucide-react'
import { BRAND, ROUTES } from '@/constants/brand'
import { useAppStore } from '@/stores/app-store'
import { Button } from '@/components/ui/button'
import { fadeIn, slideInRight } from '@/animations/variants'

const slides = [
  {
    icon: MapPin,
    title: 'Compre perto',
    description:
      'Encontre produtos e serviços de vendedores da sua região. Negocie com quem você conhece em Capão Bonito.',
    gradient: 'from-primary/20 to-accent/10',
  },
  {
    icon: Megaphone,
    title: 'Venda fácil',
    description:
      'Anuncie em minutos, alcance compradores locais e gerencie seus anúncios de forma simples e gratuita.',
    gradient: 'from-secondary/20 to-amber-100/50',
  },
  {
    icon: Store,
    title: 'Negócios locais',
    description:
      'Descubra lojas verificadas, empresas da cidade e ofertas exclusivas para quem mora no Vale do Ribeira.',
    gradient: 'from-accent/20 to-primary/10',
  },
] as const

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding, login } = useAppStore()
  const [step, setStep] = useState(0)

  const finish = () => {
    completeOnboarding()
    login()
    router.replace(ROUTES.home)
  }

  const next = () => {
    if (step < slides.length - 1) setStep((s) => s + 1)
    else finish()
  }

  const slide = slides[step]
  const Icon = slide.icon

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-4">
        <span className="text-sm font-semibold text-muted-foreground">{BRAND.name}</span>
        <Link
          href={ROUTES.home}
          onClick={() => {
            completeOnboarding()
            login()
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Pular
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <div
              className={`flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br ${slide.gradient} shadow-lg`}
            >
              <Icon className="size-12 text-primary" strokeWidth={1.5} aria-hidden />
            </div>
            <h1 className="mt-8 text-2xl font-bold tracking-tight text-foreground">{slide.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex gap-2" aria-label={`Slide ${step + 1} de ${slides.length}`}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
              aria-current={i === step ? 'step' : undefined}
            />
          ))}
        </div>
      </div>

      <footer className="space-y-4 p-6">
        <Button className="w-full" size="lg" onClick={next}>
          {step < slides.length - 1 ? 'Continuar' : 'Começar'}
        </Button>
        {step < slides.length - 1 && (
          <motion.p variants={fadeIn} initial="hidden" animate="visible" className="text-center text-sm text-muted-foreground">
            Deslize ou toque em Continuar
          </motion.p>
        )}
      </footer>
    </div>
  )
}
