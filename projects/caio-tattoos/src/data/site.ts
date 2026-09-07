/** Posts com vida pessoal, família ou lifestyle — fora do portfólio profissional. */
export const personalPostIds = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34,
  35, 36, 37, 38, 39, 40, 41, 42, 45, 48, 50, 52, 56,
]);

/** Trabalho old school free hand — flash, processo e peças finalizadas. */
const oldschoolIds = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 57] as const;

/** Customização Adidas Running — produto e processo, sem rostos/família. */
const adidasIds = [26, 27, 43, 44, 46, 47, 49, 51, 53, 54, 55] as const;

/** Lifestyle — Caio, corrida, família e bastidores (carrossel Sobre). Sem duplicatas de arquivo. */
const lifestyleIds = [1, 23, 39, 40, 45, 48, 50, 52] as const;

function galleryEntry(id: number, category: "oldschool" | "adidas") {
  return { src: `/instagram/post-${id}.jpg`, category } as const;
}

export const site = {
  name: "Caio Tattoos",
  whatsapp: "5511918401392",
  linktree: "https://linktr.ee/caiorodriguestattoos",
  location: "São Paulo, SP",
  workshop: {
    name: "Viver a Tatuagem",
    url: "https://hotmart.com/pt-br/marketplace/produtos/viver-a-tatuagem/P96292020N",
  },
  instagram: {
    handle: "@caiotattoos",
    url: "https://www.instagram.com/caiotattoos",
    profileUrl: "https://www.instagram.com/caiotattoos",
    followers: 68131,
  },
  sponsors: [
    {
      name: "Electric Ink",
      logo: "/sponsors/electric-ink.png",
      role: "Embaixador oficial",
    },
    {
      name: "Adidas Running",
      logo: "/sponsors/adidas-running.png",
      role: "Customização free hand",
    },
    {
      name: "Icons & Prodigies",
      logo: "/sponsors/icons-prodigies.png",
      role: "Guest artist · Veneza 2026",
    },
  ],
  assets: {
    logo: "/instagram/profile.jpg",
    hero: "/instagram/post-17.jpg",
    artist: "/hero/caio-adidas-portrait.jpg",
    instagram: "/instagram/post-44.jpg",
  },
  heroRoll: [
    "/hero/caio-adidas-portrait.jpg",
    "/instagram/post-17.jpg",
    "/instagram/post-16.jpg",
    "/instagram/post-18.jpg",
    "/instagram/post-44.jpg",
    "/instagram/post-46.jpg",
    "/instagram/post-53.jpg",
    "/instagram/post-55.jpg",
  ],
  styles: [
    {
      image: "/instagram/post-17.jpg",
      anchor: "#tatuagem",
    },
    {
      image: "/instagram/post-44.jpg",
      anchor: "#adidas",
    },
  ],
  gallery: [
    ...oldschoolIds.map((id) => galleryEntry(id, "oldschool")),
    ...adidasIds.map((id) => galleryEntry(id, "adidas")),
  ],
  /** Posts e reels curados — ordem importa (DPhpvIGDCAD primeiro). */
  tattooEmbeds: [
    { kind: "p" as const, shortcode: "DPhpvIGDCAD" },
    { kind: "reel" as const, shortcode: "DX7t4OTTQsy" },
    { kind: "reel" as const, shortcode: "DXy-Mc9zk7T" },
    { kind: "reel" as const, shortcode: "DUk94wDE91B" },
    { kind: "reel" as const, shortcode: "DSC1mTfk9bd" },
  ],
} as const;

export function oldschoolGalleryImages() {
  return site.gallery.filter((item) => item.category === "oldschool").map((item) => item.src);
}

export function lifestyleGalleryImages() {
  const urls = [
    site.assets.artist,
    ...lifestyleIds.map((id) => `/instagram/post-${id}.jpg`),
  ];
  return [...new Set(urls)];
}

export type GalleryCategory = "all" | "oldschool" | "adidas";

export type PortfolioCategory = Exclude<GalleryCategory, "all">;

export type Sponsor = (typeof site.sponsors)[number];

export type RollItem =
  | { kind: "photo"; src: string }
  | { kind: "sponsor"; src: string; name: string };
