import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-resolve-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");

async function run() {
  const { getStore } = await import("./store");
  const { resolveOrderLines } = await import("./order-resolve");

  const store = getStore();
  const establishment = Object.values(store.establishments)[0];
  assert.ok(establishment);
  const product = Object.values(store.products).find(
    (entry) => entry.establishmentId === establishment.id && entry.variants.length === 0,
  );
  assert.ok(product, "product without variants required for test");

  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((sector) => sector.establishmentId === establishment.id)
      .map((sector) => [sector.id, { name: sector.name }]),
  );

  const priced = resolveOrderLines(store, establishment.id, sectors, [
    { productId: product.id, qty: 2 },
  ]);
  assert.equal(priced.ok, true);
  if (!priced.ok) throw new Error("expected priced order");
  assert.equal(priced.items[0].unitPrice, product.price);
  assert.equal(priced.total, product.price * 2);

  const rejected = resolveOrderLines(store, establishment.id, sectors, [
    {
      productId: product.id,
      qty: 1,
      unitPrice: 0,
    } as never,
  ]);
  assert.equal(rejected.ok, false);

  const foreign = resolveOrderLines(store, establishment.id, sectors, [
    { productId: "prod_invalid", qty: 1 },
  ]);
  assert.equal(foreign.ok, false);

  console.log("✓ MesaFlow order-resolve tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
