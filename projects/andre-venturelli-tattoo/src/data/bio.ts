/**
 * Link tree — André Ventureli Tattoo
 */
import { site } from "./site";
import { instagramUrl, mapsUrl, portfolioUrl, styleContactUrl, whatsappUrl } from "@/lib/contact";

export type BioLink = {
  id: string;
  label: string;
  description?: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "accent" | "ghost";
  icon?: "whatsapp" | "instagram" | "site" | "map" | "arrow";
};

export const bio = {
  profile: site.assets.artist,
  name: "André Ventureli",
  title: "Tatuador · Sorocaba/SP",
  handle: site.instagram.handle,
  tagline: "Realismo · Coberturas · Fineline · Old School",
  bio: "Mais de 24 anos transformando ideias em arte permanente. Estúdio exclusivo, atendimento individualizado.",
  credential: "Estúdio exclusivo em Sorocaba — Av. Washington Luiz, 310",
  source: "andreventurelitattoo.com.br",
  links: [
    {
      id: "orcamento",
      label: "Fazer orçamento",
      description: "WhatsApp — resposta rápida",
      href: whatsappUrl(),
      external: true,
      variant: "accent",
      icon: "whatsapp",
    },
    {
      id: "site",
      label: "Site completo",
      description: "Portfólio, estúdio e processo",
      href: "/",
      icon: "site",
    },
    {
      id: "portfolio",
      label: "Ver portfólio",
      description: "Realismo, coberturas e delicadas",
      href: portfolioUrl(),
      icon: "arrow",
    },
    {
      id: "instagram",
      label: site.instagram.handle,
      description: "Trabalhos recentes e bastidores",
      href: instagramUrl(),
      external: true,
      icon: "instagram",
    },
    {
      id: "maps",
      label: "Como chegar",
      description: "Av. Washington Luiz, 310 — Sala 81",
      href: mapsUrl(),
      external: true,
      icon: "map",
    },
    {
      id: "realismo",
      label: "Realismo preto e cinza",
      href: styleContactUrl("Realismo preto e cinza"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "cobertura",
      label: "Coberturas",
      href: styleContactUrl("Cobertura"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "fineline",
      label: "Delicadas & Fineline",
      href: styleContactUrl("Delicadas / Fineline"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
  ] satisfies BioLink[],
} as const;
