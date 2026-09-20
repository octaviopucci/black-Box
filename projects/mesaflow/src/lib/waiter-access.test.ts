import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-waiter-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-waiter-access";

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, createOrder, getOrOpenCommand } = await import("./store");
  const { joinGuestAtTable } = await import("./guest");
  const { resolveOrderLines } = await import("./order-resolve");
  const {
    createWaiter,
    createStaffOrder,
    listOperationalTables,
    activateWaiterWithToken,
    generateWaiterActivationToken,
  } = await import("./waiter-store");
  const { hasFeature, canCreateWaiter } = await import("./platform-entitlements");
  const { issueAdminSessionToken } = await import("./admin-session-token");

  resetPersistedStoreCacheForTests();
  const store = getStore();
  const establishment = Object.values(store.establishments).find((e) => e.slug === "ponto-do-sabor");
  assert.ok(establishment, "demo establishment");
  establishment.plan = "premium";
  store.establishments[establishment.id] = establishment;

  assert.equal(hasFeature(establishment, "waiter_access"), true);

  const owner = Object.values(store.users).find(
    (u) => u.establishmentId === establishment.id && u.role === "OWNER",
  );
  assert.ok(owner);

  const waiterResult = createWaiter(establishment, owner!.id, {
    name: "João Garçom",
    email: "joao.garcom@test.local",
    password: "SenhaSegura1",
  });
  assert.ok(!("error" in waiterResult));
  const waiter = ("value" in waiterResult ? waiterResult.value.waiter : null)!;
  assert.ok(waiter);

  const gate = canCreateWaiter(establishment, getStore());
  assert.equal(gate.ok, true);

  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id);
  const table = tables[0];
  assert.ok(table);

  const guestJoin = joinGuestAtTable({
    establishment,
    table,
    phoneE164: "+5511999000001",
    displayName: "Cliente Teste",
  });
  assert.ok(!("error" in guestJoin));

  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((s) => s.establishmentId === establishment.id)
      .map((s) => [s.id, { name: s.name }]),
  );
  const product = Object.values(store.products).find(
    (p) => p.establishmentId === establishment.id && p.active && p.variants.length === 0,
  );
  assert.ok(product, "need product without required variant");

  const guestLines = resolveOrderLines(store, establishment.id, sectors, [{ productId: product!.id, qty: 1 }]);
  assert.equal(guestLines.ok, true);
  if (!guestLines.ok) return;

  const command = getOrOpenCommand(table);
  const guestOrder = createOrder({
    establishmentId: establishment.id,
    table,
    commandId: command.id,
    guestParticipationId: guestJoin.participation.id,
    items: guestLines.items,
    source: "MESA",
    orderOrigin: "GUEST",
  });
  assert.equal(guestOrder.orderOrigin, "GUEST");
  assert.equal(guestOrder.waiterId, undefined);

  const waiterUser = getStore().users[waiter.id];
  const staffLines = resolveOrderLines(getStore(), establishment.id, sectors, [{ productId: product!.id, qty: 2 }]);
  assert.equal(staffLines.ok, true);
  if (!staffLines.ok) return;

  const staffOrderResult = createStaffOrder({
    establishmentId: establishment.id,
    tableId: table.id,
    items: staffLines.items,
    actor: waiterUser,
  });
  assert.ok(!("error" in staffOrderResult));
  const staffOrder = ("value" in staffOrderResult ? staffOrderResult.value.order : null)!;
  assert.equal(staffOrder.orderOrigin, "WAITER");
  assert.equal(staffOrder.waiterId, waiter.id);
  assert.equal(staffOrder.commandId, guestOrder.commandId);

  const ops = listOperationalTables(establishment.id, waiterUser, "all");
  assert.ok(ops.some((t) => t.id === table.id));

  const tokenResult = generateWaiterActivationToken(establishment.id, waiter.id, owner!.id);
  assert.ok(!("error" in tokenResult));
  const rawToken = ("value" in tokenResult ? tokenResult.value.token : "");
  const activateResult = activateWaiterWithToken(rawToken, "NovaSenhaSegura2");
  assert.ok(!("error" in activateResult));

  const crossTables = listOperationalTables("est_inexistente", waiterUser, "all");
  assert.equal(crossTables.length, 0);
  const wrongTenant = listOperationalTables("wrong_tenant_id", waiterUser, "all");
  assert.equal(wrongTenant.length, 0);

  const token = issueAdminSessionToken({ userId: waiter.id, establishmentId: establishment.id });
  assert.ok(token.length > 10);

  console.log("waiter-access.test.ts: all assertions passed");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
