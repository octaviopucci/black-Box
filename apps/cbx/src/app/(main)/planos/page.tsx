'use client'

import { Check, QrCode } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/brand'
import { SELLER_PLANS } from '@/lib/plans'
import { liveCatalog } from '@/lib/live-catalog'
import { formatCurrency, cn } from '@/lib/utils'

const ALL_FEATURES = Array.from(new Set(SELLER_PLANS.flatMap((p) => p.features)))

export default function PlanosPage() {
  const router = useRouter()
  const plans = SELLER_PLANS
  const useApi = process.env.NEXT_PUBLIC_USE_API === '1'

  const startCheckout = async (planId: string) => {
    if (!useApi) {
      toast.info('No app real, este botão gera o QR Pix da mensalidade.')
      return
    }
    try {
      const { payment } = await liveCatalog.createPix(planId)
      router.push(`/planos/pagar?payment=${payment.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao gerar Pix. Faça login e tente de novo.')
    }
  }

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Planos CBX"
          subtitle="Mensalidade via Pix. Sem plano gratuito — para vender, escolha um plano."
        />

        <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                <span className="text-3xl font-bold text-primary">{formatCurrency(plan.price)}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-foreground">
                {plan.adsLimit == null
                  ? 'Anúncios ilimitados'
                  : `Até ${plan.adsLimit} anúncios ativos`}
              </p>
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
                onClick={() => startCheckout(plan.id)}
              >
                <QrCode className="size-4" />
                Pagar com Pix
              </Button>
            </div>
          ))}
        </div>

        <SectionHeader title="Comparativo" />
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[720px] text-sm">
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
                        className={cn('px-4 py-3 text-center', plan.highlighted && 'bg-primary/5')}
                      >
                        {included ? (
                          <Check className="mx-auto size-4 text-primary" aria-label="Incluído" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          A mensalidade vale 30 dias a partir da confirmação do Pix. Sem pagamento no período, a
          publicação fica bloqueada.
        </p>
      </Container>
    </PageShell>
  )
}
