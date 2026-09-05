import { site } from "@/data/site";

const DEFAULT_MESSAGE = "Olá André! Gostaria de solicitar um orçamento de tatuagem.";

export function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function instagramUrl() {
  return site.instagram.url;
}

export function mapsUrl() {
  return site.mapsLink;
}

export function styleContactUrl(style: string) {
  return whatsappUrl(`Olá André! Tenho interesse em tatuagem no estilo ${style}.`);
}

export function portfolioUrl() {
  return "/#trabalhos";
}
