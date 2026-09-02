/**
 * Fonte primária: public/instagram/meta.json (instagram-extract @nutri.luiza.rimoli)
 * Clínica: @levitta.clinica — endereço e WhatsApp [CONFIRMAR]
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

const galleryPosts = feed.filter(
  (item) => item.file && item.caption.length > 0,
);

export const media = {
  profile: asset("/instagram/profile.jpg"),
  hero: asset("/instagram/post-4.jpg"),
  clinic: asset("/instagram/post-6.jpg"),
  team: asset("/instagram/post-3.jpg"),
  gallery: feed
    .filter((item): item is FeedItem & { file: string } => Boolean(item.file))
    .map((item) => ({
      src: asset(item.file),
      caption: item.caption,
      permalink: item.permalink,
      isVideo: item.is_video,
    })),
} as const;

export const site = {
  name: "Luiza Rimoli",
  shortName: "Luiza Rimoli",
  title: "Nutricionista",
  tagline: "Clínica · Esportiva · Comportamental",
  specialty:
    "Nutricionista Clínica, Esportiva e Comportamental — reeducação alimentar com escuta e cuidado",
  credentials: {
    formation: "Formada pela Unicamp em 2012",
    postgrad: "Pós-graduada pela Unicamp e USP",
    source: "Instagram @nutri.luiza.rimoli",
  },
  instagram: {
    handle: `@${meta.username}`,
    url: `https://www.instagram.com/${meta.username}/`,
    followers: meta.followers,
  },
  contact: {
    /** [CONFIRMAR] — não publicado nas captions */
    whatsapp: null as null | { number: string; display: string },
    defaultMessage:
      "Olá! Vi seu site e gostaria de agendar uma consulta de nutrição.",
  },
  clinic: {
    name: "Clínica Levittá",
    instagram: "https://www.instagram.com/levitta.clinica/",
    handle: "@levitta.clinica",
    note: "Atendimentos na Clínica Levittá — ambiente acolhedor em parceria com a equipe Levittá.",
    address: "[CONFIRMAR — endereço da Clínica Levittá]",
    mapQuery: null as null | string,
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Atendimentos", href: "#servicos" },
    { label: "Feed", href: "#feed" },
    { label: "Contato", href: "#contato" },
  ],
  hero: {
    eyebrow: "Nutrição · Clínica Levittá",
    brandLine: "Luiza",
    brandName: "Rimoli",
    headline: "Comer bem sem guerra com a comida.",
    subheadline:
      "Reeducação alimentar com escuta de verdade — rotina, hábitos e objetivos únicos. Sem dieta impossível de manter.",
    credential: "Unicamp · USP · Clínica Levittá",
  },
  proof: [
    {
      value: "2012",
      label: "formada pela Unicamp",
      source: "Instagram @nutri.luiza.rimoli",
    },
    {
      value: String(meta.followers.toLocaleString("pt-BR")),
      label: "seguidores no Instagram",
      source: "Instagram @nutri.luiza.rimoli",
    },
    {
      value: "Levittá",
      label: "consultório acolhedor",
      source: "Instagram @levitta.clinica",
    },
  ],
  about: {
    title: "Cada pessoa traz uma história — e eu ouço antes de montar o plano",
    paragraphs: [
      "Prazer, eu sou a Luiza Rimoli. Nutricionista Clínica, Esportiva e Comportamental, formada pela Unicamp em 2012 e pós-graduada pela Unicamp e USP.",
      "No consultório, gosto de conhecer cada paciente a fundo: rotina, hábitos, preferências, objetivos e desafios. Porque cada pessoa que chega até mim traz uma história e necessidades que são únicas.",
    ],
    highlights: [
      "Reeducação alimentar e mudança gradual de hábitos",
      "Plano personalizado — exames, composição corporal e objetivos",
      "Sem dietas extremamente restritivas ou condutas difíceis de manter",
    ],
    source: `Instagram @${meta.username}`,
  },
  philosophy: {
    title: "Alimentação como estilo de vida — não como punição",
    intro:
      "Meu trabalho se baseia na reeducação alimentar e na mudança gradual de hábitos, construindo uma relação mais equilibrada com a comida.",
    points: [
      "Cada acompanhamento considera hábitos, preferências, atividade física e necessidades clínicas.",
      "Quando necessário, a suplementação individualizada faz parte desse cuidado.",
      "Tempo para ouvir e cuidado para olhar para aquela pessoa como única — isso nunca pode faltar.",
    ],
    source: "Caption Instagram — apresentação",
  },
  services: [
    {
      id: "clinica",
      title: "Nutrição clínica",
      description:
        "Avaliação individualizada com exames bioquímicos e necessidades clínicas quando indicado.",
      priceNote: "valor na consulta",
    },
    {
      id: "esportiva",
      title: "Nutrição esportiva",
      description:
        "Plano alinhado à rotina de treinos, composição corporal e performance.",
      priceNote: "valor na consulta",
    },
    {
      id: "comportamental",
      title: "Nutrição comportamental",
      description:
        "Mudança gradual de hábitos e relação mais equilibrada com a comida.",
      priceNote: "valor na consulta",
    },
    {
      id: "acompanhamento",
      title: "Acompanhamento personalizado",
      description:
        "Soluções práticas pro dia a dia — um caminho que faça sentido pra sua vida.",
      priceNote: "valor na consulta",
    },
  ],
  process: [
    {
      step: "01",
      title: "A gente se conhece",
      description:
        "Rotina, hábitos, preferências, objetivos e desafios — tudo entra na conversa.",
    },
    {
      step: "02",
      title: "Plano sob medida",
      description:
        "Considero exames, composição corporal, atividade física e o que você precisa de verdade.",
    },
    {
      step: "03",
      title: "Acompanhamento de perto",
      description:
        "Mudança gradual, vínculo e comemoração de cada conquista junto.",
    },
  ],
  firstConsult: {
    title: "O que não falta numa consulta",
    items: [
      "Tempo para ouvir de verdade",
      "Olhar para você como pessoa única",
      "Identificar dificuldades e pensar soluções pro dia a dia",
      "Encontrar um caminho que faça sentido pra sua vida",
    ],
    note: "A ideia é que a alimentação faça parte de um novo estilo de vida — não de uma guerra.",
    source: "Caption Instagram @nutri.luiza.rimoli",
  },
  clinicSpace: {
    title: "Clínica Levittá",
    description:
      "Atendo na Clínica Levittá — um lugar acolhedor, em parceria com a equipe Levittá. Meu primeiro dia de atendimentos por lá foi em 11.08.26.",
    source: "Instagram @nutri.luiza.rimoli · @levitta.clinica",
  },
  editorial: {
    quote:
      "Ver a recuperação da saúde, autoestima, disposição, vitalidade e do prazer de cuidar de si novamente — a cada conquista de um paciente, sinto como se fosse comigo.",
    attribution: "Luiza Rimoli",
    source: "Caption Instagram",
  },
  faq: [
    {
      q: "Você faz dietas restritivas?",
      a: "Não. Meu trabalho se baseia na reeducação alimentar e na mudança gradual de hábitos — sem condutas extremamente restritivas ou difíceis de manter a longo prazo.",
      source: "Caption Instagram",
    },
    {
      q: "Como funciona o acompanhamento?",
      a: "Cada plano é personalizado: hábitos, preferências alimentares, atividade física, composição corporal, exames bioquímicos, necessidades clínicas e objetivos entram na construção.",
      source: "Caption Instagram",
    },
    {
      q: "Onde são os atendimentos?",
      a: "Na Clínica Levittá. Endereço e agendamento: confirme pelo Instagram @nutri.luiza.rimoli ou @levitta.clinica.",
      source: "Instagram",
    },
  ],
  cta: {
    title: "Pronta pra recomeçar sua relação com a comida?",
    description: "Manda um oi no Instagram. A gente marca sua consulta.",
  },
  legal: {
    note: "Resultados variam conforme rotina, histórico clínico e adesão individual.",
    crn: "[CONFIRMAR — CRN, se aplicável]",
  },
  feed,
} as const;
