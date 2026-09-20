import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-entitlements-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-entitlements";

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, createAdminTable, createStaffUser } =
    await import("./store");
  const { provisionEstablishment } = await import("./provision");
  const { hashPassword } = await import("./crypto-utils");
  const { createWaiter } = await import("./waiter-store");
  const {
    canCreateWaiter,
    canCreateTable,
    getLimit,
    getIncludedLimit,
    hasFeature,
    resolveEntitlements,
  } = await import("./platform-entitlements");

  resetPersistedStoreCacheForTests();
  const store = getStore();

  const { establishment, user: owner } = provisionEstablishment(store, {
    businessName: "Teste Entitlements",
    ownerName: "Owner Teste",
    email: "owner.entitlements@test.local",
    passwordHash: hashPassword("SenhaSegura1"),
    businessType: "restaurante",
    tableCount: 3,
    plan: "essencial",
  });
  store.establishments[establishment.id] = establishment;
  store.users[owner.id] = owner;

  // --- Essencial: waiter_access true, 1º garçom OK, 2º falha ---
  assert.equal(hasFeature(establishment, "waiter_access"), true);
  assert.equal(getIncludedLimit(establishment, "waiters"), 1);

  const firstWaiter = createWaiter(establishment, owner.id, {
    name: "Garçom 1",
    email: "garcom1@test.local",
    password: "SenhaSegura1",
  });
  assert.ok(!("error" in firstWaiter), "1st waiter should succeed on essencial");

  assert.equal(canCreateWaiter(establishment, getStore()).ok, false);
  const secondWaiter = createWaiter(establishment, owner.id, {
    name: "Garçom 2",
    email: "garcom2@test.local",
    password: "SenhaSegura1",
  });
  assert.ok("error" in secondWaiter, "2nd waiter must fail without addon");
  assert.equal(secondWaiter.status, 403);

  // --- Essencial: addon libera 2º garçom ---
  establishment.planOverrides = { addonWaiters: 1 };
  store.establishments[establishment.id] = establishment;
  assert.equal(getLimit(establishment, "waiters"), 2);

  const addonWaiter = createWaiter(establishment, owner.id, {
    name: "Garçom Addon",
    email: "garcom.addon@test.local",
    password: "SenhaSegura1",
  });
  assert.ok(!("error" in addonWaiter), "addon should allow 2nd waiter");

  // --- Essencial: até 10 mesas, 11ª falha ---
  establishment.planOverrides = undefined;
  store.establishments[establishment.id] = establishment;

  let tableCount = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id).length;
  for (let i = tableCount; i < 10; i++) {
    const result = createAdminTable(establishment.id, {
      number: String(100 + i),
      capacity: 4,
    });
    assert.ok(!("error" in result), `table ${i + 1} should succeed`);
  }
  assert.equal(canCreateTable(establishment, getStore()).ok, false);
  const eleventh = createAdminTable(establishment.id, { number: "999", capacity: 4 });
  assert.ok("error" in eleventh, "11th table must fail on essencial");
  assert.equal(eleventh.status, 403);

  // --- Premium: 10 garçons OK, 11º falha ---
  for (const user of Object.values(store.users)) {
    if (user.establishmentId === establishment.id && user.role === "WAITER") {
      user.active = false;
      store.users[user.id] = user;
    }
  }
  establishment.plan = "premium";
  establishment.planOverrides = undefined;
  store.establishments[establishment.id] = establishment;
  assert.equal(getIncludedLimit(establishment, "waiters"), 10);

  for (let i = 0; i < 10; i++) {
    const result = createWaiter(establishment, owner.id, {
      name: `Garçom Premium ${i + 1}`,
      email: `garcom.premium.${i + 1}@test.local`,
      password: "SenhaSegura1",
    });
    assert.ok(!("error" in result), `waiter ${i + 1} should succeed on premium`);
  }
  const eleventhWaiter = createWaiter(establishment, owner.id, {
    name: "Garçom Premium 11",
    email: "garcom.premium.11@test.local",
    password: "SenhaSegura1",
  });
  assert.ok("error" in eleventhWaiter, "11th waiter must fail on premium");
  assert.equal(eleventhWaiter.status, 403);

  // --- Premium: 35 mesas inclusas ---
  establishment.plan = "premium";
  store.establishments[establishment.id] = establishment;
  const currentTables = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id).length;
  for (let i = currentTables; i < 35; i++) {
    const result = createAdminTable(establishment.id, {
      number: String(200 + i),
      capacity: 4,
    });
    assert.ok(!("error" in result), `premium table ${i + 1} should succeed`);
  }
  const table36 = createAdminTable(establishment.id, { number: "236", capacity: 4 });
  assert.ok("error" in table36, "36th table must fail on premium without addon");
  assert.equal(table36.status, 403);

  // --- Custom: ilimitado ---
  establishment.plan = "custom";
  store.establishments[establishment.id] = establishment;
  assert.equal(getLimit(establishment, "waiters"), null);
  assert.equal(getLimit(establishment, "tables"), null);
  assert.equal(resolveEntitlements(establishment).addons.waiters, 0);

  // --- Staff users: essencial 3 incl. owner ---
  establishment.plan = "essencial";
  store.establishments[establishment.id] = establishment;

  const staff1 = createStaffUser(establishment, owner.id, {
    name: "Gerente 1",
    email: "gerente1@test.local",
    password: "SenhaSegura1",
    role: "MANAGER",
  });
  assert.ok(!("error" in staff1));
  const staff2 = createStaffUser(establishment, owner.id, {
    name: "Cozinha 1",
    email: "cozinha1@test.local",
    password: "SenhaSegura1",
    role: "KITCHEN",
  });
  assert.ok(!("error" in staff2), "3rd staff user should succeed on essencial");
  const staff3 = createStaffUser(establishment, owner.id, {
    name: "Balcão 1",
    email: "balcao1@test.local",
    password: "SenhaSegura1",
    role: "COUNTER",
  });
  assert.ok("error" in staff3, "4th staff user must fail on essencial (limit 3)");
  assert.equal(staff3.status, 403);

  console.log("platform-entitlements.test.ts: all assertions passed");
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
