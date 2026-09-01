export const site = {
  brand: "Octávio Pucci",
  tagline: "Tatuagem",
  handle: "octaviopuccitattoo",
  followers: 6834,
  promise:
    "Projetos autorais em realismo preto e cinza — coberturas, reformas e peças que carregam significado.",
  instagram: "https://www.instagram.com/octaviopuccitattoo/",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_URL ??
    "https://www.instagram.com/octaviopuccitattoo/",
  location: "São Paulo, Brasil",
} as const;

export const specialties = [
  {
    id: "realismo",
    title: "Realismo",
    description:
      "Retratos, homenagens e composições autorais com atenção máxima do primeiro ao último traço.",
    source: "Instagram @octaviopuccitattoo",
  },
  {
    id: "cobertura",
    title: "Cobertura",
    description:
      "Reformas que buscam naturalidade — sem aquele borrão preto, parecendo pele limpa.",
    source: "Instagram @octaviopuccitattoo",
  },
  {
    id: "fine-line",
    title: "Fine Line",
    description:
      "Linhas precisas e projetos delicados para quem valoriza arte bem feita e durável.",
    source: "Instagram @octaviopuccitattoo",
  },
  {
    id: "reforma",
    title: "Reforma",
    description:
      "Retoque e revitalização de tatuagens antigas com técnica e dedicação.",
    source: "Instagram @octaviopuccitattoo",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Conversa",
    text: "Me chama no WhatsApp (link na bio) para um projeto único e exclusivo.",
  },
  {
    step: "02",
    title: "Projeto autoral",
    text: "Arte 100% autoral — composição que conta história, sonhos e objetivos.",
  },
  {
    step: "03",
    title: "Sessão",
    text: "Atenção intacta em cada centímetro — técnica, paciência e resistência.",
  },
  {
    step: "04",
    title: "Cicatrização",
    text: "Trabalhos pensados para durar — partes em preto já cicatrizadas nos vídeos do feed.",
  },
] as const;

export type PortfolioItem = {
  id: number;
  image: string;
  alt: string;
  caption?: string;
  permalink: string;
  featured?: boolean;
};

export const portfolio: PortfolioItem[] = [
  {
    id: 5,
    image: "/instagram/post-5.jpg",
    alt: "Fechamento de braço em realismo preto e cinza",
    caption:
      "Fechamento de braço lado externo — 20 horas em sessão única. Tigre e coruja em realismo.",
    permalink: "https://www.instagram.com/p/DZ-gnyRxnG-/",
    featured: true,
  },
  {
    id: 6,
    image: "/instagram/post-6.jpg",
    alt: "Fechamento de costas Hannya",
    caption:
      "Hannya — fechamento de costas completo em 2 sessões.",
    permalink: "https://www.instagram.com/p/DZ-gosFEfpm/",
    featured: true,
  },
  {
    id: 3,
    image: "/instagram/post-3.jpg",
    alt: "Cobertura realista autoral",
    caption:
      "Composição autoral de cobertura — mais de 80% já cicatrizado em 3 sessões.",
    permalink: "https://www.instagram.com/p/DZ-gnu9RvGA/",
    featured: true,
  },
  {
    id: 2,
    image: "/instagram/post-2.jpg",
    alt: "Homenagem realista aos filhos",
    caption:
      "Arte exclusiva em homenagem — realismo com significado e laço emocional.",
    permalink: "https://www.instagram.com/p/DZ-gn8yR21c/",
  },
  {
    id: 4,
    image: "/instagram/post-4.jpg",
    alt: "Complemento no joelho",
    caption: "Complemento no joelho — detalhes e brancos.",
    permalink: "https://www.instagram.com/p/DZ-gnwvxTBp/",
  },
  {
    id: 7,
    image: "/instagram/post-7.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DZ-gn6pxAHv/",
  },
  {
    id: 8,
    image: "/instagram/post-8.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DZ-goAkxk7P/",
  },
  {
    id: 9,
    image: "/instagram/post-9.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DZ-goMFxZOU/",
  },
  {
    id: 10,
    image: "/instagram/post-10.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DZ-goRjxWt7/",
  },
  {
    id: 11,
    image: "/instagram/post-11.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DUJlf-ejhwM/",
  },
  {
    id: 12,
    image: "/instagram/post-12.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DT3ffAtDqBE/",
  },
  {
    id: 13,
    image: "/instagram/post-13.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DTxj8LQjvo2/",
  },
  {
    id: 14,
    image: "/instagram/post-14.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DQunYGZkrrN/",
  },
  {
    id: 15,
    image: "/instagram/post-15.jpg",
    alt: "Trabalho de realismo",
    permalink: "https://www.instagram.com/p/DQCt4OtDuf6/",
  },
];

export const media = {
  profile: "/instagram/profile.jpg",
  hero: "/instagram/post-5.jpg",
} as const;
