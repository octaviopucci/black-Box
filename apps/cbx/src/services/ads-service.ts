import type { AdCreative } from '@/types/ads'

/**
 * Mock ad inventory — replace with AdMob rewarded / AdSense units later.
 * Keep the service surface stable so UI does not change.
 */
const CREATIVES: AdCreative[] = [
  {
    id: 'ad-techcapao',
    advertiser: 'TechCapão Informática',
    title: 'Notebooks com garantia local',
    subtitle: 'Retire hoje no Centro de Capão Bonito',
    cta: 'Ver loja',
    durationSec: 5,
    gradient: 'from-[#6d28d9] via-[#9333ea] to-[#f97316]',
    badge: 'Patrocinado',
  },
  {
    id: 'ad-autovila',
    advertiser: 'AutoPeças Vila Nova',
    title: 'Rodas e som automotivo',
    subtitle: 'Frete grátis na cidade nesta semana',
    cta: 'Ver ofertas',
    durationSec: 5,
    gradient: 'from-[#0f172a] via-[#1e293b] to-[#84cc16]',
    badge: 'Parceiro CBX',
  },
  {
    id: 'ad-gamezone',
    advertiser: 'GameZone Capão',
    title: 'Troca de games e consoles',
    subtitle: 'Avaliação na hora · Centro',
    cta: 'Conhecer',
    durationSec: 5,
    gradient: 'from-[#db2777] via-[#f97316] to-[#84cc16]',
    badge: 'Destaque',
  },
]

export const adsService = {
  /** Pick a creative for a placement (mock rotation). */
  getCreative: (): AdCreative => {
    const i = Math.floor(Math.random() * CREATIVES.length)
    return CREATIVES[i]!
  },

  /**
   * Future: load AdMob RewardedAd / AdSense interstitial here.
   * Signature kept for drop-in SDK integration.
   */
  async loadRewarded(_placementId: string): Promise<{ ready: boolean }> {
    await new Promise((r) => setTimeout(r, 280))
    return { ready: true }
  },
}
