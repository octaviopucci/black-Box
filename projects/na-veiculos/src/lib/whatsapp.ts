import { site } from "@/data/site";
import { formatPrice, type Vehicle } from "@/data/vehicles";

export type BuyFormData = {
  nome: string;
  whatsapp: string;
  cidade: string;
  pagamento: string;
  temTroca: boolean;
  carroTroca: string;
  mensagem: string;
};

export function buildBuyMessage(data: BuyFormData, vehicle: Vehicle): string {
  const lines = [
    `Olá, ${site.name}! Vim pelo site e quero comprar um carro.`,
    "",
    `*Carro:* ${vehicle.title}`,
    `*Preço anunciado:* ${formatPrice(vehicle.price)}`,
    "",
    `*Nome:* ${data.nome}`,
    `*WhatsApp:* ${data.whatsapp}`,
  ];

  if (data.cidade) lines.push(`*Cidade:* ${data.cidade}`);
  if (data.pagamento) lines.push(`*Forma de pagamento:* ${data.pagamento}`);
  if (data.temTroca) {
    lines.push(`*Tenho carro para troca:* ${data.carroTroca || "sim, detalho na conversa"}`);
  }
  if (data.mensagem) lines.push("", data.mensagem);

  lines.push("", "Ainda está disponível?");

  return lines.join("\n");
}

export function vehicleInterestMessage(vehicle: Vehicle) {
  return `Olá! Vim pelo site e quero saber sobre o ${vehicle.title} por ${formatPrice(vehicle.price)}. Ainda está disponível?`;
}

export const defaultMessage =
  "Olá! Vim pelo site da NA Veículos e quero saber mais sobre os carros disponíveis.";

export function whatsappHref(message: string = defaultMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string = defaultMessage) {
  window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
}

export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  const smooth =
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches;
  target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
}
