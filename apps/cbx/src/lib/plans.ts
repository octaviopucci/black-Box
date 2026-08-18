import type { Plan, PlanTier, SellerPlanId, SubscriptionStatus } from '@/types'

export type { SellerPlanId }

export const BILLING_PERIOD_DAYS = 30

/** Paid seller plans — there is no free selling tier. */
export const SELLER_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19.9,
    period: 'mês',
    adsLimit: 5,
    description: 'Para quem está começando a vender em Capão Bonito.',
    features: [
      'Até 5 anúncios ativos',
      'Mensalidade via Pix',
      'Chat e WhatsApp liberados',
      'Perfil de vendedor',
      'Aparece nas buscas locais',
      'Suporte por e-mail',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.9,
    period: 'mês',
    adsLimit: 15,
    description: 'Para vendedores frequentes que querem mais espaço no marketplace.',
    features: [
      'Até 15 anúncios ativos',
      'Mensalidade via Pix',
      'Chat e WhatsApp liberados',
      'Selo de vendedor verificado',
      'Estatísticas de visualizações',
      'Suporte prioritário',
      'Renovação mensal',
    ],
    highlighted: true,
    badge: 'Mais popular',
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    price: 79.9,
    period: 'mês',
    adsLimit: 50,
    description: 'Para lojas e empresas da região com vitrine maior.',
    features: [
      'Até 50 anúncios ativos',
      'Mensalidade via Pix',
      'Loja virtual na plataforma',
      'Destaque na busca',
      'Relatórios de anúncios',
      'Suporte via WhatsApp',
    ],
    badge: 'Para empresas',
  },
  {
    id: 'empresarial_ilimitado',
    name: 'Empresarial Ilimitado',
    price: 149.9,
    period: 'mês',
    adsLimit: null,
    description: 'Capacidade máxima para quem vende todo dia em Capão Bonito.',
    features: [
      'Anúncios ativos ilimitados',
      'Mensalidade via Pix',
      'Loja virtual na plataforma',
      'Prioridade no suporte',
      'Relatórios avançados',
      'Gerente de conta',
    ],
    badge: 'Ilimitado',
  },
]

export const SELLER_PLAN_IDS: SellerPlanId[] = SELLER_PLANS.map((p) => p.id)

export function getSellerPlan(id: string): Plan | undefined {
  return SELLER_PLANS.find((p) => p.id === id)
}

export function isSellerPlanId(id: string): id is SellerPlanId {
  return SELLER_PLAN_IDS.includes(id as SellerPlanId)
}

/** -1 = unlimited */
export function adsLimitForPlan(plan: PlanTier): number {
  if (plan === 'gratuito') return 0
  const def = getSellerPlan(plan)
  if (!def) return 0
  return def.adsLimit == null ? -1 : def.adsLimit
}

export function isSubscriptionActive(
  status?: SubscriptionStatus | null,
  expiresAt?: Date | string | null,
): boolean {
  if (status !== 'active') return false
  if (!expiresAt) return false
  const end = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return end.getTime() > Date.now()
}

export function periodEndFrom(start = new Date(), days = BILLING_PERIOD_DAYS): Date {
  return new Date(start.getTime() + days * 24 * 60 * 60 * 1000)
}
