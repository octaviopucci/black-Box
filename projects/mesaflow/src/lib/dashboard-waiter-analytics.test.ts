import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-dash-waiter-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "";

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, updateOrderStatus } = await import("./store");
  const { createWaiter, createStaffOrder } = await import("./waiter-store");
  const { resolveOrderLines } = await import("./order-resolve");
  const {
    dashboardAnalytics,
    resetDashboardAnalyticsCacheForTests,
  } = await import("./dashboard-analytics");
  const { buildAdminDashboardPayload } = await import("./admin-dashboard");

  resetPersistedStoreCacheForTests();
  resetDashboardAnalyticsCacheForTests();

  const store = getStore();
  const establishment = Object.values(store.establishments).find((e) => e.slug === "ponto-do-sabor");
  assert.ok(establishment, "demo establishment");
  establishment.plan = "premium";
  store.establishments[establishment.id] = establishment;

  const owner = Object.values(store.users).find(
    (u) => u.establishmentId === establishment.id && u.role === "OWNER",
  );
  assert.ok(owner);

  const waiterResult = createWaiter(establishment, owner!.id, {
    name: "Dash Garçom",
    email: "dash.waiter@test.local",
    password: "SenhaSegura1",
  });
  assert.ok(!("error" in waiterResult));
  const waiterUser = getStore().users[waiterResult.value!.waiter.id];

  const table = Object.values(store.tables).find(
    (t) => t.establishmentId === establishment.id && t.status !== "INATIVA",
  );
  assert.ok(table);

  const product = Object.values(store.products).find(
    (p) => p.establishmentId === establishment.id && p.active && p.variants.length === 0,
  );
  assert.ok(product);

  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((s) => s.establishmentId === establishment.id)
      .map((s) => [s.id, { name: s.name }]),
  );
  const lines = resolveOrderLines(getStore(), establishment.id, sectors, [
    { productId: product!.id, qty: 1 },
  ]);
  assert.equal(lines.ok, true);
  if (!lines.ok) return;

  const baseline = dashboardAnalytics(establishment.id, "today");
  const baselineOrders = baseline.sales.ordersCount;
  const baselineRevenue = baseline.sales.revenue;
  const baselineDelivered = baseline.sales.deliveredCount;

  const staffOrderResult = createStaffOrder({
    establishmentId: establishment.id,
    tableId: table!.id,
    items: lines.items,
    actor: waiterUser,
  });
  assert.ok(!("error" in staffOrderResult));
  const staffOrder = staffOrderResult.value!.order;
  assert.equal(staffOrder.orderOrigin, "WAITER");

  resetDashboardAnalyticsCacheForTests();
  const afterCreate = dashboardAnalytics(establishment.id, "today");
  assert.equal(
    afterCreate.sales.ordersCount,
    baselineOrders + 1,
    "WAITER order must increase ordersCount on dashboard",
  );
  assert.equal(
    afterCreate.sales.revenue,
    baselineRevenue,
    "revenue counts only ENTREGUE — unchanged until delivered",
  );
  assert.ok(afterCreate.inPrep + afterCreate.pendingOrders >= 1, "WAITER order in status KPIs");

  updateOrderStatus(staffOrder.id, "ENTREGUE", establishment.id);
  resetDashboardAnalyticsCacheForTests();
  const afterDelivered = dashboardAnalytics(establishment.id, "today");
  assert.equal(
    afterDelivered.sales.revenue,
    baselineRevenue + staffOrder.total,
    "WAITER ENTREGUE order must increase dashboard revenue",
  );
  assert.equal(
    afterDelivered.sales.deliveredCount,
    baselineDelivered + 1,
    "deliveredCount includes WAITER orders",
  );

  const overview = buildAdminDashboardPayload(establishment, "today", "overview");
  assert.equal(
    overview.analytics.sales.ordersCount,
    afterDelivered.sales.ordersCount,
    "overview payload matches analytics for WAITER-inclusive totals",
  );

  console.log("✓ dashboard-waiter-analytics tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
