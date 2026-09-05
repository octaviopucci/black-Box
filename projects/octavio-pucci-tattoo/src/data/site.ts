/**
 * Conteúdo derivado exclusivamente de public/instagram/meta.json
 * (@octaviopuccitattoo). Nenhum dado importado de outros apps do monorepo.
 */

export const site = {
  name: "Octávio Pucci",
  handle: "octaviopuccitattoo",
  followers: 6834,
  instagram: "https://www.instagram.com/octaviopuccitattoo/",
  contact:
    process.env.NEXT_PUBLIC_WHATSAPP_URL ??
    "https://www.instagram.com/octaviopuccitattoo/",
} as const;

/** Post 1 — guest flyer caption, especialidades explícitas */
export const focusLine =
  "Fine Line, Realismo, Reforma e Cobertura — projetos autorais em preto e cinza.";

export type WorkEntry = {
  id: number;
  image: string;
  permalink: string;
  /** Trecho literal ou parafraseado mínimo da caption do post */
  note?: string;
  label?: string;
};

/** Posts com caption no embed — ordem editorial, não cronológica */
export const works: WorkEntry[] = [
  {
    id: 5,
    image: "/instagram/post-5.jpg",
    permalink: "https://www.instagram.com/p/DZ-gnyRxnG-/",
    label: "Fechamento de braço",
    note: "Lado externo em sessão única de 20 horas. Atenção máxima do primeiro ao último traço — cada centímetro carrega técnica, paciência e resistência.",
  },
  {
    id: 6,
    image: "/instagram/post-6.jpg",
    permalink: "https://www.instagram.com/p/DZ-gosFEfpm/",
    label: "Hannya · costas",
    note: "Fechamento de costas completo em 2 sessões.",
  },
  {
    id: 3,
    image: "/instagram/post-3.jpg",
    permalink: "https://www.instagram.com/p/DZ-gnu9RvGA/",
    label: "Cobertura autoral",
    note: "Composição 100% autoral — mais de 80% cicatrizado em 3 sessões. Coberturas que parecem pele limpa, sem borrão preto.",
  },
  {
    id: 2,
    image: "/instagram/post-2.jpg",
    permalink: "https://www.instagram.com/p/DZ-gn8yR21c/",
    label: "Homenagem",
    note: "Arte exclusiva em homenagem — vai além da estética, carrega significado e laço emocional.",
  },
  {
    id: 4,
    image: "/instagram/post-4.jpg",
    permalink: "https://www.instagram.com/p/DZ-gnwvxTBp/",
    label: "Joelho",
    note: "Complemento — detalhes e brancos em sessão final.",
  },
];

/** Demais posts do feed — só imagem + link */
export const feedStrip: WorkEntry[] = [
  { id: 7, image: "/instagram/post-7.jpg", permalink: "https://www.instagram.com/p/DZ-gn6pxAHv/" },
  { id: 8, image: "/instagram/post-8.jpg", permalink: "https://www.instagram.com/p/DZ-goAkxk7P/" },
  { id: 9, image: "/instagram/post-9.jpg", permalink: "https://www.instagram.com/p/DZ-goMFxZOU/" },
  { id: 10, image: "/instagram/post-10.jpg", permalink: "https://www.instagram.com/p/DZ-goRjxWt7/" },
  { id: 11, image: "/instagram/post-11.jpg", permalink: "https://www.instagram.com/p/DUJlf-ejhwM/" },
  { id: 12, image: "/instagram/post-12.jpg", permalink: "https://www.instagram.com/p/DT3ffAtDqBE/" },
  { id: 13, image: "/instagram/post-13.jpg", permalink: "https://www.instagram.com/p/DTxj8LQjvo2/" },
  { id: 14, image: "/instagram/post-14.jpg", permalink: "https://www.instagram.com/p/DQunYGZkrrN/" },
  { id: 15, image: "/instagram/post-15.jpg", permalink: "https://www.instagram.com/p/DQCt4OtDuf6/" },
];

/** Post 2 — frase de abertura */
export const leadQuote =
  "Se você valoriza artes bem feitas e duráveis, com um alto nível de dedicação, me chama no WhatsApp que está no link da bio.";

export const media = {
  profile: "/instagram/profile.jpg",
} as const;
