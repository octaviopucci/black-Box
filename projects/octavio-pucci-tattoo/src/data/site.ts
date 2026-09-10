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
    artist: "/instagram/post-9.jpg",
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
    { src: "/instagram/post-2.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-3.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-4.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-5.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-6.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-7.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-8.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-13.jpg", category: "colorido" as const },
    { src: "/instagram/post-14.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-15.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-16.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-17.jpg", category: "colorido" as const },
    { src: "/instagram/post-18.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-19.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-20.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-21.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-22.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-23.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-24.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-9.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-10.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-11.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-12.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-1.jpg", category: "blackgrey" as const },
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

export type GalleryCategory = "all" | "blackgrey" | "colorido";

export const INSTAGRAM_URL = site.instagram.url;
