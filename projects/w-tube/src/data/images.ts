import { asset } from "@/lib/assets";

/** Apple Store CDN — PNG transparente, padrão Apple Store */
const apple = (slug: string, size = 800) =>
  `https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/${slug}?wid=${size}&hei=${size}&fmt=png-alpha&qlt=90`;

/** Pexels — acessórios genéricos, fundo claro, recorte quadrado */
const pexels = (id: number, size = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${size}&h=${size}&fit=crop&dpr=1`;

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
  iphone13: apple("iphone-13-blue-select-2021_SW_COLOR"),

  // AirPods
  airpods4: apple("airpods-4-select-202409"),
  airpodsPro2: apple("airpods-pro-2-hero-select-202409"),
  airpodsMax: apple("airpods-max-select-202409-midnight"),

  // Apple Watch
  watchSeries10: apple("watch-case-46-aluminum-rosegold-nc-s10_SW_COLOR"),
  watchSe: apple("watch-case-44-aluminum-midnight-nc-se3_SW_COLOR"),

  // Carregador Apple
  magsafeCharger: apple("MU7E2"),

  // Acessórios
  caseTransparent: pexels(6671619),
  caseSilicone: pexels(6671620),
  caseMagSafe: pexels(6671621),
  caseReinforced: pexels(6671622),
  screenProtector: pexels(6671623),
  screenPrivacy: pexels(6671624),
  screenCamera: pexels(6671625),
  charger20w: pexels(3806097),
  carCharger: pexels(1181244),
  cableUsbC: pexels(4910424),
  cableLightning: pexels(351965),
  cableNylon: pexels(169677),
  powerBank10k: pexels(1570268),
  powerBank20k: pexels(7867170),
  phoneStand: pexels(7867171),
  carMount: pexels(7867172),
  bluetoothSpeaker: pexels(3683098),
  usbHub: pexels(7867173),
  adapter: pexels(7867174),
  twsHeadphone: pexels(3825517),
  smartwatchGeneric: pexels(7867175),
  androidPhone: pexels(699529),

  // Aliases para categorias
  iphone: apple("iphone-17-finish-select-lavender-202509_SW_COLOR"),
  iphonePro: apple("iphone-17-pro-max-finish-select-silver-202509_SW_COLOR"),
  iphoneAlt: apple("iphone-13-blue-select-2021_SW_COLOR"),
  airpods: apple("airpods-4-select-202409"),
  watch: apple("watch-case-46-aluminum-rosegold-nc-s10_SW_COLOR"),
  watchAlt: apple("watch-case-44-aluminum-midnight-nc-se3_SW_COLOR"),
  case: pexels(6671619),
  caseAlt: pexels(6671620),
  screen: pexels(6671623),
  charger: pexels(3806097),
  chargerAlt: pexels(3806097),
  cable: pexels(4910424),
  powerbank: pexels(1570268),
  speaker: pexels(3683098),
  hub: pexels(7867173),
  stand: pexels(7867171),
  car: pexels(1181244),
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
