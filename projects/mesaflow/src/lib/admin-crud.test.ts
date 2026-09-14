import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-admin-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");

function unwrap<T>(result: { value: T } | { error: string; status: number }): T {
  if ("error" in result) throw new Error(`${result.status}: ${result.error}`);
  return result.value;
}

async function run() {
  const {
    createAdminProduct,
    createAdminTable,
    deleteAdminProduct,
    deleteAdminTable,
    findTableByQr,
    getStore,
    listAdminProducts,
    regenerateAdminTableQr,
    updateAdminProduct,
    updateAdminSettings,
  } = await import("./store");

  const store = getStore();
  const establishment = Object.values(store.establishments)[0];
  assert.ok(establishment, "demo establishment must exist");

  const table = unwrap(
    createAdminTable(establishment.id, { number: "99", capacity: 4 }),
  );
  assert.equal(table.name, "Mesa 99");
  assert.equal(table.status, "LIVRE");
  assert.match(table.qrToken, /^[a-f0-9]{64}$/);
  assert.equal(findTableByQr(establishment.id, "99"), null, "table number is not a QR credential");
  assert.equal(findTableByQr(establishment.id, table.qrToken)?.id, table.id);

  const oldToken = table.qrToken;
  const regenerated = unwrap(regenerateAdminTableQr(establishment.id, table.id));
  assert.notEqual(regenerated.qrToken, oldToken);
  assert.equal(findTableByQr(establishment.id, oldToken), null, "old QR token must be invalidated");

  const blocked = deleteAdminTable(establishment.id, "tbl_4");
  assert.ok("error" in blocked && blocked.status === 409, "open table cannot be deleted");
  assert.deepEqual(unwrap(deleteAdminTable(establishment.id, table.id)), { id: table.id });

  const catalog = listAdminProducts(establishment.id);
  const product = unwrap(
    createAdminProduct(establishment.id, {
      categoryId: catalog.categories[0].id,
      sectorId: catalog.sectors[0].id,
      name: "Produto Teste",
      description: "Criado pelo teste",
      price: 19.9,
      prepMinutes: 8,
      availability: "SOB_DEMANDA",
    }),
  );
  assert.equal(product.availability, "SOB_DEMANDA");
  assert.equal(unwrap(updateAdminProduct(establishment.id, product.id, { featured: true })).featured, true);
  assert.equal(unwrap(deleteAdminProduct(establishment.id, product.id)).active, false);

  const foreignCategory = { ...catalog.categories[0], id: "cat_foreign", establishmentId: "est_foreign" };
  store.categories[foreignCategory.id] = foreignCategory;
  const crossTenant = createAdminProduct(establishment.id, {
    categoryId: foreignCategory.id,
    sectorId: catalog.sectors[0].id,
    name: "Inválido",
    description: "",
    price: 1,
    prepMinutes: 1,
    availability: "VITRINE",
  });
  assert.ok("error" in crossTenant, "foreign category must be rejected");

  const updated = unwrap(
    updateAdminSettings(establishment.id, {
      name: "Ponto do Sabor Atualizado",
      open: false,
      settings: { soundNotifications: false },
    }),
  );
  assert.equal(updated.name, "Ponto do Sabor Atualizado");
  assert.equal(updated.open, false);
  assert.equal(updated.settings.soundNotifications, false);

  console.log("✓ MesaFlow admin CRUD, tenant isolation and QR lifecycle passed");
}

run().finally(() => {
  rmSync(tempDir, { recursive: true, force: true });
});
