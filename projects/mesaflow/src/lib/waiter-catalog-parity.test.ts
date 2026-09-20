import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-waiter-catalog-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-waiter-catalog";

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, listGuestMenuCatalog, listAdminProducts } =
    await import("./store");
  const { resolveOrderLines } = await import("./order-resolve");
  const { createStaffOrder } = await import("./waiter-store");

  resetPersistedStoreCacheForTests();
  const store = getStore();
  const establishment = Object.values(store.establishments).find((e) => e.slug === "ponto-do-sabor");
  assert.ok(establishment, "demo establishment");

  const guestCatalog = listGuestMenuCatalog(establishment.id);
  const adminCatalog = listAdminProducts(establishment.id);

  const guestActiveCategories = guestCatalog.categories.filter((c) => c.active);
  const adminActiveCategories = adminCatalog.categories.filter((c) => c.active);
  assert.equal(
    guestActiveCategories.length,
    adminActiveCategories.length,
    "waiter menu must expose same active category count as guest",
  );

  const guestActiveProducts = guestCatalog.products.filter((p) => p.active);
  const adminActiveProducts = adminCatalog.products.filter((p) => p.active);
  assert.equal(
    guestActiveProducts.length,
    adminActiveProducts.length,
    "waiter menu must expose same active product count as guest",
  );

  const productWithVariant = guestActiveProducts.find((p) => p.variants.length > 0 && p.addons.length > 0);
  assert.ok(productWithVariant, "need product with variant and addon for order parity test");

  const variant = productWithVariant.variants[0];
  const addon = productWithVariant.addons[0];
  const bumpProduct = guestActiveProducts.find(
    (p) => productWithVariant.bumpProductIds?.includes(p.id),
  );

  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((s) => s.establishmentId === establishment.id)
      .map((s) => [s.id, { name: s.name }]),
  );

  const items = [
    {
      productId: productWithVariant.id,
      qty: 1,
      variantId: variant.id,
      addonIds: [addon.id, ...(bumpProduct ? [`bump_${bumpProduct.id}`] : [])],
      notes: "sem cebola",
    },
  ];

  const resolved = resolveOrderLines(store, establishment.id, sectors, items);
  assert.equal(resolved.ok, true, "staff order with variant/addon/bump must resolve");
  if (!resolved.ok) return;

  assert.equal(resolved.items[0].variantName, variant.name);
  assert.ok(resolved.items[0].addons.some((a) => a.addonId === addon.id));
  if (bumpProduct) {
    assert.ok(resolved.items[0].addons.some((a) => a.addonId === `bump_${bumpProduct.id}`));
  }
  assert.equal(resolved.items[0].notes, "sem cebola");

  const table = Object.values(store.tables).find((t) => t.establishmentId === establishment.id);
  assert.ok(table);
  const waiter = Object.values(store.users).find(
    (u) => u.establishmentId === establishment.id && u.role === "WAITER",
  );
  assert.ok(waiter, "demo waiter user");

  const orderResult = createStaffOrder({
    establishmentId: establishment.id,
    tableId: table!.id,
    items: resolved.items,
    serviceType: "COMER_AQUI",
    actor: waiter!,
  });
  assert.ok(!("error" in orderResult));
  const order = ("value" in orderResult ? orderResult.value.order : null)!;
  assert.equal(order.orderOrigin, "WAITER");
  assert.equal(order.waiterId, waiter!.id);
  assert.ok(order.items[0].unitPrice > 0, "server-side price must be computed");

  console.log("waiter-catalog-parity.test.ts: all assertions passed");
}

run()
  .then(() => {
    rmSync(tempDir, { recursive: true, force: true });
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
  });
