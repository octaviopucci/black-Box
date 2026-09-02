/**
 * Fonte primária: public/instagram/meta.json (instagram-extract @dra.lailacorrea)
 * CRM, endereço e WhatsApp: [CONFIRMAR] — não publicados nas captions
 */
import meta from "./instagram-meta.json";
import { asset } from "@/lib/assets";

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
  profile: asset("/instagram/profile.jpg"),
  hero: asset("/instagram/hero-carousel.jpg"),
  portrait: asset("/instagram/about-portrait.jpg"),
  gallery: feed
    .filter((item): item is FeedItem & { file: string } => Boolean(item.file))
    .map((item) => ({
      src: asset(item.file),
      caption: item.caption,
      permalink: item.permalink,
      isVideo: item.is_video,
    })),
  /** Curated — só conteúdo profissional (sem fotos pessoais do feed embed) */
  professionalGallery: [
    {
      src: asset("/instagram/pro/feed-1.jpg"),
      caption:
        "O estetoscópio me ajuda a ouvir o coração. Mas a medicina vai muito além disso — acolhimento, responsabilidade e compromisso com a sua saúde.",
      permalink: "https://www.instagram.com/p/DVHOFKEkSA-/",
      isVideo: false,
    },
    {
      src: asset("/instagram/hero-carousel.jpg"),
      caption:
        "Atendimento com naturalidade — cuidar, prevenir e suavizar sem perder quem você é.",
      permalink: "https://www.instagram.com/dra.lailacorrea/",
      isVideo: false,
    },
    {
      src: asset("/instagram/profile.jpg"),
      caption: "Dra. Laila Correa — medicina com acolhimento e naturalidade.",
      permalink: "https://www.instagram.com/dra.lailacorrea/",
      isVideo: false,
    },
  ],
} as const;

