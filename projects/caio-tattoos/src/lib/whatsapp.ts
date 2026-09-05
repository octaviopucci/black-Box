import type { Messages } from "@/i18n/types";
import { site } from "@/data/site";

export type RequestType = "tatuagem" | "tenis";

export type QuoteFormData = {
  tipo: RequestType;
  nome: string;
  whatsapp: string;
  email: string;
  idade: string;
  cidade: string;
  parte: string;
  tamanho: string;
  estilo: string;
  modeloTenis: string;
  numeroTenis: string;
  descricao: string;
  disponibilidade: string;
  hasReference?: boolean;
};

export function buildQuoteMessage(data: QuoteFormData, t: Messages): string {
  const f = t.whatsapp.fields;
  const intro =
    data.tipo === "tenis" ? t.whatsapp.quoteRequestSneaker : t.whatsapp.quoteRequestTattoo;

  let message = `${t.whatsapp.quoteIntro}
${intro}

`;
  message += `*${f.requestType}:* ${data.tipo === "tenis" ? "Custom Adidas Running" : "Tatuagem old school"}
`;
  message += `*${f.name}:* ${data.nome}
`;
  message += `*${f.whatsapp}:* ${data.whatsapp}
`;
  message += `*${f.email}:* ${data.email}
`;
  message += `*${f.age}:* ${data.idade}
`;
  message += `*${f.city}:* ${data.cidade}
`;

  if (data.tipo === "tatuagem") {
    message += `*${f.bodyPart}:* ${data.parte}
`;
    message += `*${f.size}:* ${data.tamanho}
`;
    message += `*${f.style}:* ${data.estilo}
`;
  } else {
    message += `*${f.shoeModel}:* ${data.modeloTenis}
`;
    message += `*${f.shoeSize}:* ${data.numeroTenis}
`;
  }

  message += `*${f.description}:* ${data.descricao}
`;
  message += `*${f.availability}:* ${data.disponibilidade}`;

  if (data.hasReference) {
    message += `

*${f.reference}:* ${f.referenceNote}`;
  }

  return message;
}

export function openWhatsApp(message: string) {
  if (site.whatsapp) {
    const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  window.open(site.instagram.url, "_blank", "noopener,noreferrer");
}

export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  const smooth =
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches;
  target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
}
