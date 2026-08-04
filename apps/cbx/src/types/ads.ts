import type { PlanTier } from '@/types'

/** Ad placement keys — swap mock player for AdMob/AdSense later. */
export type AdPlacement =
  | 'app_open'
  | 'publish'
  | 'whatsapp'
  | 'chat'
  | 'seller_phone'

export interface AdCreative {
  id: string
  advertiser: string
  title: string
  subtitle: string
  cta: string
  durationSec: number
  gradient: string
  badge: string
}

export interface AdPlacementConfig {
  id: AdPlacement
  title: string
  description: string
  /** How long the unlock lasts after a successful watch. */
  unlockTtlMs: number
}

export const AD_PLACEMENTS: Record<AdPlacement, AdPlacementConfig> = {
  app_open: {
    id: 'app_open',
    title: 'Bem-vindo ao CBX',
    description: 'Assista a um anúncio curto para continuar no plano gratuito.',
    unlockTtlMs: 1000 * 60 * 60 * 12, // 12h
  },
  publish: {
    id: 'publish',
    title: 'Liberar publicação',
    description: 'No plano gratuito, um anúncio em vídeo libera a criação do anúncio.',
    unlockTtlMs: 1000 * 60 * 30,
  },
  whatsapp: {
    id: 'whatsapp',
    title: 'Ver WhatsApp do vendedor',
    description: 'Assista a um anúncio para revelar o contato do vendedor.',
    unlockTtlMs: 1000 * 60 * 20,
  },
  chat: {
    id: 'chat',
    title: 'Liberar chat',
    description: 'Assista a um anúncio para conversar com vendedores no plano gratuito.',
    unlockTtlMs: 1000 * 60 * 30,
  },
  seller_phone: {
    id: 'seller_phone',
    title: 'Ver telefone',
    description: 'Assista a um anúncio para ver o telefone do vendedor.',
    unlockTtlMs: 1000 * 60 * 20,
  },
}

/** Plans that skip rewarded ads entirely. */
export const AD_FREE_PLANS: PlanTier[] = ['premium', 'empresarial']

export function planRequiresAds(plan: PlanTier): boolean {
  return !AD_FREE_PLANS.includes(plan)
}
