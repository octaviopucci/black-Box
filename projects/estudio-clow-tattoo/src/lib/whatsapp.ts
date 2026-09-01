import { site } from "@/data/site";

export type QuoteFormData = {
  nome: string;
  whatsapp: string;
  email: string;
  idade: string;
  cidade: string;
  parte: string;
  tamanho: string;
  estilo: string;
  descricao: string;
  disponibilidade: string;
  hasReference?: boolean;
};

export function buildQuoteMessage(data: QuoteFormData): string {
  let message = `Olá, StudioClownTattoo! 🎨
Gostaria de solicitar um orçamento.

`;
  message += `*Nome completo:* ${data.nome}
`;
  message += `*WhatsApp:* ${data.whatsapp}
`;
  message += `*Email:* ${data.email}
`;
  message += `*Idade:* ${data.idade}
`;
  message += `*Cidade:* ${data.cidade}
`;
  message += `*Parte do corpo:* ${data.parte}
`;
  message += `*Tamanho aproximado:* ${data.tamanho}
`;
  message += `*Estilo desejado:* ${data.estilo}
`;
  message += `*Descreva sua ideia de tatuagem...:* ${data.descricao}
`;
  message += `*Disponibilidade para realizar a tattoo:* ${data.disponibilidade}`;

  if (data.hasReference) {
    message += `

*Envie uma referência/imagem (opcional):* Tenho referência para enviar na conversa.`;
  }

  return message;
}

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  target?.scrollIntoView({ behavior: "smooth" });
}
