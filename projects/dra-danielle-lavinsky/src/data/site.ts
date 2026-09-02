/**
 * Fonte primária: public/instagram/meta.json (instagram-extract @dra.daniellelavinsky)
 * Dados clínicos: site lavinskyodontologia.com.br + legacy HTML
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
  hero: "/instagram/post-5.jpg",
  heroAlt: "/hero.webp",
  clinic: "/instagram/post-4.jpg",
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
  name: "Dra. Danielle Lavinsky",
  shortName: "Danielle Lavinsky",
  tagline: "DTM · Dor Orofacial · Bruxismo",
  specialty: "Especialista em DTM e Dor Orofacial",
  cro: "CRO/RS 15888",
  experience: "20+ anos como cirurgiã-dentista",
  instagram: {
    handle: `@${meta.username}`,
    url: `https://www.instagram.com/${meta.username}/`,
    followers: meta.followers,
  },
  whatsapp: {
    number: "555133320032",
    display: "(51) 3332-0032",
    defaultMessage:
      "Olá! Vi o site da Dra. Danielle Lavinsky e quero agendar uma consulta.",
  },
  clinic: {
    name: "Clínica Lavinsky",
    address: "Rua Quintino Bocaiúva, 673 — Moinhos de Vento",
    city: "Porto Alegre/RS",
    cep: "90440-051",
    hours: "Segunda a sexta, 8h às 19h",
    parking: "Estacionamento conveniado: Indigo Quintino, nº 710 (mesma rua).",
    mapQuery: "Rua+Quintino+Bocaiúva,+673,+Porto+Alegre,+RS",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Atendimentos", href: "#servicos" },
    { label: "Feed", href: "#feed" },
    { label: "Local", href: "#local" },
  ],
  hero: {
    eyebrow: "DTM · Bruxismo · Porto Alegre",
    brandLine: "Dra. Danielle",
    brandName: "Lavinsky",
    headline: "Mastigar sem dor. Dormir sem ranger os dentes.",
    subheadline:
      "Trato mandíbula, músculos da face, bruxismo e distúrbios do sono. A gente entende o que está acontecendo e monta um plano que faça sentido pra você.",
    credential: "CRO/RS 15888 · Clínica Lavinsky · Moinhos de Vento",
  },
  proof: [
    { value: "20+", label: "anos como cirurgiã-dentista", source: "Instagram @dra.daniellelavinsky" },
    { value: "CRO/RS\n15888", label: "registro profissional", source: "Instagram @dra.daniellelavinsky" },
    { value: "POA", label: "Clínica Lavinsky, Moinhos de Vento", source: "lavinskyodontologia.com.br" },
  ],
  about: {
    title: "Um olhar específico para dores que não têm resposta simples",
    paragraphs: [
      "Prazer, sou a Dra. Danielle Lavinsky. Cirurgiã-dentista há mais de 20 anos, atuo principalmente nas áreas de DTM, Dor Orofacial e Odontologia do Sono.",
      "Procurar uma especialista em DTM e dor orofacial é buscar um olhar mais específico para dores e desconfortos que nem sempre têm uma resposta simples. O atendimento vai além da queixa principal.",
    ],
    highlights: [
      "Avaliação da articulação temporomandibular e musculatura mastigatória",
      "Consideração de bruxismo, hábitos, sono e história da dor",
      "Abordagem conservadora e individualizada sempre que possível",
    ],
    source: `Instagram @${meta.username}`,
  },
  dtmExplainer: {
    title: "DTM e bruxismo são a mesma coisa?",
    intro:
      "Essas são dúvidas que aparecem com frequência na minha rotina de atendimentos. Entender a diferença é fundamental não só para um diagnóstico adequado, como também para definir a melhor conduta para cada caso.",
    points: [
      "É possível ter bruxismo sem ter DTM — e ter DTM sem ter bruxismo.",
      "Também é possível ter as duas condições ao mesmo tempo.",
      "Desgaste nos dentes, dor ou tensão na face, isoladamente, não bastam para definir um diagnóstico.",
    ],
    source: "Caption Instagram — DTM vs bruxismo",
  },
  services: [
    {
      id: "dtm",
      title: "Consulta DTM e dor orofacial",
      description:
        "Avaliação da mandíbula, músculos, hábitos, sono e história da dor. Sem atalho.",
      priceNote: "valor na consulta",
    },
    {
      id: "placa",
      title: "Placa para bruxismo e sono",
      description:
        "Placa feita pro seu caso — não é molde genérico de shopping.",
      priceNote: "valor na consulta",
    },
    {
      id: "infiltracao",
      title: "Infiltração para dor orofacial",
      description:
        "Quando indicado, entra no plano de tratamento com critério clínico.",
      priceNote: "valor na consulta",
    },
    {
      id: "escaneamento",
      title: "Escaneamento 3D",
      description:
        "Registro preciso pra acompanhar evolução e montar o tratamento.",
      priceNote: "valor na consulta",
    },
    {
      id: "clareamento",
      title: "Clareamento dental",
      description: "Quando faz sentido pro seu caso, depois da avaliação.",
      priceNote: "valor na consulta",
    },
    {
      id: "profilaxia",
      title: "Profilaxia e revisão",
      description: "Limpeza e revisão semestral pra manter a saúde bucal em dia.",
      priceNote: "valor na consulta",
    },
  ],
  process: [
    {
      step: "01",
      title: "Você manda mensagem",
      description: "A gente combina dia e horário. Sem formulário complicado.",
    },
    {
      step: "02",
      title: "Consulta com calma",
      description:
        "História clínica, exame detalhado e exames de apoio, se precisar — como explico no Instagram.",
    },
    {
      step: "03",
      title: "Plano na mesa",
      description:
        "Te explico o que encontrei e os próximos passos. Você decide com informação.",
    },
  ],
  firstConsult: {
    title: "Como funciona a primeira consulta",
    items: [
      "História clínica e escuta cuidadosa",
      "Exame clínico detalhado",
      "Recursos de diagnóstico, quando necessários",
      "Conversa clara sobre o que foi identificado e os próximos passos",
    ],
    note: "Compreender o que você está sentindo e cada etapa do processo também faz parte do cuidado.",
    source: "Caption Instagram — primeira consulta",
  },
  clinicSpace: {
    title: "Onde acontece o atendimento",
    description:
      "Espaço preparado para receber cada paciente com atenção, tecnologia e um olhar individualizado. É na Clínica Lavinsky, em Porto Alegre, que conduzo meus atendimentos buscando compreender cada caso com cuidado.",
    source: "Caption Instagram — Clínica Lavinsky",
  },
  reviews: [
    {
      quote:
        "Cheguei com dor na mandíbula há meses. Na primeira consulta entendi o que era. Hoje durmo melhor.",
      author: "Paciente, 38 anos",
      location: "Moinhos de Vento",
      placeholder: true,
    },
    {
      quote:
        "Rangia os dentes à noite e acordava com a face cansada. A placa fez diferença em poucas semanas.",
      author: "Paciente, 45 anos",
      location: "Porto Alegre",
      placeholder: true,
    },
    {
      quote:
        "Gosto porque ela explica sem pressa. Não empurra procedimento que não precisa.",
      author: "Paciente, 52 anos",
      location: "Bela Vista",
      placeholder: true,
    },
  ],
  faq: [
    {
      q: "DTM e bruxismo são a mesma coisa?",
      a: "Não necessariamente. É possível ter bruxismo sem DTM, DTM sem bruxismo, ou as duas condições juntas. Desgaste nos dentes ou dor na face, sozinhos, não definem o diagnóstico.",
      source: "Caption Instagram",
    },
    {
      q: "Como funciona a primeira consulta?",
      a: "Começo reunindo informações com história clínica e escuta cuidadosa, faço exame detalhado, uso recursos de diagnóstico quando necessário e explico com clareza o que foi identificado e os próximos passos.",
      source: "Caption Instagram",
    },
    {
      q: "O que é avaliado numa consulta de DTM?",
      a: "Articulação temporomandibular, musculatura mastigatória, bruxismo, hábitos, sono, história da dor e rotina — para conduzir o tratamento com critério e individualização.",
      source: "Caption Instagram",
    },
  ],
  cta: {
    title: "Dor na mandíbula não precisa virar rotina",
    description: "Manda um oi. A gente marca sua avaliação.",
  },
  legal: {
    note: "Procedimentos odontológicos. Resultados variam conforme quadro clínico individual.",
  },
  feed,
} as const;
