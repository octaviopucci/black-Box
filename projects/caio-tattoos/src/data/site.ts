/** Posts com vida pessoal, família ou lifestyle — fora do portfólio profissional. */
export const personalPostIds = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23,
  24, 25, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 45, 48, 50,
  52, 56,
]);

/** Trabalho old school free hand — foco na tatuagem, sem cenas pessoais. */
const oldschoolIds = [17] as const;

/** Customização Adidas Running — produto e processo, sem rostos/família. */
const adidasIds = [26, 27, 43, 44, 46, 47, 49, 51, 53, 54, 55, 57] as const;

function galleryEntry(id: number, category: "oldschool" | "adidas") {
  return { src: `/instagram/post-${id}.jpg`, category } as const;
}

export const site = {
  name: "Caio Tattoos",
  whatsapp: "",
  instagram: {
    handle: "@caiotattoos",
    url: "https://www.instagram.com/caiotattoos",
    profileUrl: "https://www.instagram.com/caiotattoos",
    followers: 68131,
  },
  assets: {
    logo: "/instagram/profile.jpg",
    hero: "/instagram/post-17.jpg",
    artist: "/instagram/profile.jpg",
    instagram: "/instagram/post-44.jpg",
  },
  heroRoll: [
    "/instagram/post-17.jpg",
    "/instagram/post-44.jpg",
    "/instagram/post-46.jpg",
    "/instagram/post-53.jpg",
    "/instagram/post-55.jpg",
    "/instagram/post-43.jpg",
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
} as const;

export type GalleryCategory = "all" | "oldschool" | "adidas";

export type PortfolioCategory = Exclude<GalleryCategory, "all">;
