/**
 * Fonte primária: public/instagram/meta.json (instagram-extract @dra.barbaraalencar)
 * CRM, endereço e WhatsApp: [CONFIRMAR] — não publicados nas captions
 */
import meta from "./instagram-meta.json";

type FeedItem = (typeof meta.feed)[number];

function decodeCaption(raw: string) {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

const feed = meta.feed.map((item) => ({
  ...item,
  caption: item.caption ? decodeCaption(item.caption) : "",
}));

export const media = {
  profile: "/instagram/profile.jpg",
  hero: "/instagram/post-6.jpg",
  portrait: "/instagram/post-2.jpg",
  gallery: feed
    .filter((item): item is FeedItem & { file: string } => Boolean(item.file))
    .map((item) => ({
      src: item.file,
      caption: item.caption,
      permalink: item.permalink,
      isVideo: item.is_video,
    })),
} as const;

export const site = {
  name: "Dra. Barbara Alencar",
  shortName: "Barbara Alencar",
  title: "Médica — Estética Facial",
  tagline: "Naturalidade · Reestruturação · Respeito",
  specialty:
    "Estética que respeita escolhas, limites e individualidades — resultados que integram ao seu rosto",
  credentials: {
    note: "[CONFIRMAR — formação e registro profissional]",
    source: "Instagram @dra.barbaraalencar",
  },
  instagram: {
    handle: `@${meta.username}`,
    url: `https://www.instagram.com/${meta.username}/`,
    followers: meta.followers,
  },
  contact: {
    whatsapp: null as null | { number: string; display: string },
    defaultMessage:
      "Olá! Vi seu site e gostaria de agendar uma avaliação estética.",
  },
  clinic: {
    name: "[CONFIRMAR — consultório/clínica]",
    address: "[CONFIRMAR — endereço]",
    mapQuery: null as null | string,
    note: "Agendamento e localização: confirme pelo Instagram.",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Atendimentos", href: "#servicos" },
    { label: "Feed", href: "#feed" },
    { label: "Contato", href: "#contato" },
  ],
  hero: {
    eyebrow: "Estética facial · Naturalidade",
    brandLine: "Dra. Barbara",
    brandName: "Alencar",
    headline: "Estética que respeita quem você é.",
    subheadline:
      "Naturalidade não é apagar — é devolver sustentação e proporção ao seu rosto, preservando o que faz você ser você.",
    credential: "Estética facial com planejamento estratégico",
  },
  proof: [
    {
      value: String(meta.followers.toLocaleString("pt-BR")),
      label: "seguidores no Instagram",
      source: "Instagram @dra.barbaraalencar",
    },
    {
      value: "Natural",
      label: "resultados que integram ao rosto",
      source: "Caption Instagram",
    },
    {
      value: "Você",
      label: "no centro de cada planejamento",
      source: "Caption Instagram",
    },
  ],
  about: {
    title: "Nem tudo precisa ser mudado",
    paragraphs: [
      "Eu acredito em uma estética que respeita escolhas, limites e individualidades. Nem tudo precisa ser mudado — e nem tudo que pode ser feito, precisa ser feito.",
      "Se cuidar também é escolher fazer algo por você. Não por pressão, não para caber em um padrão — mas porque você gosta de se olhar, se cuidar e se sentir bem consigo mesma.",
    ],
    highlights: [
      "Planejamento voltado a sustentação, contorno e proporção",
      "Preservação das características de cada paciente",
      "Resultado que você percebe — e se sente melhor",
    ],
    source: `Instagram @${meta.username}`,
  },
  philosophy: {
    title: "Reestruturar não é mudar um rosto",
    intro:
      "É entender onde ele perdeu suporte, contorno e proporção ao longo do tempo — e tratar esses pontos de forma estratégica.",
    points: [
      "Naturalidade é quando o resultado se integra ao seu rosto, sem apagar o que faz você ser você.",
      "Não existe um único caminho: tem quem está começando, quem quer repensar escolhas e quem só precisa manter.",
      "Antes de decidir o que fazer, vale entender onde você está agora.",
    ],
    source: "Captions Instagram @dra.barbaraalencar",
  },
  services: [
    {
      id: "reestruturacao",
      title: "Reestruturação facial",
      description:
        "Devolver sustentação e suavizar sinais, preservando suas características.",
      priceNote: "valor na consulta",
    },
    {
      id: "harmonizacao",
      title: "Harmonização com naturalidade",
      description:
        "Tratamento estratégico de contorno e proporção — você percebe a diferença e se sente melhor.",
      priceNote: "valor na consulta",
    },
    {
      id: "manutencao",
      title: "Manutenção e repensar escolhas",
      description:
        "Para quem já fez procedimentos e quer cuidar do que conquistou — ou rever o caminho.",
      priceNote: "valor na consulta",
    },
    {
      id: "avaliacao",
      title: "Avaliação personalizada",
      description:
        "Entender seu momento, necessidade e objetivo antes de qualquer decisão.",
      priceNote: "valor na consulta",
    },
  ],
  process: [
    {
      step: "01",
      title: "Onde você está agora",
      description:
        "Começando, repensando escolhas ou mantendo — cada fase pede um olhar diferente.",
    },
    {
      step: "02",
      title: "Planejamento estratégico",
      description:
        "Identificar onde o rosto perdeu suporte e definir o que faz sentido tratar.",
    },
    {
      step: "03",
      title: "Resultado integrado",
      description:
        "Naturalidade: você percebe a diferença e se sente bem consigo mesma.",
    },
  ],
  firstConsult: {
    title: "Antes de decidir o que fazer",
    items: [
      "Entender seu momento e seu objetivo",
      "Avaliar sustentação, contorno e proporção",
      "Respeitar limites e individualidades",
      "Construir um plano que faça sentido pra você",
    ],
    note: "O procedimento muda conforme a necessidade — não existe receita única.",
    source: "Captions Instagram",
  },
  clinicSpace: {
    title: "Cuidado com intenção",
    description:
      "Um espaço para conversar com calma, entender expectativas e decidir juntas o que — e se — faz sentido fazer.",
    source: "Instagram @dra.barbaraalencar",
  },
  editorial: {
    quote:
      "Naturalidade é quando o resultado se integra ao seu rosto — sem apagar o que faz você ser você. Você percebe a diferença. E se sente melhor.",
    attribution: "Dra. Barbara Alencar",
    source: "Caption Instagram",
  },
  faq: [
    {
      q: "Reestruturar é mudar o rosto?",
      a: "Não. É entender onde perdeu suporte, contorno e proporção ao longo do tempo — e tratar esses pontos de forma estratégica, preservando suas características.",
      source: "Caption Instagram",
    },
    {
      q: "Preciso fazer muitos procedimentos?",
      a: "Nem tudo precisa ser mudado. E nem tudo que pode ser feito, precisa ser feito. O plano depende do seu momento e do seu objetivo.",
      source: "Caption Instagram",
    },
    {
      q: "Como agendar uma avaliação?",
      a: "Entre em contato pelo Instagram @dra.barbaraalencar. WhatsApp e endereço: confirmar com a Dra. Barbara.",
      source: "Instagram",
    },
  ],
  cta: {
    title: "Quer entender o que faz sentido pro seu rosto?",
    description: "Manda um oi no Instagram. A gente conversa com calma.",
  },
  legal: {
    note: "Procedimentos estéticos. Resultados variam conforme características individuais.",
    crm: "[CONFIRMAR — CRM/registro profissional]",
  },
  feed,
} as const;
