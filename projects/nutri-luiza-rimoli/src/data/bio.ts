/**
 * Link tree / bio — fontes: site.ts + Instagram @nutri.luiza.rimoli
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
  icon?: "instagram" | "site" | "map" | "arrow" | "clinic";
};

export const bio = {
  profile: media.profile,
  name: site.name,
  title: site.title,
  handle: site.instagram.handle,
  followers: site.instagram.followers,
  tagline: site.specialty,
  bio: "Reeducação alimentar com escuta, cuidado e plano personalizado — Unicamp e USP.",
  credential: `${site.credentials.formation} · ${site.clinic.name}`,
  source: "Instagram @nutri.luiza.rimoli",
  links: [
    {
      id: "agendar",
      label: "Agendar consulta",
      description: "Chama no Instagram — a gente combina",
      href: contactUrl(),
      external: true,
      variant: "accent",
      icon: "instagram",
    },
    {
      id: "site",
      label: "Site completo",
      description: "Atendimentos, abordagem e feed",
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
      id: "clinica",
      label: "Nutrição clínica",
      href: serviceContactUrl("Nutrição clínica"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "esportiva",
      label: "Nutrição esportiva",
      href: serviceContactUrl("Nutrição esportiva"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "levitta",
      label: site.clinic.name,
      description: site.clinic.handle,
      href: site.clinic.instagram,
      external: true,
      icon: "clinic",
    },
  ] satisfies BioLink[],
} as const;
