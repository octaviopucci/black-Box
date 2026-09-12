import { asset } from "@/lib/assets";

/** Apple Store CDN — fundo transparente/branco, imagens oficiais por modelo */
const apple = (slug: string, size = 800) =>
  `https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/${slug}?wid=${size}&hei=${size}&fmt=png-alpha&qlt=90`;

/** Pexels — acessórios genéricos com fundo claro */
const pexels = (id: number, size = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${size}&h=${size}&fit=crop`;

/** Assets oficiais (Bitly / WebTube Acessórios) */
export const brandAssets = {
  logo: asset("/brand/logo.png"),
  heroBackground: asset("/brand/hero-bg.png"),
};

/** Imagens oficiais Apple por produto */
export const productImages = {
  // iPhones
  iphone17ProMax: apple("iphone-17-pro-max-finish-select-silver-202509_SW_COLOR"),
  iphone17Pro: apple("iphone-17-pro-finish-select-cosmicorange-202509_SW_COLOR"),
  iphone17: apple("iphone-17-finish-select-lavender-202509_SW_COLOR"),
  iphone16ProMax:
    "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
  iphone16Pro: apple("iphone-16-pro-finish-select-202409-6-3inch-blacktitanium"),
  iphone16: apple("iphone-16-ultramarine-select-202409_SW_COLOR"),
  iphone15: apple("iphone-15-finish-select-202309-6-1inch-blue"),
  iphone14: apple("iphone-14-finish-select-202209-6-1inch-blue"),
  iphone13: apple("iphone-13-blue-select-2021"),

  // AirPods
  airpods4: apple("airpods-4-select-202409"),
  airpodsPro2: apple("airpods-pro-2-hero-select-202409"),
  airpodsMax: apple("airpods-max-select-202409-midnight"),

  // Apple Watch
  watchSeries10: apple("watch-case-46-aluminum-rosegold-nc-s10_SW_COLOR"),
  watchSe: apple("watch-case-44-aluminum-midnight-nc-se3_SW_COLOR"),

  // Carregador Apple
  magsafeCharger: apple("MU7E2"),

  // Acessórios genéricos (fundo claro)
  caseTransparent: pexels(4219654),
  caseSilicone: pexels(4475708),
  caseMagSafe: pexels(4489720),
  caseReinforced: pexels(4480505),
  screenProtector: pexels(4489721),
  charger20w: pexels(607812),
  carCharger: pexels(3807758),
  cableUsbC: pexels(4386431),
  cableLightning: pexels(4386433),
  cableNylon: pexels(4386436),
  powerBank10k: pexels(437037),
  powerBank20k: pexels(788946),
  phoneStand: pexels(404280),
  carMount: pexels(1092644),
  bluetoothSpeaker: pexels(3683098),
  usbHub: pexels(513803),
  adapter: pexels(1631179),
  twsHeadphone: pexels(3825517),
  smartwatchGeneric: pexels(437037),
  androidPhone: pexels(699529),

  // Aliases para categorias (retrocompat)
  iphone: apple("iphone-17-finish-select-lavender-202509_SW_COLOR"),
  iphonePro: apple("iphone-17-pro-max-finish-select-silver-202509_SW_COLOR"),
  iphoneAlt: apple("iphone-13-blue-select-2021"),
  airpods: apple("airpods-4-select-202409"),
  watch: apple("watch-case-46-aluminum-rosegold-nc-s10_SW_COLOR"),
  watchAlt: apple("watch-case-44-aluminum-midnight-nc-se3_SW_COLOR"),
  case: pexels(4219654),
  caseAlt: pexels(4475708),
  screen: pexels(4489721),
  charger: pexels(607812),
  chargerAlt: pexels(607812),
  cable: pexels(4386431),
  powerbank: pexels(437037),
  speaker: pexels(3683098),
  hub: pexels(513803),
  stand: pexels(404280),
  car: pexels(3807758),
  headphone: pexels(3825517),
  smartphone: pexels(699529),
  magsafe: apple("MU7E2"),
};

export const heroImages = {
  iphone: apple("iphone-17-pro-max-finish-select-silver-202509_SW_COLOR", 900),
  airpods: apple("airpods-pro-2-hero-select-202409", 600),
  watch: apple("watch-case-46-aluminum-rosegold-nc-s10_SW_COLOR", 600),
  charger: apple("MU7E2", 500),
};
