/**
 * Link tree — @dra.barbaraalencar
 */
import { media, site } from "./site";
import { contactUrl, instagramUrl, serviceContactUrl } from "@/lib/contact";

export type BioLink = {
  id: string;
  label: string;
  description?: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "accent" | "ghost";
  icon?: "instagram" | "site" | "arrow";
};

export const bio = {
  profile: media.profile,
  name: site.name,
  title: site.title,
  handle: site.instagram.handle,
  followers: site.instagram.followers,
  tagline: site.specialty,
  bio: "Estética facial com naturalidade — respeito, planejamento e resultados que integram ao seu rosto.",
  credential: site.hero.credential,
  source: "Instagram @dra.barbaraalencar",
  links: [
    {
      id: "agendar",
      label: "Agendar avaliação",
      description: "Chama no Instagram — conversamos com calma",
      href: contactUrl(),
      external: true,
      variant: "accent",
      icon: "instagram",
    },
    {
      id: "site",
      label: "Site completo",
      description: "Abordagem, atendimentos e feed",
      href: "/",
      icon: "site",
    },
    {
      id: "instagram",
      label: site.instagram.handle,
      description: `${site.instagram.followers.toLocaleString("pt-BR")} seguidores`,
      href: instagramUrl(),
      external: true,
      icon: "instagram",
    },
    {
      id: "reestruturacao",
      label: "Reestruturação facial",
      href: serviceContactUrl("Reestruturação facial"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "harmonizacao",
      label: "Harmonização com naturalidade",
      href: serviceContactUrl("Harmonização com naturalidade"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
  ] satisfies BioLink[],
} as const;
