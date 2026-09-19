import { isMarceloLikeEstablishment } from "./seed-marcelo-lanches";

export type CatalogSeedMeta = {
  id: string;
  label: string;
  description: string;
  matches: (establishment: { id: string; slug: string; name: string }) => boolean;
};

export const CATALOG_SEED_REGISTRY: CatalogSeedMeta[] = [
  {
    id: "marcelo-lanches",
    label: "Marcelo Lanches",
    description:
      "Cardápio seed completo (lanches, porções, bebidas). Categorias e produtos atuais do lojista serão substituídos.",
    matches: isMarceloLikeEstablishment,
  },
];

export function catalogSeedMetaForEstablishment(establishment: {
  id: string;
  slug: string;
  name: string;
}): CatalogSeedMeta | null {
  return CATALOG_SEED_REGISTRY.find((seed) => seed.matches(establishment)) ?? null;
}