export const site = {
  name: "Dra. Laila Correa",
  shortName: "Laila Correa",
  title: "Médica — Estética Facial",
  tagline: "Naturalidade · Cuidado · Prevenção",
  specialty:
    "Botox com naturalidade — cuidar, prevenir e suavizar sem perder quem você é",
  credentials: {
    note: "[CONFIRMAR — formação e registro profissional]",
    source: "Instagram @dra.lailacorrea",
  },
  instagram: {
    handle: `@${meta.username}`,
    url: `https://www.instagram.com/${meta.username}/`,
    followers: meta.followers,
  },
  contact: {
    whatsapp: null as null | { number: string; display: string },
    defaultMessage:
      "Olá! Vi seu site e gostaria de agendar uma avaliação.",
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
    brandLine: "Dra. Laila",
    brandName: "Correa",
    headline: "Rosto descansado. Expressão intacta.",
    subheadline:
      "A proposta é cuidar, prevenir e suavizar — sem deixar o rosto sem expressão e sem perder aquilo que faz parte de você.",
    credential: "Botox com planejamento e naturalidade",
  },
  proof: [
    {
      value: String(meta.followers.toLocaleString("pt-BR")),
      label: "seguidores no Instagram",
      source: "Instagram @dra.lailacorrea",
    },
    {
      value: "Natural",
      label: "resultado que integra ao rosto",
      source: "Depoimento Instagram",
    },
    {
      value: "Prevenir",
      label: "antes das linhas virarem marcas",
      source: "Depoimento Instagram",
    },
  ],
  about: {
    title: "Cuidar sem apagar quem você é",
    paragraphs: [
      "Desde o início, a ideia é sempre a mesma: manter a naturalidade. Nada de deixar o rosto sem expressão — a proposta é cuidar, prevenir e suavizar, sem perder aquilo que faz parte de você.",
      "Além de tratar as linhas que já começam a aparecer, o botox também pode ser um aliado na prevenção — justamente para que elas não se tornem marcas fixas com o tempo.",
    ],
    highlights: [
      "Naturalidade: continuar sendo você, só que descansada",
      "Prevenção e suavização com intenção",
      "Planejamento alinhado ao seu rosto e ao seu momento",
    ],
    source: `Depoimento de paciente · Instagram @${meta.username}`,
  },
  philosophy: {
    title: "Rosto descansado e bem cuidado",
    intro:
      "O resultado que faz sentido é aquele em que você continua sendo você — com aquele aspecto de rosto descansado, sem perder a expressão.",
    points: [
      "Naturalidade não é congelar — é suavizar com critério e respeito às suas feições.",
      "Prevenir faz parte do cuidado: tratar cedo evita que linhas leves virem marcas fixas.",
      "Cada rosto pede um olhar diferente. O plano nasce da conversa, não de receita pronta.",
    ],
    source: "Depoimento Instagram @dra.lailacorrea",
  },
  services: [
    {
      id: "botox-natural",
      title: "Botox com naturalidade",
      description:
        "Suavizar linhas e preservar a expressão — nada de rosto sem movimento.",
      priceNote: "valor na consulta",
    },
    {
      id: "prevencao",
      title: "Prevenção de linhas",
      description:
        "Tratar cedo para que marcas leves não se tornem fixas com o tempo.",
      priceNote: "valor na consulta",
    },
    {
      id: "manutencao",
      title: "Manutenção e acompanhamento",
      description:
        "Para quem já faz botox e quer manter o resultado com naturalidade.",
      priceNote: "valor na consulta",
    },
    {
      id: "avaliacao",
      title: "Avaliação personalizada",
      description:
        "Entender seu momento, expectativas e o que faz sentido pro seu rosto.",
      priceNote: "valor na consulta",
    },
  ],
  process: [
    {
      step: "01",
      title: "Conversar com calma",
      description:
        "Entender o que te incomoda, o que você quer preservar e o que espera do resultado.",
    },
    {
      step: "02",
      title: "Planejar com naturalidade",
      description:
        "Definir onde suavizar, onde prevenir — sempre respeitando sua expressão.",
    },
    {
      step: "03",
      title: "Resultado integrado",
      description:
        "Você continua sendo você — com aquele aspecto de rosto descansado e bem cuidado.",
    },
  ],
  firstConsult: {
    title: "Antes de aplicar qualquer coisa",
    items: [
      "Entender seu histórico e seu objetivo",
      "Avaliar linhas, expressão e momento do rosto",
      "Alinhar expectativas sobre naturalidade",
      "Construir um plano que faça sentido pra você",
    ],
    note: "Cada rosto é único — o tratamento muda conforme a necessidade.",
    source: "Depoimento Instagram",
  },
  clinicSpace: {
    title: "Aos cuidados da Dra. Laila",
    description:
      "Um atendimento pensado para quem quer se guiar com naturalidade — conversando com calma antes de qualquer decisão.",
    source: "Instagram @dra.lailacorrea",
  },
  editorial: {
    quote:
      "Continuo sendo eu, só que com aquele aspecto de rosto descansado e bem cuidado. Nada de deixar o rosto sem expressão.",
    attribution: "Depoimento de paciente",
    source: "Instagram @dra.lailacorrea",
  },
  faq: [
    {
      q: "Botox deixa o rosto sem expressão?",
      a: "Não precisa. A proposta é cuidar, prevenir e suavizar — sem perder aquilo que faz parte de você. Naturalidade significa continuar se movendo e sendo reconhecível.",
      source: "Depoimento Instagram",
    },
    {
      q: "Dá para usar botox na prevenção?",
      a: "Sim. Além de tratar linhas que já aparecem, o botox pode ser aliado na prevenção — para que elas não se tornem marcas fixas com o tempo.",
      source: "Depoimento Instagram",
    },
    {
      q: "Como agendar uma avaliação?",
      a: "Entre em contato pelo Instagram @dra.lailacorrea. WhatsApp e endereço: confirmar com a Dra. Laila.",
      source: "Instagram",
    },
  ],
  cta: {
    title: "Quer conversar sobre naturalidade no seu rosto?",
    description: "Manda um oi no Instagram. A gente alinha expectativas com calma.",
  },
  legal: {
    note: "Procedimentos estéticos. Resultados variam conforme características individuais.",
    crm: "[CONFIRMAR — CRM/registro profissional]",
  },
  feed,
} as const;
