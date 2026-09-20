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
  const { canCreateWaiter, canCreateTable, getLimit, hasFeature } = await import("./platform-entitlements");

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

  // --- Essencial: bloqueia garçom ---
  assert.equal(hasFeature(establishment, "waiter_access"), false);
  assert.equal(canCreateWaiter(establishment, getStore()).ok, false);

  const waiterBlocked = createWaiter(establishment, owner.id, {
    name: "Garçom Essencial",
    email: "garcom.essencial@test.local",
    password: "SenhaSegura1",
  });
  assert.ok("error" in waiterBlocked, "essencial must block waiter creation");
  assert.equal(waiterBlocked.status, 403);

  // --- Essencial: até 10 mesas, 11ª falha ---
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

  // --- Premium: 5 garçons OK, 6º falha ---
  establishment.plan = "premium";
  store.establishments[establishment.id] = establishment;

  for (let i = 0; i < 5; i++) {
    const result = createWaiter(establishment, owner.id, {
      name: `Garçom Premium ${i + 1}`,
      email: `garcom.premium.${i + 1}@test.local`,
      password: "SenhaSegura1",
    });
    assert.ok(!("error" in result), `waiter ${i + 1} should succeed on premium`);
  }
  assert.equal(canCreateWaiter(establishment, getStore()).ok, false);
  const sixth = createWaiter(establishment, owner.id, {
    name: "Garçom Premium 6",
    email: "garcom.premium.6@test.local",
    password: "SenhaSegura1",
  });
  assert.ok("error" in sixth, "6th waiter must fail on premium");
  assert.equal(sixth.status, 403);

  // --- Custom: garçons ilimitados ---
  establishment.plan = "custom";
  store.establishments[establishment.id] = establishment;
  assert.equal(getLimit(establishment, "waiters"), null);

  for (let i = 0; i < 3; i++) {
    const result = createWaiter(establishment, owner.id, {
      name: `Garçom Custom ${i + 1}`,
      email: `garcom.custom.${i + 1}@test.local`,
      password: "SenhaSegura1",
    });
    assert.ok(!("error" in result), `custom waiter ${i + 1} should succeed`);
  }

  // --- Override: libera waiter no essencial ---
  for (const user of Object.values(store.users)) {
    if (user.establishmentId === establishment.id && user.role === "WAITER") {
      user.active = false;
      store.users[user.id] = user;
    }
  }
  establishment.plan = "essencial";
  establishment.planOverrides = { features: { waiter_access: true }, limits: { waiters: 1 } };
  store.establishments[establishment.id] = establishment;
  assert.equal(hasFeature(establishment, "waiter_access"), true);

  const overrideWaiter = createWaiter(establishment, owner.id, {
    name: "Garçom Piloto",
    email: "garcom.piloto@test.local",
    password: "SenhaSegura1",
  });
  assert.ok(!("error" in overrideWaiter), "override should allow one waiter on essencial");

  // --- Staff users limit on essencial (3 incl. owner) ---
  establishment.planOverrides = undefined;
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
