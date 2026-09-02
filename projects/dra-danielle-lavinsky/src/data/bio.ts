/**
 * Link tree / bio — fontes: site.ts + Instagram @dra.daniellelavinsky
 */
import { media, site } from "./site";
import { whatsappServiceUrl, whatsappUrl } from "@/lib/whatsapp";

export type BioLink = {
  id: string;
  label: string;
  description?: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "whatsapp" | "ghost";
  icon?: "whatsapp" | "instagram" | "site" | "map" | "phone" | "arrow";
};

export const bio = {
  profile: media.profile,
  name: site.name,
  handle: site.instagram.handle,
  followers: site.instagram.followers,
  /** Caption Instagram post-5 — apresentação */
  tagline:
    "Cirurgiã-dentista há mais de 20 anos · DTM, Dor Orofacial e Odontologia do Sono",
  bio: "Conteúdos baseados em ciência e cuidado — para ajudar você a compreender melhor a sua saúde bucal e mandibular.",
  credential: `${site.cro} · ${site.clinic.name} · Porto Alegre`,
  source: "Instagram @dra.daniellelavinsky",
  links: [
    {
      id: "wa-agendar",
      label: "Agendar consulta",
      description: "Manda um oi — a gente combina dia e horário",
      href: whatsappUrl(),
      external: true,
      variant: "whatsapp",
      icon: "whatsapp",
    },
    {
      id: "site",
      label: "Site completo",
      description: "Atendimentos, FAQ e localização",
      href: "/",
      icon: "site",
    },
    {
      id: "instagram",
      label: site.instagram.handle,
      description: `${site.instagram.followers.toLocaleString("pt-BR")} seguidores · conteúdos sobre DTM`,
      href: site.instagram.url,
      external: true,
      icon: "instagram",
    },
    {
      id: "dtm",
      label: "Consulta DTM e dor orofacial",
      href: whatsappServiceUrl("Consulta DTM e dor orofacial"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "placa",
      label: "Placa para bruxismo e sono",
      href: whatsappServiceUrl("Placa para bruxismo e sono"),
      external: true,
      variant: "ghost",
      icon: "arrow",
    },
    {
      id: "local",
      label: "Clínica Lavinsky — Moinhos",
      description: site.clinic.address,
      href: `https://maps.google.com/maps?q=${site.clinic.mapQuery}`,
      external: true,
      icon: "map",
    },
    {
      id: "phone",
      label: site.whatsapp.display,
      href: `tel:+${site.whatsapp.number}`,
      external: true,
      icon: "phone",
    },
  ] satisfies BioLink[],
} as const;
