export const site = {
  name: "Octávio Pucci Tattoo",
  whatsapp: "5515997499178",
  instagram: {
    handle: "@octaviopuccitattoo",
    url: "https://www.instagram.com/octaviopuccitattoo/",
    profileUrl: "https://www.instagram.com/octaviopuccitattoo/",
  },
  assets: {
    logo: "/instagram/profile.jpg",
    hero: "/instagram/post-24.jpg",
    artist: "/portfolio/tatuador-octavio-trabalhando-pescoco.jpg",
  },
  /** Hero film roll — seleção variada do feed */
  heroRoll: [
    "/instagram/post-24.jpg",
    "/instagram/post-14.jpg",
    "/instagram/post-8.jpg",
    "/instagram/post-13.jpg",
    "/instagram/post-22.jpg",
    "/instagram/post-17.jpg",
    "/instagram/post-23.jpg",
    "/instagram/post-2.jpg",
  ],
  styles: [
    { image: "/instagram/post-8.jpg" },
    { image: "/instagram/post-16.jpg" },
    { image: "/instagram/post-18.jpg" },
  ],
  gallery: [
    {
      type: "video" as const,
      src: "/portfolio/homenagem-filhos-leao-familia-braco.mp4",
      poster: "/portfolio/homenagem-filhos-leao-familia-braco-poster.jpg",
      category: "blackgrey" as const,
      alt: "Tatuagem realista preto e cinza no braço: leão, mãos em soquinho de pai e filho e cena de família na praia, em homenagem aos filhos.",
    },
    {
      type: "video" as const,
      src: "/portfolio/escadaria-ceu-pombas-braco.mp4",
      poster: "/portfolio/escadaria-ceu-pombas-braco-poster.jpg",
      category: "blackgrey" as const,
      alt: "Tatuagem realista preto e cinza no braço: escadaria com portões abertos, nuvens, pombas e uma flor.",
    },
    {
      type: "video" as const,
      src: "/portfolio/duality-leao-perna.mp4",
      poster: "/portfolio/duality-leao-perna-poster.jpg",
      category: "blackgrey" as const,
      alt: "Tatuagem realista preto e cinza na panturrilha: leão rugindo com a face dividida ao meio (Duality).",
    },
    {
      type: "video" as const,
      src: "/portfolio/hannya-costas-fechamento.mp4",
      poster: "/portfolio/hannya-costas-fechamento-poster.jpg",
      category: "blackgrey" as const,
      alt: "Fechamento de costas completo com máscara Hannya, flor e nuvens orientais em preto e cinza, feito em 2 sessões.",
    },
    {
      type: "video" as const,
      src: "/portfolio/ouroboros-cobra-pulso.mp4",
      poster: "/portfolio/ouroboros-cobra-pulso-poster.jpg",
      category: "blackgrey" as const,
      alt: "Ouroboros: cobra realista preto e cinza envolvendo o pulso como bracelete, do estêncil ao resultado final.",
    },
    {
      type: "video" as const,
      src: "/portfolio/tigre-coruja-fechamento-braco.mp4",
      poster: "/portfolio/tigre-coruja-fechamento-braco-poster.jpg",
      category: "blackgrey" as const,
      alt: "Fechamento de braço realista preto e cinza com tigre de olhos azuis, coruja e rosas.",
    },
    {
      type: "video" as const,
      src: "/portfolio/anjo-pombas-joelho.mp4",
      poster: "/portfolio/anjo-pombas-joelho-poster.jpg",
      category: "blackgrey" as const,
      alt: "Tatuagem no joelho em preto e cinza com detalhes em vermelho: figura angelical, pomba e raios de luz.",
    },
    {
      type: "video" as const,
      src: "/portfolio/olho-martini-bitcoin-antebraco.mp4",
      poster: "/portfolio/olho-martini-bitcoin-antebraco-poster.jpg",
      category: "blackgrey" as const,
      alt: "Tatuagem realista preto e cinza no antebraço: olho, taça de martíni com um olho e moedas com símbolo de Bitcoin.",
    },
    {
      type: "video" as const,
      src: "/portfolio/mitologia-grega-fechamento-braco.mp4",
      poster: "/portfolio/mitologia-grega-fechamento-braco-poster.jpg",
      category: "blackgrey" as const,
      alt: "Fechamento de braço realista preto e cinza com tema de mitologia grega: elmo espartano, guerreiro com cavalo, rosto barbado e grega (meandro).",
    },
    {
      type: "video" as const,
      src: "/portfolio/leao-pomba-antebraco.mp4",
      poster: "/portfolio/leao-pomba-antebraco-poster.jpg",
      category: "blackgrey" as const,
      alt: "Tatuagem realista preto e cinza no antebraço: leão sereno com uma pomba em voo sobre pedras e água.",
    },
    {
      type: "image" as const,
      src: "/portfolio/ohana-lettering-fine-line-antebraco.jpg",
      category: "fineline" as const,
      alt: "Lettering fine line 'OHANA' no antebraço, letras serifadas finas em preto.",
    },
    {
      type: "image" as const,
      src: "/portfolio/memento-vivere-fine-line-antebraco.jpg",
      category: "fineline" as const,
      alt: "Fine line no antebraço: mãos de 'A Criação de Adão' (uma esquelética) com a frase 'MEMENTO VIVERE'.",
    },
  ],
  /** Grid Instagram — ordem própria, sem repetir sequência da galeria */
  instagramGrid: [
    "/instagram/post-6.jpg",
    "/instagram/post-13.jpg",
    "/instagram/post-20.jpg",
    "/instagram/post-4.jpg",
    "/instagram/post-19.jpg",
    "/instagram/post-22.jpg",
    "/instagram/post-1.jpg",
    "/instagram/post-15.jpg",
    "/instagram/post-24.jpg",
  ],
  studioPhotos: [] as const,
  i18nLocales: ["pt"] as const,
} as const;

export type GalleryFilterCategory = "blackgrey" | "fineline";
export type GalleryCategory = "all" | GalleryFilterCategory;

export type GalleryItem =
  | {
      type: "image";
      src: string;
      alt: string;
      category: GalleryFilterCategory;
    }
  | {
      type: "video";
      src: string;
      poster: string;
      alt: string;
      category: GalleryFilterCategory;
    };

export const INSTAGRAM_URL = site.instagram.url;
