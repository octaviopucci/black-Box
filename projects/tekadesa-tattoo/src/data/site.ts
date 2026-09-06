function galleryEntry(
  file: string,
  category: "fineline" | "delicadas",
) {
  return { src: `/gallery/${file}`, category } as const;
}

const finelineWorks = [
  "work-01.jpeg", "work-02.jpeg", "work-03.jpeg", "work-04.jpg", "work-05.jpeg",
  "work-06.jpg", "work-07.jpeg", "work-08.jpeg", "work-09.jpeg", "work-10.jpeg",
  "work-11.jpeg", "work-12.jpeg", "work-13.jpeg", "work-14.jpg", "work-15.jpeg",
  "work-16.jpeg", "work-17.jpeg", "work-18.jpeg", "work-19.jpg", "work-20.jpg",
  "work-21.jpg", "work-22.jpg",
] as const;

const delicadasWorks = [
  "work-23.jpg", "work-24.jpg", "work-25.jpg", "work-26.jpg", "work-27.jpg",
  "work-28.jpg", "work-29.jpg", "work-30.jpg",
] as const;

export const site = {
  name: "Stella de Sá",
  whatsapp: "5511989862547",
  instagram: {
    handle: "@tekadesa.tatuadora",
    url: "https://www.instagram.com/tekadesa.tatuadora/",
    profileUrl: "https://www.instagram.com/tekadesa.tatuadora/",
    followers: 0,
  },
  address: {
    line1: "Praça das Flôres, 12 — Alphaville Comercial",
    line2: "Barueri, SP — CEP 06453-010",
  },
  mapsEmbed:
    "https://maps.google.com/maps?q=Pra%C3%A7a+das+Fl%C3%B4res,+12,+Alphaville+Comercial,+Barueri,+SP&hl=pt&z=16&output=embed",
  bookingDepositBrl: 150,
  assets: {
    logo: "/hero/stella-portrait.jpeg",
    hero: "/hero/stella-hero.jpeg",
    artist: "/hero/stella-portrait.jpeg",
    instagram: "/gallery/work-05.jpeg",
  },
  heroRoll: [
    "/hero/stella-hero.jpeg",
    "/hero/stella-portrait.jpeg",
    "/gallery/work-01.jpeg",
    "/gallery/work-08.jpeg",
    "/gallery/work-12.jpeg",
    "/gallery/work-19.jpg",
    "/gallery/work-24.jpg",
    "/gallery/work-27.jpg",
  ],
  styles: [
    {
      image: "/gallery/work-03.jpeg",
      anchor: "#trabalhos",
    },
    {
      image: "/gallery/work-15.jpeg",
      anchor: "#trabalhos",
    },
    {
      image: "/gallery/work-28.jpg",
      anchor: "#trabalhos",
    },
  ],
  gallery: [
    ...finelineWorks.map((file) => galleryEntry(file, "fineline")),
    ...delicadasWorks.map((file) => galleryEntry(file, "delicadas")),
  ],
  services: [
    { name: "Flash Tattoo", desc: "Tatuagem simples até 5cm" },
    { name: "Combo Mini Tattoos", desc: "3 flash tattoos até 4cm" },
    { name: "Tatuagens Delicadas", desc: "Personalizadas até 8cm" },
    { name: "Tatuagem Estilo Glitter", desc: "Arte com efeito brilhante" },
    { name: "Gold Tattoo", desc: "Estilo dourado exclusivo" },
    { name: "Fineline 15cm", desc: "Detalhes impressionantes até 15cm" },
    { name: "Fechamento", desc: "Projetos de fechamento e cobertura" },
    { name: "Consultoria", desc: "Consultoria pré-tatuagem" },
  ],
} as const;

export type GalleryCategory = "all" | "fineline" | "delicadas";
