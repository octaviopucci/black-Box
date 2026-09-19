import assert from "node:assert/strict";
import {
  applyMarceloLanchesCatalog,
  findMarceloEstablishment,
  isMarceloLikeEstablishment,
  MARCELO_ESTABLISHMENT_SLUG,
} from "./seed-marcelo-lanches";
import { emptyStore } from "./store";
import type { MesaFlowStore } from "./types";

function run() {
  const store = emptyStore() as MesaFlowStore;
  store.establishments.est_demo = {
    id: "est_demo",
    slug: "outro-lugar",
    name: "Outro Lugar",
    open: true,
    rodizioEnabled: false,
    settings: {
      currency: "BRL",
      allowEditAfterPrep: false,
      soundNotifications: true,
      minIntervalRodizioSec: 120,
    },
    createdAt: new Date().toISOString(),
  };
  store.products.p_demo = {
    id: "p_demo",
    establishmentId: "est_demo",
    categoryId: "cat_demo",
    sectorId: "sec_demo",
    name: "Demo",
    description: "Não apagar",
    price: 1,
    tags: [],
    prepMinutes: 1,
    availability: "VITRINE",
    featured: false,
    active: true,
    variants: [],
    addons: [],
    rodizioIncluded: false,
  };

  assert.equal(isMarceloLikeEstablishment({ slug: "marcelo-lanches", name: "Marcelo Lanches" }), true);
  assert.equal(isMarceloLikeEstablishment({ slug: "lanches-do-marcelo", name: "Lanches" }), true);
  assert.equal(isMarceloLikeEstablishment({ slug: "outro", name: "Marcelo Lanches" }), true);

  const missing = applyMarceloLanchesCatalog(store);
  assert.equal(missing.ok, false);

  const created = applyMarceloLanchesCatalog(store, { createIfMissing: true });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("expected ok");
  assert.equal(created.slug, MARCELO_ESTABLISHMENT_SLUG);
  assert.equal(created.categories, 9);
  assert.equal(created.products, 50);
  assert.ok(store.products.p_demo, "other establishment products untouched");

  const burguer = store.products.ml_p_burguer;
  assert.ok(burguer);
  assert.equal(burguer.variants.length, 2);
  assert.equal(burguer.addons.length, 12);
  assert.ok(!Object.values(store.categories).some((c) => c.name === "Acréscimos"));
  for (const product of Object.values(store.products)) {
    if (product.establishmentId !== created.establishmentId) continue;
    assert.equal(product.image, undefined, `${product.name} must not have image`);
  }

  const reimport = applyMarceloLanchesCatalog(store);
  assert.equal(reimport.ok, true);
  if (!reimport.ok) throw new Error("expected ok");
  assert.equal(reimport.products, 50);

  store.establishments.est_ml = {
    id: "est_ml",
    slug: "lanches-marcelo-sp",
    name: "Marcelo Lanches",
    open: true,
    rodizioEnabled: false,
    settings: {
      currency: "BRL",
      allowEditAfterPrep: false,
      soundNotifications: true,
      minIntervalRodizioSec: 120,
    },
    createdAt: new Date().toISOString(),
  };
  assert.equal(findMarceloEstablishment(store)?.id, created.establishmentId);

  const targeted = applyMarceloLanchesCatalog(store, { establishmentId: "est_ml" });
  assert.equal(targeted.ok, true);
  if (!targeted.ok) throw new Error("expected ok");
  assert.equal(targeted.establishmentId, "est_ml");
  assert.equal(targeted.products, 50);

  console.log("✓ seed-marcelo-lanches: catalog import idempotent, extras as addons");
}

run();
