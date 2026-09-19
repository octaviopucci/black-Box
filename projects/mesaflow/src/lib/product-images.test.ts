import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  FOOD_PRESETS,
  isStockProductImageUrl,
  PRODUCT_IMAGES,
  sanitizeProductImageUrl,
} from "./product-images";

function runUnitTests() {
  const pexels = PRODUCT_IMAGES.p_xburger;
  assert.equal(isStockProductImageUrl(pexels), true);
  assert.equal(isStockProductImageUrl(FOOD_PRESETS.default), true);
  assert.equal(isStockProductImageUrl("https://picsum.photos/200"), true);
  assert.equal(isStockProductImageUrl("https://cdn.example.com/menu/burger.jpg"), false);
  assert.equal(sanitizeProductImageUrl(pexels), undefined);
  assert.equal(sanitizeProductImageUrl("https://blob.vercel-storage.com/photo.jpg"), "https://blob.vercel-storage.com/photo.jpg");
  assert.equal(sanitizeProductImageUrl(""), undefined);
  assert.equal(sanitizeProductImageUrl(undefined), undefined);

  console.log("product-images.test.ts unit OK");
}

async function runPersistTests() {
  const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-product-image-"));
  process.env.MESAFLOW_DATA = join(tempDir, "store.json");

  const {
    createAdminProduct,
    getStore,
    listAdminProducts,
    resetPersistedStoreCacheForTests,
    saveStore,
    updateAdminProduct,
  } = await import("./store");

  resetPersistedStoreCacheForTests();
  const store = getStore();
  const establishment = Object.values(store.establishments)[0];
  assert.ok(establishment);

  const catalog = listAdminProducts(establishment.id);
  const created = (() => {
    const result = createAdminProduct(establishment.id, {
      categoryId: catalog.categories[0].id,
      sectorId: catalog.sectors[0].id,
      name: "Sem Foto Burger",
      description: "Produto sem imagem",
      price: 12,
      prepMinutes: 5,
      availability: "VITRINE",
    });
    if ("error" in result) throw new Error(result.error);
    return result.value;
  })();
  assert.equal(created.image, undefined);

  resetPersistedStoreCacheForTests();
  const reloaded = getStore().products[created.id];
  assert.equal(reloaded?.image, undefined);

  const withStock = updateAdminProduct(establishment.id, created.id, {
    image: PRODUCT_IMAGES.p_xburger,
  });
  if ("error" in withStock) throw new Error(withStock.error);
  assert.equal(withStock.value.image, undefined);

  const withReal = updateAdminProduct(establishment.id, created.id, {
    image: "https://blob.vercel-storage.com/mesaflow/test.jpg",
  });
  if ("error" in withReal) throw new Error(withReal.error);
  assert.equal(withReal.value.image, "https://blob.vercel-storage.com/mesaflow/test.jpg");

  const cleared = updateAdminProduct(establishment.id, created.id, { image: null });
  if ("error" in cleared) throw new Error(cleared.error);
  assert.equal(cleared.value.image, undefined);

  resetPersistedStoreCacheForTests();
  const afterClear = getStore().products[created.id];
  assert.equal(afterClear?.image, undefined);

  const disk = JSON.parse(readFileSync(process.env.MESAFLOW_DATA!, "utf8"));
  const staleProduct = Object.values(store.products)[0] as { id: string; image?: string };
  disk.products[staleProduct.id] = {
    ...disk.products[staleProduct.id],
    image: FOOD_PRESETS.burger,
  };
  saveStore(disk);
  resetPersistedStoreCacheForTests();
  const migrated = getStore().products[staleProduct.id];
  assert.equal(migrated?.image, undefined, "migrate must strip stock URLs on hydrate");

  rmSync(tempDir, { recursive: true, force: true });
  delete process.env.MESAFLOW_DATA;

  console.log("product-images.test.ts persist OK");
}

async function run() {
  runUnitTests();
  await runPersistTests();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
