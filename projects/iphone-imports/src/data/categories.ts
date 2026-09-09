import type { Category } from "@/types";

const appleImg = (path: string) =>
  `https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/${path}`;

export const categories: Category[] = [
  {
    slug: "iphones",
    name: "iPhones",
    description: "Linha completa de iPhones novos e seminovos selecionados.",
    image: appleImg("iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=800&hei=800&fmt=png-alpha&qlt=80"),
    featured: true,
    keywords: ["iphone", "apple", "smartphone"],
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "Smartphones de diversas marcas com ótimo custo-benefício.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
    keywords: ["smartphone", "android", "celular"],
  },
  {
    slug: "airpods-fones",
    name: "AirPods e Fones",
    description: "AirPods, fones Bluetooth e headphones sem fio.",
    image: appleImg("airpods-pro-2-hero-select-202409?wid=800&hei=800&fmt=png-alpha&qlt=80"),
    featured: true,
    keywords: ["airpods", "fone", "headphone", "audio"],
  },
  {
    slug: "smartwatches",
    name: "Smartwatches",
    description: "Apple Watch e smartwatches compatíveis.",
    image: appleImg("apple-watch-series-10-46mm-rose-gold-aluminum-rose-clover-sport-band-46mm-rose-clover-202409?wid=800&hei=800&fmt=png-alpha&qlt=80"),
    featured: true,
    keywords: ["apple watch", "smartwatch", "relogio"],
  },
  {
    slug: "capinhas",
    name: "Capinhas",
    description: "Capinhas transparentes, silicone, MagSafe e proteção reforçada.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop",
    featured: true,
    keywords: ["capinha", "case", "protecao"],
  },
  {
    slug: "peliculas",
    name: "Películas",
    description: "Películas de vidro, privacidade e proteção de câmera.",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop",
    keywords: ["pelicula", "vidro", "privacidade"],
  },
  {
    slug: "carregadores",
    name: "Carregadores",
    description: "Fontes rápidas, MagSafe, veiculares e mais.",
    image: "https://images.unsplash.com/photo-1591290619769-c4d8d281d761?w=800&h=800&fit=crop",
    featured: true,
    keywords: ["carregador", "fonte", "magsafe"],
  },
  {
    slug: "cabos",
    name: "Cabos",
    description: "Cabos USB-C, Lightning e reforçados.",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop",
    keywords: ["cabo", "usb-c", "lightning"],
  },
  {
    slug: "fontes",
    name: "Fontes",
    description: "Fontes de alimentação para diversos dispositivos.",
    image: "https://images.unsplash.com/photo-1583394838336-acd97736f268?w=800&h=800&fit=crop",
    keywords: ["fonte", "adaptador"],
  },
  {
    slug: "power-banks",
    name: "Power Banks",
    description: "Baterias portáteis para carregar onde você estiver.",
    image: "https://images.unsplash.com/photo-1609091839311-ffe795c1b3d2?w=800&h=800&fit=crop",
    keywords: ["power bank", "bateria portatil"],
  },
  {
    slug: "suportes",
    name: "Suportes",
    description: "Suportes para mesa, carro e uso diário.",
    image: "https://images.unsplash.com/photo-1616344446565-83a7ce3b31d3?w=800&h=800&fit=crop",
    keywords: ["suporte", "stand"],
  },
  {
    slug: "acessorios-carro",
    name: "Acessórios para carro",
    description: "Carregadores veiculares, suportes e mais.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=800&fit=crop",
    keywords: ["carro", "veicular", "suporte"],
  },
  {
    slug: "audio",
    name: "Áudio",
    description: "Caixas Bluetooth, fones e acessórios de áudio.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop",
    keywords: ["audio", "som", "bluetooth"],
  },
  {
    slug: "eletronicos",
    name: "Eletrônicos",
    description: "Hubs, adaptadores e eletrônicos diversos.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=800&fit=crop",
    keywords: ["eletronico", "hub", "adaptador"],
  },
  {
    slug: "ofertas",
    name: "Ofertas",
    description: "Promoções e condições exclusivas da semana.",
    image: appleImg("iphone-16-finish-select-202409-6-1inch-ultramarine?wid=800&hei=800&fmt=png-alpha&qlt=80"),
    featured: true,
    keywords: ["oferta", "promocao", "desconto"],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
