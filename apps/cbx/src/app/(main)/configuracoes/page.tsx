'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  ChevronRight,
  Crown,
  Globe,
  Lock,
  Moon,
  Shield,
  Smartphone,
} from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { liveCatalog } from '@/lib/live-catalog'
import { getSellerPlan } from '@/lib/plans'

export default function ConfiguracoesPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [marketing, setMarketing] = useState(true)
  const [planLabel, setPlanLabel] = useState('Comprador (sem plano de vendedor)')

  useEffect(() => {
    liveCatalog.billingMe().then((data) => {
      const plan = getSellerPlan(data.user.plan)
      if (plan && data.user.canPublish) {
        setPlanLabel(`${plan.name} · ativo`)
      } else if (plan) {
        setPlanLabel(`${plan.name} · aguardando Pix`)
      }
    }).catch(() => undefined)
  }, [])

  const toggles = [
    {
      id: 'notifications',
      label: 'Notificações push',
      description: 'Receber alertas de mensagens e ofertas',
      icon: Bell,
      checked: notifications,
      onChange: setNotifications,
    },
    {
      id: 'email',
      label: 'Alertas por e-mail',
      description: 'Resumo semanal de atividades',
      icon: Smartphone,
      checked: emailAlerts,
      onChange: setEmailAlerts,
    },
    {
      id: 'dark',
      label: 'Modo escuro',
      description: 'Visualização noturna (demonstração)',
      icon: Moon,
      checked: darkMode,
      onChange: setDarkMode,
    },
    {
      id: 'marketing',
      label: 'Promoções e novidades',
      description: 'Ofertas especiais do CBX',
      icon: Globe,
      checked: marketing,
      onChange: setMarketing,
    },
  ]

  const links = [
    { href: ROUTES.privacidade, label: 'Política de privacidade', icon: Shield },
    { href: ROUTES.termos, label: 'Termos de uso', icon: Lock },
  ]

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader title="Configurações" subtitle="Personalize sua experiência no CBX" />

        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Crown className="size-4 text-primary" />
            <p className="text-sm font-semibold">{planLabel}</p>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Para vender, pague a mensalidade via Pix. Comprar e conversar não exige plano pago.
          </p>
          <Button size="sm" asChild>
            <Link href={ROUTES.planos}>Ver planos</Link>
          </Button>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-border/60 bg-card">
          {toggles.map((toggle, i) => {
            const Icon = toggle.icon
            return (
              <div
                key={toggle.id}
                className={`flex items-center gap-3 px-4 py-4 ${
                  i < toggles.length - 1 ? 'border-b border-border/40' : ''
                }`}
              >
                <Icon className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <p className="text-xs text-muted-foreground">{toggle.description}</p>
                </div>
                <Switch
                  checked={toggle.checked}
                  onCheckedChange={toggle.onChange}
                  aria-label={toggle.label}
                />
              </div>
            )
          })}
        </div>

        <SectionHeader title="Legal" />
        <nav className="overflow-hidden rounded-xl border border-border/60 bg-card">
          {links.map((link, i) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 ${
                  i < links.length - 1 ? 'border-b border-border/40' : ''
                }`}
              >
                <Icon className="size-5 shrink-0 text-primary" />
                <span className="flex-1 text-sm font-medium">{link.label}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            )
          })}
        </nav>
      </Container>
    </PageShell>
  )
}
