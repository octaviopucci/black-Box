import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { addonsTotal, lineTotal, lineUnitPrice, variantDeltaValue } from "./order-math";

function runPureMathTests() {
  assert.equal(variantDeltaValue(undefined), 0);
  assert.equal(variantDeltaValue({ id: "v", name: "Sem fritas", priceDelta: 0 }), 0);
  assert.equal(variantDeltaValue({ id: "v", name: "Broto", priceDelta: -12 }), -12);

  const bacon = [{ addonId: "ml_a_bacon", name: "Bacon", price: 5, qty: 1 }];
  assert.equal(addonsTotal(bacon), 5);
  assert.equal(lineUnitPrice(13, 3, bacon), 21, "base + fritas + bacon por unidade");
  assert.equal(
    lineTotal({ qty: 1, unitPrice: 13, variantDelta: 3, addons: bacon }),
    21,
    "13 + 3 + 5 = 21",
  );
  assert.equal(
    lineTotal({ qty: 2, unitPrice: 13, variantDelta: 3, addons: bacon }),
    37,
    "2*(13+3) + 5 — adicionais somam por linha, não por unidade",
  );
  assert.notEqual(lineTotal({ qty: 1, unitPrice: 13, variantDelta: 3, addons: bacon }), 5);
  assert.notEqual(lineTotal({ qty: 1, unitPrice: 13, variantDelta: 3, addons: bacon }), 3);
}

async function runResolveIntegrationTest() {
  const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-math-"));
  process.env.MESAFLOW_DATA = join(tempDir, "store.json");

  try {
    const { getStore, importMarceloLanchesCatalog } = await import("./store");
    const { resolveOrderLines } = await import("./order-resolve");

    const store = getStore();
    importMarceloLanchesCatalog({ createIfMissing: true });

    const establishment = Object.values(store.establishments).find((entry) =>
      entry.slug.includes("marcelo"),
    );
    assert.ok(establishment);

    const product = store.products.ml_p_burguer;
    assert.ok(product);
    const comFritas = product.variants.find((variant) => variant.name.includes("Com fritas"));
    assert.ok(comFritas);

    const sectors = Object.fromEntries(
      Object.values(store.sectors)
        .filter((sector) => sector.establishmentId === establishment.id)
        .map((sector) => [sector.id, { name: sector.name }]),
    );

    const resolved = resolveOrderLines(store, establishment.id, sectors, [
      {
        productId: product.id,
        qty: 1,
        variantId: comFritas.id,
        addonIds: ["ml_a_bacon"],
      },
    ]);
    assert.equal(resolved.ok, true);
    if (!resolved.ok) throw new Error("expected resolved order");

    const item = resolved.items[0];
    assert.equal(item.unitPrice, 13, "preço base preservado no pedido");
    assert.equal(item.variantDelta, 3, "delta de fritas é aditivo");
    assert.equal(lineTotal(item), 21, "servidor calcula 13 + 3 + 5");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run() {
  runPureMathTests();
  await runResolveIntegrationTest();
  console.log("✓ MesaFlow order-math tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
