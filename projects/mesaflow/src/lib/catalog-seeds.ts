import { catalogSeedMetaForEstablishment, CATALOG_SEED_REGISTRY } from "./catalog-seed-registry";
import { importMarceloLanchesCatalog } from "./store";
import type { Establishment } from "./types";

export type CatalogSeedImportResult =
  | { ok: true; establishmentId: string; slug: string; categories: number; products: number }
  | { ok: false; error: string };

const IMPORT_BY_SEED_ID: Record<
  string,
  (options: { establishmentId: string; createIfMissing?: boolean }) => Promise<CatalogSeedImportResult> | CatalogSeedImportResult
> = {
  "marcelo-lanches": importMarceloLanchesCatalog,
};

export function catalogSeedForEstablishment(
  establishment: Pick<Establishment, "id" | "slug" | "name">,
) {
  const meta = catalogSeedMetaForEstablishment(establishment);
  if (!meta) return null;
  const importCatalog = IMPORT_BY_SEED_ID[meta.id];
  if (!importCatalog) return null;
  return { ...meta, importCatalog };
}

export { CATALOG_SEED_REGISTRY, catalogSeedMetaForEstablishment };
