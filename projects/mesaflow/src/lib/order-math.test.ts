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

async function runIntegrationTests() {
  const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-math-"));
  process.env.MESAFLOW_DATA = join(tempDir, "store.json");
  process.env.MESAFLOW_DEV_SKIP_OTP = "1";

  try {
    const { getStore, importMarceloLanchesCatalog, createOrder, saveStore } = await import("./store");
    const { resolveOrderLines } = await import("./order-resolve");
    const { joinGuestAtTable } = await import("./guest");
    const { serviceTypeLabel } = await import("./order-display");

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

    const bumpProduct = store.products.ml_p_coca;
    assert.ok(bumpProduct);
    product.bumpProductIds = [bumpProduct.id];
    store.products[product.id] = product;
    saveStore(store);

    const semFritas = product.variants.find((variant) => variant.priceDelta === 0);
    assert.ok(semFritas);

    const withBump = resolveOrderLines(store, establishment.id, sectors, [
      {
        productId: product.id,
        qty: 1,
        variantId: semFritas.id,
        bumpProductIds: [bumpProduct.id],
      },
    ]);
    assert.equal(withBump.ok, true);
    if (!withBump.ok) throw new Error("expected resolved order with bump");

    const bumpItem = withBump.items[0];
    assert.equal(bumpItem.addons.length, 1, "bump vira acréscimo na linha");
    assert.ok(bumpItem.addons[0].addonId.startsWith("bump_"));
    assert.equal(bumpItem.addons[0].price, bumpProduct.price);
    assert.equal(
      lineTotal(bumpItem),
      bumpItem.unitPrice + bumpProduct.price,
      "bump soma ao preço base, não substitui",
    );

    let table = Object.values(store.tables).find((t) => t.establishmentId === establishment.id);
    if (!table) {
      table = {
        id: "tbl_marcelo_test",
        establishmentId: establishment.id,
        number: "99",
        name: "Mesa teste",
        capacity: 4,
        status: "LIVRE",
        qrToken: "qr_marcelo_test",
      };
      store.tables[table.id] = table;
      saveStore(store);
    }
    const guest = joinGuestAtTable({
      establishment,
      table,
      phoneE164: "+5511999887766",
      displayName: "Cliente teste",
    });
    assert.ok(!("error" in guest));

    const order = createOrder({
      establishmentId: establishment.id,
      table,
      commandId: guest.command.id,
      guestParticipationId: guest.participation.id,
      items: [
        {
          id: "oi_test",
          productId: product.id,
          productName: product.name,
          sectorId: product.sectorId,
          sectorName: "",
          qty: 1,
          unitPrice: product.price,
          variantDelta: 0,
          addons: [],
          status: "NOVO",
        },
      ],
      serviceType: "PARA_VIAGEM",
    });

    assert.equal(order.serviceType, "PARA_VIAGEM");
    assert.equal(serviceTypeLabel(order.serviceType), "Para viagem");
    assert.equal(serviceTypeLabel(undefined), "Comer aqui");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run() {
  runPureMathTests();
  await runIntegrationTests();
  console.log("✓ MesaFlow order-math tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
