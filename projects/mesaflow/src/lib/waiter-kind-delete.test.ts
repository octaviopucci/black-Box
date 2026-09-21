import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-waiter-kind-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-waiter-kind-delete";

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, createSession } = await import("./store");
  const {
    createWaiter,
    deleteWaiter,
    listWaiters,
    resolveWaiterKind,
    createStaffOrder,
    enrichOrderDisplay,
  } = await import("./waiter-store");
  const { countActiveWaiters } = await import("./platform-entitlements");
  const { loginUser, validateSession } = await import("./store");
  const { resolveOrderLines } = await import("./order-resolve");

  resetPersistedStoreCacheForTests();
  const store = getStore();
  const establishment = Object.values(store.establishments).find((e) => e.slug === "ponto-do-sabor");
  assert.ok(establishment, "demo establishment");
  establishment.plan = "premium";
  store.establishments[establishment.id] = establishment;

  const owner = Object.values(store.users).find(
    (u) => u.establishmentId === establishment.id && u.role === "OWNER",
  );
  assert.ok(owner);

  const demoWaiter = store.users.user_waiter;
  assert.ok(demoWaiter);
  assert.equal(resolveWaiterKind(demoWaiter), "TEMPORARY", "legacy waiter defaults to TEMPORARY");

  const fixedResult = createWaiter(establishment, owner!.id, {
    name: "Maria Fixa",
    email: "maria.fixa@test.local",
    password: "SenhaSegura1",
    waiterKind: "FIXED",
  });
  assert.ok(!("error" in fixedResult));
  const fixed = fixedResult.value!.waiter;
  assert.equal(fixed.waiterKind, "FIXED");

  const fixedLogin = loginUser("maria.fixa@test.local", "SenhaSegura1");
  assert.ok(!("error" in fixedLogin), (fixedLogin as { error?: string }).error);

  const fixedNoPassword = createWaiter(establishment, owner!.id, {
    name: "Sem Senha",
    email: "sem.senha@test.local",
    waiterKind: "FIXED",
  });
  assert.ok("error" in fixedNoPassword);
  assert.match(fixedNoPassword.error, /Senha é obrigatória/);

  const tempResult = createWaiter(establishment, owner!.id, {
    name: "Pedro Temp",
    email: "pedro.temp@test.local",
    waiterKind: "TEMPORARY",
  });
  assert.ok(!("error" in tempResult));
  assert.equal(tempResult.value!.waiter.waiterKind, "TEMPORARY");

  const listed = listWaiters(establishment.id);
  assert.ok(listed.some((w) => w.id === fixed.id && w.waiterKind === "FIXED"));
  assert.ok(listed.some((w) => w.id === tempResult.value!.waiter.id && w.waiterKind === "TEMPORARY"));

  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id);
  const table = tables[0];
  assert.ok(table);
  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((s) => s.establishmentId === establishment.id)
      .map((s) => [s.id, { name: s.name }]),
  );
  const product = Object.values(store.products).find(
    (p) => p.establishmentId === establishment.id && p.active && p.variants.length === 0,
  );
  assert.ok(product);
  const lines = resolveOrderLines(getStore(), establishment.id, sectors, [{ productId: product!.id, qty: 1 }]);
  assert.equal(lines.ok, true);
  if (!lines.ok) return;

  const fixedUser = getStore().users[fixed.id];
  const orderResult = createStaffOrder({
    establishmentId: establishment.id,
    tableId: table.id,
    items: lines.items,
    actor: fixedUser,
  });
  assert.ok(!("error" in orderResult));
  const order = orderResult.value!.order;
  assert.equal(order.waiterId, fixed.id);

  const session = createSession(fixedUser);
  assert.ok(validateSession(session.token));

  const deleteResult = deleteWaiter(establishment.id, fixed.id, owner!.id);
  assert.ok(!("error" in deleteResult));

  assert.ok(!listWaiters(establishment.id).some((w) => w.id === fixed.id));

  const deletedUser = getStore().users[fixed.id];
  assert.ok(deletedUser.deletedAt);
  assert.equal(deletedUser.active, false);

  const loginAfterDelete = loginUser("maria.fixa@test.local", "SenhaSegura1");
  assert.ok("error" in loginAfterDelete);

  assert.equal(validateSession(session.token), null, "session invalidated after delete");

  const preservedOrder = getStore().orders[order.id];
  assert.ok(preservedOrder);
  assert.equal(preservedOrder.waiterId, fixed.id);
  const enriched = enrichOrderDisplay(preservedOrder, getStore());
  assert.match(enriched.originLabel, /Garçom Maria Fixa/);

  const activeBefore = countActiveWaiters(getStore(), establishment.id);
  deleteWaiter(establishment.id, tempResult.value!.waiter.id, owner!.id);
  const activeAfter = countActiveWaiters(getStore(), establishment.id);
  assert.equal(activeAfter, activeBefore - 1);

  const recreate = createWaiter(establishment, owner!.id, {
    name: "Maria Fixa 2",
    email: "maria.fixa@test.local",
    password: "SenhaSegura2",
    waiterKind: "FIXED",
  });
  assert.ok(!("error" in recreate), "email freed after soft delete");

  console.log("waiter-kind-delete.test.ts: all assertions passed");
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
