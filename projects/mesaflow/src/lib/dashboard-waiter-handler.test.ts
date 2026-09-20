import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-dash-handler-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "";

function mockHandlerResponse() {
  let statusCode = 0;
  let responseBody = "";
  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    setHeader() {
      return res;
    },
    send(data: string) {
      responseBody = data;
      return res;
    },
  } as unknown as VercelResponse;

  return {
    res,
    getStatus: () => statusCode,
    getBody: () => JSON.parse(responseBody || "{}"),
  };
}

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, updateOrderStatus } = await import("./store");
  const { issueAdminSessionToken } = await import("./admin-session-token");
  const { resetDashboardAnalyticsCacheForTests } = await import("./dashboard-analytics");
  const { resetAdminDashboardCacheForTests } = await import("./admin-dashboard");
  const handler = (await import("../../../iphone-imports/api/_mesaflow/handler")).default;

  resetPersistedStoreCacheForTests();
  resetDashboardAnalyticsCacheForTests();
  resetAdminDashboardCacheForTests();

  const store = getStore();
  const establishment = Object.values(store.establishments).find((e) => e.slug === "ponto-do-sabor");
  assert.ok(establishment);
  establishment.plan = "premium";
  store.establishments[establishment.id] = establishment;

  const waiter = store.users.user_waiter;
  assert.ok(waiter?.role === "WAITER");
  const token = issueAdminSessionToken(waiter.id, establishment.id);

  const table = Object.values(store.tables).find(
    (t) => t.establishmentId === establishment.id && t.status !== "INATIVA",
  );
  assert.ok(table);
  const product = Object.values(store.products).find(
    (p) => p.establishmentId === establishment.id && p.active && p.variants.length === 0,
  );
  assert.ok(product);

  const dashBefore = mockHandlerResponse();
  await handler(
    {
      method: "GET",
      url: "/admin/dashboard?scope=overview&period=today",
      headers: { authorization: `Bearer ${token}` },
      query: { scope: "overview", period: "today" },
    } as unknown as VercelRequest,
    dashBefore.res,
  );
  assert.equal(dashBefore.getStatus(), 200);
  const ordersBefore = dashBefore.getBody().analytics.sales.ordersCount;
  const revenueBefore = dashBefore.getBody().analytics.sales.revenue;

  const createRes = mockHandlerResponse();
  await handler(
    {
      method: "POST",
      url: "/admin/orders",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: {
        tableId: table!.id,
        items: [{ productId: product!.id, qty: 1 }],
      },
    } as unknown as VercelRequest,
    createRes.res,
  );
  assert.equal(createRes.getStatus(), 201, `POST /admin/orders failed: ${JSON.stringify(createRes.getBody())}`);
  const createdOrder = createRes.getBody().order;
  assert.equal(createdOrder.orderOrigin, "WAITER");

  await new Promise((resolve) => setTimeout(resolve, 0));
  resetDashboardAnalyticsCacheForTests();
  resetAdminDashboardCacheForTests();
  const dashAfterCreate = mockHandlerResponse();
  await handler(
    {
      method: "GET",
      url: "/admin/dashboard?scope=overview&period=today",
      headers: { authorization: `Bearer ${token}` },
      query: { scope: "overview", period: "today" },
    } as unknown as VercelRequest,
    dashAfterCreate.res,
  );
  assert.equal(dashAfterCreate.getStatus(), 200);
  assert.equal(
    dashAfterCreate.getBody().analytics.sales.ordersCount,
    ordersBefore + 1,
    "handler dashboard must count WAITER order in ordersCount",
  );
  assert.equal(dashAfterCreate.getBody().analytics.sales.revenue, revenueBefore);

  updateOrderStatus(createdOrder.id, "ENTREGUE", establishment.id);
  await new Promise((resolve) => setTimeout(resolve, 0));
  resetDashboardAnalyticsCacheForTests();
  resetAdminDashboardCacheForTests();
  const dashAfterDelivered = mockHandlerResponse();
  await handler(
    {
      method: "GET",
      url: "/admin/dashboard?scope=overview&period=today",
      headers: { authorization: `Bearer ${token}` },
      query: { scope: "overview", period: "today" },
    } as unknown as VercelRequest,
    dashAfterDelivered.res,
  );
  assert.equal(dashAfterDelivered.getStatus(), 200);
  assert.equal(
    dashAfterDelivered.getBody().analytics.sales.revenue,
    revenueBefore + createdOrder.total,
    "handler dashboard revenue must include ENTREGUE WAITER order",
  );

  const { readFileSync } = await import("node:fs");
  const bundlePath = join(import.meta.dirname, "../../../iphone-imports/api/mesaflow.js");
  const bundle = readFileSync(bundlePath, "utf8");
  assert.ok(bundle.includes("createStaffOrder"), "prod bundle must include createStaffOrder");
  assert.ok(bundle.includes('orderOrigin: "WAITER"'), "prod bundle must tag WAITER orders");

  console.log("✓ dashboard-waiter-handler tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
