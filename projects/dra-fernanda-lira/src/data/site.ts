/**
 * Fonte primária: public/instagram/meta.json (instagram-extract @drafernandaliraaa)
 * Não inventar CRM, endereço, WhatsApp ou especialidades fora das captions.
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

const galleryPosts = feed.filter(
  (item) => item.file && item.caption.length > 0,
);

export const media = {
  profile: "/instagram/profile.jpg",
  hero: galleryPosts[0]?.file ?? "/instagram/post-2.jpg",
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
  name: "Dra. Fernanda Lira",
  tagline: "Estética & cuidados com a pele",
  specialty:
    "Conteúdo e protocolos em bronzeamento artificial, proteção solar e rotina facial",
  instagram: {
    handle: `@${meta.username}`,
    url: `https://www.instagram.com/${meta.username}/`,
    followers: meta.followers,
  },
  whatsapp: null as null | {
    number: string;
    defaultMessage: string;
  },
  location: {
    city: "[CONFIRMAR — cidade]",
    address: "[CONFIRMAR — endereço do consultório]",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Protocolos", href: "#protocolos" },
    { label: "Feed", href: "#feed" },
    { label: "Contato", href: "#contato" },
  ],
  hero: {
    eyebrow: `Instagram · ${meta.followers?.toLocaleString("pt-BR") ?? ""} seguidores`,
    headline: ["Pele cuidada,", "bronze natural,", "com técnica."],
    subheadline:
      "Bronzeamento artificial, orientação em proteção solar e conteúdo prático sobre a saúde da sua pele — direto do feed da Dra. Fernanda.",
  },
  about: {
    title: "Ciência aplicada com linguagem clara",
    paragraphs: [
      "Fernanda Lira compartilha no Instagram orientações práticas sobre pele — de emergências como espinhas até a escolha do protetor solar ideal para o seu tipo de pele.",
      "O conteúdo une educação e estética: bronzeamento artificial com acompanhamento, dicas de home care e explicações que você pode salvar e consultar quando precisar.",
    ],
    highlights: [
      "Bronzeamento artificial com protocolo em etapas",
      "Educação em proteção solar (físico vs. químico)",
      "Orientações para espinhas sem piorar a lesão",
    ],
    source: `Instagram @${meta.username}`,
  },
  services: [
    {
      title: "Bronzeamento Artificial",
      description:
        galleryPosts.find((p) =>
          p.caption.toLowerCase().includes("bronzeamento"),
        )?.caption.split("\n")[0] ??
        "Protocolo de bronzeamento artificial com acompanhamento.",
      tag: "Destaque",
      source: "Instagram @drafernandaliraaa",
    },
    {
      title: "Proteção Solar",
      description:
        "Protetor físico ou químico: os dois protegem contra a radiação UV, mas possuem filtros e características diferentes. O melhor é aquele adequado à sua pele e que você consegue usar todos os dias.",
      tag: "Educação",
      source: "Instagram @drafernandaliraaa",
    },
    {
      title: "Espinhas & Emergências",
      description:
        "Existem produtos que podem ajudar a controlar a inflamação, proteger a região e evitar aquela mania de ficar mexendo — que muitas vezes só piora a lesão e ainda pode deixar mancha.",
      tag: "Rotina",
      source: "Instagram @drafernandaliraaa",
    },
  ],
  process: [
    {
      step: "01",
      title: "Avaliação",
      description:
        "Entendimento do seu tipo de pele, rotina e objetivo — bronzeamento, proteção ou tratamento pontual.",
    },
    {
      step: "02",
      title: "Protocolo",
      description:
        "Definição do procedimento ou orientação com base no conteúdo e técnica compartilhados no atendimento.",
    },
    {
      step: "03",
      title: "Aplicação",
      description:
        "Execução com produtos selecionados e cuidado em cada etapa do processo.",
    },
    {
      step: "04",
      title: "Manutenção",
      description:
        "Orientações para casa — como nos posts educativos do Instagram, para você consultar quando precisar.",
    },
  ],
  experience: {
    title: "Do feed para o espelho",
    lines: [
      "Conteúdo que educa.",
      "Técnica que transforma.",
      "Resultado que você vê na pele.",
    ],
  },
  faq: [
    {
      q: "Qual protetor solar escolher — físico ou químico?",
      a: "Os dois protegem contra a radiação UV. O químico costuma ter textura mais leve; o físico/mineral é uma ótima alternativa para peles sensíveis. O ideal é o que você consegue usar todos os dias.",
      source: "Caption Instagram — protetor solar",
    },
    {
      q: "Posso espremer espinhas em casa?",
      a: "Calma: não precisa espremer. Existem produtos que ajudam a controlar a inflamação e evitar manchas — mas mexer na lesão muitas vezes só piora o quadro.",
      source: "Caption Instagram — espinhas",
    },
    {
      q: "Como funciona o bronzeamento artificial?",
      a: "O protocolo é feito em etapas, com acompanhamento e orientação de manutenção em casa — como no conteúdo “Parte 02 - bronzeamento artificial” publicado no Instagram.",
      source: "Caption Instagram — bronzeamento",
    },
  ],
  legal: {
    note: "Procedimentos estéticos. Resultados variam conforme tipo de pele e hábitos individuais.",
    crm: "[CONFIRMAR — CRM/registro profissional, se aplicável]",
  },
  feed,
} as const;
