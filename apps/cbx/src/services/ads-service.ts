import type { AdCreative } from '@/types/ads'

/**
 * Mock ad inventory — replace with AdMob rewarded when running inside Capacitor.
 * Keep this service surface stable so UI (RewardedAdHost / useAdGate) does not change.
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

/** Google AdMob test unit IDs — replace with real IDs before production release. */
export const ADMOB_TEST_IDS = {
  androidAppId: 'ca-app-pub-3940256099942544~3347511713',
  iosAppId: 'ca-app-pub-3940256099942544~1458002511',
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917',
    ios: 'ca-app-pub-3940256099942544/1712485313',
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
  },
} as const

function isNativeRuntime(): boolean {
  if (typeof window === 'undefined') return false
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
  return Boolean(cap?.isNativePlatform?.())
}

export const adsService = {
  isNative: isNativeRuntime,

  getCreative: (): AdCreative => {
    const i = Math.floor(Math.random() * CREATIVES.length)
    return CREATIVES[i]!
  },

  /**
   * Load a rewarded unit.
   * - Web / demo: mock ready
   * - Native (Capacitor): wire `@capacitor-community/admob` here
   *
   * Example (after installing the plugin):
   * ```ts
   * import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob'
   * await AdMob.prepareRewardVideoAd({ adId: ADMOB_TEST_IDS.rewarded.android })
   * ```
   */
  async loadRewarded(_placementId: string): Promise<{ ready: boolean; provider: 'mock' | 'admob' }> {
    if (isNativeRuntime()) {
      // TODO: AdMob.prepareRewardVideoAd({ adId: ... })
      await new Promise((r) => setTimeout(r, 200))
      return { ready: true, provider: 'admob' }
    }
    await new Promise((r) => setTimeout(r, 280))
    return { ready: true, provider: 'mock' }
  },

  /**
   * Show rewarded ad. On native, resolve only after the user earns the reward.
   */
  async showRewarded(_placementId: string): Promise<{ earned: boolean }> {
    if (isNativeRuntime()) {
      // TODO: AdMob.showRewardVideoAd() + listen to Rewarded event
      return { earned: true }
    }
    return { earned: true }
  },
}
