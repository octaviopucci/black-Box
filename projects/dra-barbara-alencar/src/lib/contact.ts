import { site } from "@/data/site";

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function instagramUrl() {
  return site.instagram.url;
}

export function instagramDmUrl(message?: string) {
  const base = site.instagram.url;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function contactUrl(message?: string) {
  if (site.contact.whatsapp) {
    const text = encodeURIComponent(message ?? site.contact.defaultMessage);
    return `https://wa.me/${site.contact.whatsapp.number}?text=${text}`;
  }
  return instagramDmUrl(message ?? site.contact.defaultMessage);
}

export function serviceContactUrl(serviceTitle: string) {
  const text = `Olá! Vi seu site e gostaria de saber mais sobre: ${serviceTitle}.`;
  return contactUrl(text);
}
