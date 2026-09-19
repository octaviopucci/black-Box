import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

async function run() {
  process.env.VERCEL = "";
  const { buildAdminDashboardPayload, getAdminDashboardPayload, parseAdminDashboardPeriod, parseAdminDashboardScope, resetAdminDashboardCacheForTests } =
    await import("./admin-dashboard");
  const { resetDashboardAnalyticsCacheForTests } = await import("./dashboard-analytics");
  const { getStore, loginUser } = await import("./store");
  const { DEMO_LOGIN } = await import("./demo");

  resetAdminDashboardCacheForTests();
  resetDashboardAnalyticsCacheForTests();

  assert.equal(parseAdminDashboardPeriod("7d"), "7d");
  assert.equal(parseAdminDashboardPeriod(null), "today");
  assert.equal(parseAdminDashboardScope(null, true), "overview");
  assert.equal(parseAdminDashboardScope("nav", false), "nav");

  const login = loginUser(DEMO_LOGIN.email, DEMO_LOGIN.password);
  assert.ok(login.session, login.error);
  assert.ok(login.establishment, "establishment from demo login");
  const establishment = login.establishment!;

  const started = performance.now();
  const overview = buildAdminDashboardPayload(establishment, "today", "overview");
  const elapsedMs = performance.now() - started;
  assert.ok(elapsedMs < 1300, `overview dashboard should build in <1.3s (got ${elapsedMs.toFixed(0)}ms)`);

  assert.ok(overview.analytics, "analytics required for Visão geral UI");
  assert.ok(overview.analyticsWeek, "analyticsWeek required");
  assert.ok(overview.analyticsMonth, "analyticsMonth required");
  assert.ok(Array.isArray(overview.notifications), "notifications array");
  assert.equal(typeof overview.stats.revenue, "number");
  assert.equal("orders" in overview, false, "overview scope omits heavy order list");

  const cached = getAdminDashboardPayload(establishment, "today", "overview");
  assert.deepEqual(cached, overview, "cache hit returns same overview payload");

  const nav = buildAdminDashboardPayload(establishment, "today", "nav");
  assert.ok(Array.isArray(nav.sectors), "nav scope includes sectors");
  assert.equal("analytics" in nav, false, "nav scope omits analytics");

  const full = buildAdminDashboardPayload(establishment, "today", "full");
  assert.ok(Array.isArray(full.orders), "full scope includes orders");
  assert.ok(getStore().establishments[establishment.id], "store has establishment");

  console.log(`✓ admin-dashboard tests passed (${elapsedMs.toFixed(0)}ms overview build)`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
