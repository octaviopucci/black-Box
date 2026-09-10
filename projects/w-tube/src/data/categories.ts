import type { Category } from "@/types";
import { productImages as img } from "./images";

export const categories: Category[] = [
  {
    slug: "iphones",
    name: "iPhones",
    description: "Linha completa de iPhones novos e seminovos selecionados.",
    image: img.iphonePro,
    featured: true,
    keywords: ["iphone", "apple", "smartphone"],
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "Smartphones de diversas marcas com ótimo custo-benefício.",
    image: img.smartphone,
    keywords: ["smartphone", "android", "celular"],
  },
  {
    slug: "airpods-fones",
    name: "AirPods e Fones",
    description: "AirPods, fones Bluetooth e headphones sem fio.",
    image: img.airpods,
    featured: true,
    keywords: ["airpods", "fone", "headphone", "audio"],
  },
  {
    slug: "smartwatches",
    name: "Smartwatches",
    description: "Apple Watch e smartwatches compatíveis.",
    image: img.watch,
    featured: true,
    keywords: ["apple watch", "smartwatch", "relogio"],
  },
  {
    slug: "capinhas",
    name: "Capinhas",
    description: "Capinhas transparentes, silicone, MagSafe e proteção reforçada.",
    image: img.case,
    featured: true,
    keywords: ["capinha", "case", "protecao"],
  },
  {
    slug: "peliculas",
    name: "Películas",
    description: "Películas de vidro, privacidade e proteção de câmera.",
    image: img.screen,
    keywords: ["pelicula", "vidro", "privacidade"],
  },
  {
    slug: "carregadores",
    name: "Carregadores",
    description: "Fontes rápidas, MagSafe, veiculares e mais.",
    image: img.charger,
    featured: true,
    keywords: ["carregador", "fonte", "magsafe"],
  },
  {
    slug: "cabos",
    name: "Cabos",
    description: "Cabos USB-C, Lightning e reforçados.",
    image: img.cable,
    keywords: ["cabo", "usb-c", "lightning"],
  },
  {
    slug: "fontes",
    name: "Fontes",
    description: "Fontes de alimentação para diversos dispositivos.",
    image: img.chargerAlt,
    keywords: ["fonte", "adaptador"],
  },
  {
    slug: "power-banks",
    name: "Power Banks",
    description: "Baterias portáteis para carregar onde você estiver.",
    image: img.powerbank,
    keywords: ["power bank", "bateria portatil"],
  },
  {
    slug: "suportes",
    name: "Suportes",
    description: "Suportes para mesa, carro e uso diário.",
    image: img.stand,
    keywords: ["suporte", "stand"],
  },
  {
    slug: "acessorios-carro",
    name: "Acessórios para carro",
    description: "Carregadores veiculares, suportes e mais.",
    image: img.car,
    keywords: ["carro", "veicular", "suporte"],
  },
  {
    slug: "audio",
    name: "Áudio",
    description: "Caixas Bluetooth, fones e acessórios de áudio.",
    image: img.speaker,
    keywords: ["audio", "som", "bluetooth"],
  },
  {
    slug: "eletronicos",
    name: "Eletrônicos",
    description: "Hubs, adaptadores e eletrônicos diversos.",
    image: img.hub,
    keywords: ["eletronico", "hub", "adaptador"],
  },
  {
    slug: "ofertas",
    name: "Ofertas",
    description: "Promoções e condições exclusivas da semana.",
    image: img.iphone,
    featured: true,
    keywords: ["oferta", "promocao", "desconto"],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
