const DEFAULT_NUMBER = "5515997499178";

export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_NUMBER;
  return raw.replace(/\D/g, "");
}

type WhatsAppOptions = {
  serviceName?: string;
  action?: string;
};

export function buildWhatsAppUrl(options: WhatsAppOptions = {}): string {
  const number = getWhatsAppNumber();
  const business = "Octávio Pucci Tattoo Infinity";

  let message: string;
  if (options.serviceName) {
    message = `Olá! Vi o site de ${business} e quero orçamento para: ${options.serviceName}.`;
  } else {
    message = `Olá! Vi o site de ${business} e quero marcar uma tatuagem.`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
