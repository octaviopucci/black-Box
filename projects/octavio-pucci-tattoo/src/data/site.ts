export const site = {
  name: "Octávio Pucci Tattoo",
  instagram: {
    handle: "@octaviopuccitattoo",
    url: "https://www.instagram.com/octaviopuccitattoo/",
    profileUrl: "https://www.instagram.com/octaviopuccitattoo/",
  },
  assets: {
    logo: "/instagram/profile.jpg",
    hero: "/instagram/post-5.jpg",
    artist: "/instagram/profile.jpg",
  },
  heroRoll: [
    "/instagram/profile.jpg",
    "/instagram/post-5.jpg",
    "/instagram/post-6.jpg",
    "/instagram/post-3.jpg",
    "/instagram/post-2.jpg",
    "/instagram/post-4.jpg",
  ],
  styles: [
    { image: "/instagram/post-5.jpg" },
    { image: "/instagram/post-7.jpg" },
    { image: "/instagram/post-3.jpg" },
  ],
  gallery: [
    { src: "/instagram/post-1.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-2.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-3.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-4.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-5.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-6.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-7.jpg", category: "colorido" as const },
    { src: "/instagram/post-8.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-9.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-10.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-11.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-12.jpg", category: "colorido" as const },
    { src: "/instagram/post-13.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-14.jpg", category: "blackgrey" as const },
    { src: "/instagram/post-15.jpg", category: "blackgrey" as const },
  ],
} as const;

export type GalleryCategory = "all" | "blackgrey" | "colorido";

export const INSTAGRAM_URL = site.instagram.url;
