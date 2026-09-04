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
    hero: "/instagram/post-13.jpg",
    artist: "/instagram/post-9.jpg",
  },
  /** Hero film roll — fotos distintas da galeria principal */
  heroRoll: [
    "/instagram/post-3.jpg",
    "/instagram/post-4.jpg",
    "/instagram/post-11.jpg",
    "/instagram/post-13.jpg",
    "/instagram/post-9.jpg",
    "/instagram/post-2.jpg",
  ],
  styles: [
    { image: "/instagram/post-3.jpg" },
    { image: "/instagram/post-5.jpg" },
    { image: "/instagram/post-11.jpg" },
  ],
  gallery: [
    { src: "/instagram/post-1.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-2.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-3.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-4.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-5.jpg", category: "colorido" as const },
    { src: "/instagram/post-6.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-7.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-8.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-9.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-10.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-11.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-12.jpg", category: "colorido" as const },
    { src: "/instagram/post-13.jpg", category: "blackgrey" as const },
  ],
  /** Grid Instagram — ordem diferente da galeria para não repetir visual */
  instagramGrid: [
    "/instagram/post-6.jpg",
    "/instagram/post-10.jpg",
    "/instagram/post-12.jpg",
    "/instagram/post-7.jpg",
    "/instagram/post-8.jpg",
    "/instagram/post-1.jpg",
    "/instagram/post-5.jpg",
    "/instagram/post-2.jpg",
    "/instagram/post-4.jpg",
  ],
} as const;

export type GalleryCategory = "all" | "blackgrey" | "colorido";

export const INSTAGRAM_URL = site.instagram.url;
