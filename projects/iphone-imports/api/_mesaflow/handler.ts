import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createOrder,
  createRodizioRound,
  dashboardStats,
  findEstablishmentBySlug,
  findTableByQr,
  getOrOpenCommand,
  getStore,
  hashPassword,
  requestBill,
  updateOrderStatus,
} from "../../../mesaflow/src/lib/store";
import type { OrderItem, OrderStatus } from "../../../mesaflow/src/lib/types";

function resolvePath(req: VercelRequest): string {
  const q = req.query?.path;
  if (Array.isArray(q) && q.length > 0) return "/" + q.map(String).join("/");
  if (typeof q === "string" && q.length > 0) return "/" + q.replace(/^\/+/, "");

  const originalUrl = req.url || "/";
  const qIndex = originalUrl.indexOf("?");
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
  const stripped = pathname.replace(/^\/api\/mesaflow\/?/, "/") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.send(JSON.stringify(body));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return json(res, 204, {});

  try {
    const path = resolvePath(req);
    const store = getStore();

    if (req.method === "GET" && path === "/health") {
      return json(res, 200, { ok: true, service: "mesaflow" });
    }

    if (req.method === "GET" && path.startsWith("/menu/")) {
      const parts = path.split("/").filter(Boolean);
      const slug = parts[1];
      const table = parts[2];
      if (!slug || !table) return json(res, 400, { error: "Path inválido." });
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      if (!est.open) return json(res, 403, { error: "Estabelecimento fechado no momento." });
      const tbl = findTableByQr(est.id, table);
      if (!tbl) return json(res, 404, { error: "Mesa inválida ou QR expirado." });

      const command = getOrOpenCommand(tbl);
      const categories = Object.values(store.categories)
        .filter((c) => c.establishmentId === est.id && c.active)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id && p.active);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id);
      const orders = Object.values(store.orders)
        .filter((o) => o.commandId === command.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const rodizio = est.rodizioEnabled
        ? Object.values(store.rodizios).find((r) => r.establishmentId === est.id && r.active)
        : null;

      return json(res, 200, {
        establishment: est,
        table: tbl,
        command,
        categories,
        products,
        sectors,
        orders,
        rodizio,
      });
    }

    if (req.method === "GET" && path === "/orders") {
      const establishmentId = String(req.query?.establishmentId || "");
      const commandId = String(req.query?.commandId || "");
      let orders = Object.values(store.orders);
      if (establishmentId) orders = orders.filter((o) => o.establishmentId === establishmentId);
      if (commandId) orders = orders.filter((o) => o.commandId === commandId);
      orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json(res, 200, { orders });
    }

    if (req.method === "POST" && path === "/orders") {
      const body = (req.body || {}) as {
        slug: string;
        tableToken: string;
        items: OrderItem[];
        notes?: string;
      };
      const est = findEstablishmentBySlug(body.slug);
      if (!est?.open) return json(res, 400, { error: "Estabelecimento indisponível." });
      const tbl = findTableByQr(est.id, body.tableToken);
      if (!tbl) return json(res, 404, { error: "Mesa inválida." });
      if (!body.items?.length) return json(res, 400, { error: "Carrinho vazio." });

      const command = getOrOpenCommand(tbl);
      const order = createOrder({
        establishmentId: est.id,
        table: tbl,
        commandId: command.id,
        items: body.items.map((i) => ({ ...i, id: i.id || `oi_${Date.now()}` })),
        notes: body.notes,
        source: "MESA",
      });
      return json(res, 200, { order, total: order.total });
    }

    const orderMatch = path.match(/^\/orders\/([^/]+)$/);
    if (orderMatch) {
      const orderId = orderMatch[1];
      if (req.method === "GET") {
        const order = store.orders[orderId];
        if (!order) return json(res, 404, { error: "Não encontrado" });
        return json(res, 200, { order });
      }
      if (req.method === "PATCH") {
        const body = (req.body || {}) as { status: OrderStatus };
        const order = updateOrderStatus(orderId, body.status);
        if (!order) return json(res, 404, { error: "Pedido não encontrado." });
        return json(res, 200, { order });
      }
    }

    if (req.method === "POST" && path === "/auth/login") {
      const body = (req.body || {}) as { email: string; password: string };
      const user = Object.values(store.users).find(
        (u) => u.email.toLowerCase() === String(body.email).toLowerCase() && u.active,
      );
      if (!user || user.passwordHash !== hashPassword(String(body.password))) {
        return json(res, 401, { error: "E-mail ou senha inválidos." });
      }
      const establishment = store.establishments[user.establishmentId];
      return json(res, 200, {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        establishment,
      });
    }

    if (req.method === "POST" && path === "/bill") {
      const body = (req.body || {}) as { slug: string; tableToken: string };
      const est = findEstablishmentBySlug(body.slug);
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      const table = findTableByQr(est.id, body.tableToken);
      if (!table) return json(res, 404, { error: "Mesa inválida." });
      const cmd = requestBill(table.id);
      return json(res, 200, { ok: true, command: cmd });
    }

    if (req.method === "GET" && path === "/admin/dashboard") {
      const slug = String(req.query?.slug || "");
      if (!slug) return json(res, 400, { error: "slug required" });
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "not found" });
      const stats = dashboardStats(est.id);
      const orders = Object.values(store.orders)
        .filter((o) => o.establishmentId === est.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
      const notifications = Object.values(store.notifications)
        .filter((n) => n.establishmentId === est.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20);
      const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
      return json(res, 200, { establishment: est, stats, orders, tables, commands, notifications });
    }

    if (req.method === "POST" && path === "/rodizio/round") {
      const body = (req.body || {}) as {
        slug: string;
        tableToken: string;
        rodizioId: string;
        items: OrderItem[];
      };
      const est = findEstablishmentBySlug(body.slug);
      if (!est?.rodizioEnabled) return json(res, 400, { error: "Rodízio indisponível." });
      const table = findTableByQr(est.id, body.tableToken);
      if (!table) return json(res, 404, { error: "Mesa inválida." });
      const rodizio = store.rodizios[body.rodizioId];
      if (!rodizio) return json(res, 404, { error: "Rodízio não encontrado." });
      if (body.items.length > rodizio.maxItemsPerRound) {
        return json(res, 400, { error: `Máximo ${rodizio.maxItemsPerRound} itens por rodada.` });
      }
      const command = getOrOpenCommand(table);
      const round = createRodizioRound({
        establishmentId: est.id,
        table,
        commandId: command.id,
        rodizioId: body.rodizioId,
        items: body.items,
      });
      return json(res, 200, { round, message: "Rodada enviada para a cozinha." });
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("[mesaflow] handler error", err);
    return json(res, 500, { error: "Internal error" });
  }
}
