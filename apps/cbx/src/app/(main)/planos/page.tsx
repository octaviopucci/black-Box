'use client'

import { Check, X } from 'lucide-react'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { contentService } from '@/services'
import { formatCurrency, cn } from '@/lib/utils'

const ALL_FEATURES = [
  'Até 5 anúncios ativos',
  'Até 30 anúncios ativos',
  'Anúncios ilimitados',
  'Chat e WhatsApp com anúncio em vídeo',
  'Sem anúncios em vídeo',
  'Chat e WhatsApp liberados',
  'Perfil básico de vendedor',
  'Aparece nas buscas locais',
  'Suporte por e-mail',
  'Anúncios patrocinados no app (monetização)',
  'Destaque em 3 anúncios por mês',
  'Selo de vendedor verificado',
  'Estatísticas de visualizações',
  'Suporte prioritário via WhatsApp',
  'Renovação automática de anúncios',
  'Loja virtual personalizada',
  '5 anúncios patrocinados por mês',
  'Banner na página inicial',
  'Relatórios avançados de vendas',
  'Gerente de conta dedicado',
  'Integração com WhatsApp Business',
]

export default function PlanosPage() {
  const plans = contentService.plans()

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Planos CBX"
          subtitle="Escolha o plano ideal para vender em Capão Bonito"
        />

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-2xl border p-6 transition-shadow',
                plan.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                  : 'border-border/60 bg-card',
              )}
            >
              {plan.badge && (
                <Badge
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  {plan.badge}
                </Badge>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-primary">
                  {plan.price === 0 ? 'Grátis' : formatCurrency(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                )}
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="my-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? 'default' : 'outline'}
                className="w-full"
                onClick={() => toast.info(`Assinatura do plano ${plan.name} em breve!`)}
              >
                {plan.price === 0 ? 'Começar grátis' : `Assinar ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        <SectionHeader title="Comparativo de recursos" />
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Recurso</th>
                {plans.map((p) => (
                  <th
                    key={p.id}
                    className={cn(
                      'px-4 py-3 text-center font-medium',
                      p.highlighted && 'bg-primary/5 text-primary',
                    )}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_FEATURES.map((feature) => (
                <tr key={feature} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{feature}</td>
                  {plans.map((plan) => {
                    const included = plan.features.includes(feature)
                    return (
                      <td
                        key={plan.id}
                        className={cn(
                          'px-4 py-3 text-center',
                          plan.highlighted && 'bg-primary/5',
                        )}
                      >
                        {included ? (
                          <Check className="mx-auto size-4 text-primary" aria-label="Incluído" />
                        ) : (
                          <X className="mx-auto size-4 text-muted-foreground/40" aria-label="Não incluído" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </PageShell>
  )
}
