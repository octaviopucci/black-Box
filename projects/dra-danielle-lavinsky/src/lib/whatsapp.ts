import { site } from "@/data/site";

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}

export function whatsappServiceUrl(serviceTitle: string) {
  const text = `Olá! Vi o site da Dra. Danielle Lavinsky e quero saber mais sobre: ${serviceTitle}.`;
  return whatsappUrl(text);
}
