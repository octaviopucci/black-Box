import { site } from "@/data/site";

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function whatsappUrl(message?: string) {
  if (!site.whatsapp) {
    return site.instagram.url;
  }
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
}
