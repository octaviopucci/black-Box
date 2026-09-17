import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createAdminProduct,
  createAdminTable,
  createOrder,
  createRodizioRound,
  dashboardStats,
  deleteAdminProduct,
  deleteAdminTable,
  findEstablishmentBySlug,
  findTableByQr,
  blobDiagnostics,
  flushPersistentStore,
  probeBlobStorage,
  getActiveCommand,
  getAdminSettings,
  getOrOpenCommand,
  getStore,
  hydratePersistentStore,
  listAdminProducts,
  listAdminTables,
  loginUser,
  publicUser,
  regenerateAdminTableQr,
  registerEstablishment,
  setPersistentStoreOidcToken,
  updateAdminProduct,
  updateAdminSettings,
  updateAdminTable,
  validateSession,
  requestBill,
  updateOrderStatus,
} from "../../../mesaflow/src/lib/store";
import {
  clearClientCookie,
  parseClientCookie,
  setClientCookie,
} from "../../../mesaflow/src/lib/guest-cookie";
import {
  guestTableSummary,
  joinGuestAtTable,
  otpRequiredForEstablishment,
  publicParticipation,
  requestOtpChallenge,
  validateClientSession,
  verifyOtpChallenge,
  revokeClientSession,
} from "../../../mesaflow/src/lib/guest";
import { normalizePhoneE164 } from "../../../mesaflow/src/lib/identity-crypto";
import { publicOtpBypassHint } from "../../../mesaflow/src/lib/otp-bypass";
import { resolveOrderLines } from "../../../mesaflow/src/lib/order-resolve";
import type { OrderLineInput, OrderStatus } from "../../../mesaflow/src/lib/types";

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

async function json(
  res: VercelResponse,
  status: number,
  body: unknown,
  options?: { skipFlush?: boolean },
) {
  if (!options?.skipFlush) {
    const persist = await flushPersistentStore();
    if (!persist.blob && persist.blobError) {
      console.warn("[mesaflow] blob persist skipped/failed", persist.blobError);
    }
  }
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.send(JSON.stringify(body));
}

function blobSetupHint(storage: ReturnType<typeof blobDiagnostics>): string {
  if (storage.hasToken) return "";
  if (storage.hasStoreId && !storage.hasOidc && !storage.hasOidcHeader) {
    return "BLOB_STORE_ID existe mas OIDC não chegou na function. Faça Redeploy ou adicione BLOB_READ_WRITE_TOKEN manualmente.";
  }
  if ((storage.hasOidc || storage.hasOidcHeader) && !storage.hasStoreId) {
    return "OIDC ok mas BLOB_STORE_ID ausente — o Blob provavelmente está conectado a OUTRO projeto Vercel. Em Storage → Blob → Projects → conecte o projeto certo (Production + Preview).";
  }
  if (storage.blobEnvKeys.length === 0) {
    return "Nenhuma variável BLOB/OIDC nesta function. Storage → Blob → Connect to Project. Ou adicione BLOB_READ_WRITE_TOKEN em Environment Variables e redeploy.";
  }
  if (storage.lastError) {
    return `Persistência falhou: ${storage.lastError}. Adicione BLOB_READ_WRITE_TOKEN (token Read-Write do Blob) e redeploy.`;
  }
  return "Storage → Blob → Connect to Project → marque Production + Preview → Redeploy.";
}

function readOidcHeader(req: VercelRequest) {
  const value = req.headers["x-vercel-oidc-token"];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return undefined;
}

function readBearer(req: VercelRequest) {
  const authorization = req.headers.authorization;
  const match = typeof authorization === "string" && authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : undefined;
}

function adminAuth(req: VercelRequest) {
  const auth = validateSession(readBearer(req));
  return auth && (auth.user.role === "OWNER" || auth.user.role === "MANAGER") ? auth : null;
}

function kitchenAuth(req: VercelRequest) {
  const auth = validateSession(readBearer(req));
  if (!auth) return null;
  if (
    auth.user.role === "OWNER" ||
    auth.user.role === "MANAGER" ||
    auth.user.role === "KITCHEN" ||
    auth.user.role === "COUNTER"
  ) {
    return auth;
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setPersistentStoreOidcToken(readOidcHeader(req));
  if (req.method === "OPTIONS") return json(res, 204, {});

  try {
    await hydratePersistentStore();
    const path = resolvePath(req);
    const store = getStore();

    if (req.method === "GET" && path === "/health") {
      const hasOidcHeader = Boolean(readOidcHeader(req));
      const storage = blobDiagnostics(hasOidcHeader);
      const probe = await probeBlobStorage();
      const persist = await flushPersistentStore();
      const blobOk = probe.ok || (storage.hasToken && storage.configured);
      const establishments = Object.keys(store.establishments).length;
      return json(
        res,
        200,
        {
          ok: true,
          service: "mesaflow",
          blob: blobOk,
          establishments,
          storage: { ...storage, probe, persist },
          setup:
            blobOk && !persist.blobError
              ? undefined
              : blobSetupHint({ ...storage, lastError: persist.blobError ?? storage.lastError }),
        },
        { skipFlush: true },
      );
    }

    if (req.method === "GET" && path === "/guest/table-context") {
      const slug = String(req.query?.slug || "");
      const tableToken = String(req.query?.tableToken || "");
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      const tbl = findTableByQr(est.id, tableToken);
      if (!tbl) return json(res, 404, { error: "Mesa inválida ou QR expirado." });
      const command = getActiveCommand(tbl);
      const summary = guestTableSummary(est.id, command?.id);
      const guestAuth = validateClientSession(parseClientCookie(req));
      return json(res, 200, {
        establishment: { id: est.id, slug: est.slug, name: est.name, open: est.open, rodizioEnabled: est.rodizioEnabled },
        table: { id: tbl.id, number: tbl.number, name: tbl.name, status: tbl.status },
        command,
        otpRequired: otpRequiredForEstablishment(est),
        otpBypass: publicOtpBypassHint(),
        hasSession: Boolean(guestAuth),
        ...summary,
      });
    }

    if (req.method === "GET" && path === "/guest/me") {
      const guestAuth = validateClientSession(parseClientCookie(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const orders = Object.values(store.orders)
        .filter((o) => o.guestParticipationId === guestAuth.participation.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const consumptionTotal = orders
        .filter((o) => o.status !== "CANCELADO")
        .reduce((sum, order) => sum + order.total, 0);
      return json(res, 200, {
        participation: publicParticipation(guestAuth.participation),
        orders,
        consumptionTotal,
      });
    }

    if (req.method === "POST" && path === "/guest/join/mock") {
      const body = (req.body || {}) as { slug: string; tableToken: string; phone?: string; displayName?: string };
      const est = findEstablishmentBySlug(String(body.slug || ""));
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      if (otpRequiredForEstablishment(est)) {
        return json(res, 403, { error: "OTP obrigatório para este estabelecimento." });
      }
      const tbl = findTableByQr(est.id, String(body.tableToken || ""));
      if (!tbl) return json(res, 404, { error: "Mesa inválida." });
      const phoneE164 = normalizePhoneE164(body.phone || "+5511999999999");
      if (!phoneE164) return json(res, 400, { error: "Telefone inválido." });
      const result = joinGuestAtTable({
        establishment: est,
        table: tbl,
        phoneE164,
        displayName: body.displayName,
      });
      setClientCookie(res, result.token);
      return json(res, 200, {
        participation: publicParticipation(result.participation),
        message: result.message,
      });
    }

    if (req.method === "POST" && path === "/guest/otp/request") {
      const body = (req.body || {}) as { slug: string; tableToken: string; phone: string };
      const est = findEstablishmentBySlug(String(body.slug || ""));
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      const tbl = findTableByQr(est.id, String(body.tableToken || ""));
      if (!tbl) return json(res, 404, { error: "Mesa inválida." });
      const result = requestOtpChallenge({
        establishment: est,
        table: tbl,
        phoneRaw: String(body.phone || ""),
        purpose: "JOIN",
      });
      if ("error" in result) return json(res, 400, { error: result.error });
      return json(res, 200, {
        challengeId: result.challengeId,
        mockCode: result.mockCode,
        message: "Código enviado (mock em desenvolvimento).",
      });
    }

    if (req.method === "POST" && path === "/guest/otp/verify") {
      const body = (req.body || {}) as {
        challengeId: string;
        code: string;
        displayName?: string;
        slug?: string;
        tableToken?: string;
        phone?: string;
      };
      const result = verifyOtpChallenge({
        challengeId: String(body.challengeId || ""),
        code: String(body.code || ""),
        displayName: body.displayName,
        slug: body.slug,
        tableToken: body.tableToken,
        phoneRaw: body.phone,
      });
      if ("error" in result) return json(res, 400, { error: result.error });
      setClientCookie(res, result.token);
      return json(res, 200, { participation: publicParticipation(result.participation) });
    }

    if (req.method === "POST" && path === "/guest/logout") {
      revokeClientSession(parseClientCookie(req));
      clearClientCookie(res);
      return json(res, 200, { ok: true });
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

      const command = getActiveCommand(tbl);
      const categories = Object.values(store.categories)
        .filter((c) => c.establishmentId === est.id && c.active)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id && p.active);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id);
      const summary = guestTableSummary(est.id, command?.id);
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
        rodizio,
        ...summary,
      });
    }

    if (req.method === "GET" && path === "/orders") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const commandId = String(req.query?.commandId || "");
      let orders = Object.values(store.orders).filter((o) => o.establishmentId === auth.establishment.id);
      if (commandId) orders = orders.filter((o) => o.commandId === commandId);
      orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json(res, 200, { orders });
    }

    if (req.method === "POST" && path === "/orders") {
      const guestAuth = validateClientSession(parseClientCookie(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente obrigatória." });
      if (guestAuth.participation.status !== "OPEN") {
        return json(res, 403, { error: "Sua participação não permite novos pedidos." });
      }

      const body = (req.body || {}) as {
        items: OrderLineInput[];
        notes?: string;
      };
      if (!body.items?.length) return json(res, 400, { error: "Carrinho vazio." });

      const est = guestAuth.establishment;
      if (!est.open) return json(res, 400, { error: "Estabelecimento indisponível." });
      const tbl = store.tables[guestAuth.participation.tableId];
      if (!tbl) return json(res, 404, { error: "Mesa inválida." });

      const sectors = Object.fromEntries(
        Object.values(store.sectors)
          .filter((sector) => sector.establishmentId === est.id)
          .map((sector) => [sector.id, { name: sector.name }]),
      );
      const resolved = resolveOrderLines(store, est.id, sectors, body.items);
      if (!resolved.ok) return json(res, resolved.status, { error: resolved.error });

      const command = getOrOpenCommand(tbl);
      if (command.id !== guestAuth.participation.commandId) {
        return json(res, 409, { error: "Comanda da participação desatualizada. Recarregue a página." });
      }

      try {
        const order = createOrder({
          establishmentId: est.id,
          table: tbl,
          commandId: command.id,
          guestParticipationId: guestAuth.participation.id,
          items: resolved.items,
          notes: body.notes,
          source: "MESA",
        });
        return json(res, 200, { order, total: order.total });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível criar o pedido.";
        return json(res, 403, { error: message });
      }
    }

    const orderMatch = path.match(/^\/orders\/([^/]+)$/);
    if (orderMatch) {
      const orderId = orderMatch[1];
      if (req.method === "GET") {
        const auth = adminAuth(req);
        if (!auth) return json(res, 401, { error: "Não autorizado." });
        const order = store.orders[orderId];
        if (!order || order.establishmentId !== auth.establishment.id) {
          return json(res, 404, { error: "Não encontrado" });
        }
        return json(res, 200, { order });
      }
      if (req.method === "PATCH") {
        const auth = kitchenAuth(req);
        if (!auth) return json(res, 401, { error: "Não autorizado." });
        const body = (req.body || {}) as { status: OrderStatus };
        const order = updateOrderStatus(orderId, body.status, auth.establishment.id);
        if (!order) return json(res, 404, { error: "Pedido não encontrado." });
        return json(res, 200, { order });
      }
    }

    if (req.method === "POST" && path === "/auth/login") {
      const body = (req.body || {}) as { email: string; password: string };
      const result = loginUser(String(body.email), String(body.password));
      if (result.error) return json(res, 401, { error: result.error });
      return json(res, 200, {
        token: result.session!.token,
        user: publicUser(result.user!),
        establishment: result.establishment,
      });
    }

    if (req.method === "POST" && path === "/auth/register") {
      const body = (req.body || {}) as {
        businessName: string;
        ownerName: string;
        email: string;
        password: string;
        businessType: string;
        tableCount?: number;
      };
      const result = registerEstablishment({
        businessName: String(body.businessName || ""),
        ownerName: String(body.ownerName || ""),
        email: String(body.email || ""),
        password: String(body.password || ""),
        businessType: (body.businessType || "restaurante") as
          | "restaurante"
          | "lanchonete"
          | "padaria"
          | "bar"
          | "cafeteria"
          | "rodizio",
        tableCount: Number(body.tableCount) || 5,
      });
      if (result.error) return json(res, 400, { error: result.error });
      return json(res, 201, {
        token: result.session!.token,
        user: publicUser(result.user!),
        establishment: result.establishment,
      });
    }

    if (req.method === "GET" && path === "/auth/me") {
      const auth = validateSession(req.headers.authorization?.replace(/^Bearer\s+/i, ""));
      if (!auth) return json(res, 401, { error: "Sessão inválida." });
      return json(res, 200, {
        user: publicUser(auth.user),
        establishment: auth.establishment,
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
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const est = auth.establishment;
      const stats = dashboardStats(est.id);
      const orders = Object.values(store.orders)
        .filter((o) => o.establishmentId === est.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id && s.active);
      const notifications = Object.values(store.notifications)
        .filter((n) => n.establishmentId === est.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20);
      const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
      const categories = Object.values(store.categories).filter((c) => c.establishmentId === est.id);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id);
      return json(res, 200, {
        establishment: est,
        stats,
        orders,
        tables,
        sectors,
        commands,
        notifications,
        categories,
        products,
      });
    }

    if (path === "/admin/settings") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        const establishment = getAdminSettings(auth.establishment.id);
        if (!establishment) {
          return json(res, 404, { error: "Estabelecimento não encontrado." });
        }
        return json(res, 200, { establishment });
      }
      if (req.method === "PATCH") {
        const result = updateAdminSettings(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { establishment: result.value });
      }
    }

    if (path === "/admin/products") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        return json(res, 200, listAdminProducts(auth.establishment.id));
      }
      if (req.method === "POST") {
        const result = createAdminProduct(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { product: result.value });
      }
    }

    const adminProductMatch = path.match(/^\/admin\/products\/([^/]+)$/);
    if (adminProductMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminProduct(auth.establishment.id, adminProductMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { product: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminProduct(auth.establishment.id, adminProductMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { product: result.value });
      }
    }

    if (path === "/admin/tables") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        return json(res, 200, { tables: listAdminTables(auth.establishment.id) });
      }
      if (req.method === "POST") {
        const result = createAdminTable(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { table: result.value });
      }
    }

    const regenerateQrMatch = path.match(/^\/admin\/tables\/([^/]+)\/regenerate-qr$/);
    if (regenerateQrMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "POST") {
        const result = regenerateAdminTableQr(auth.establishment.id, regenerateQrMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
    }

    const adminTableMatch = path.match(/^\/admin\/tables\/([^/]+)$/);
    if (adminTableMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminTable(auth.establishment.id, adminTableMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminTable(auth.establishment.id, adminTableMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { deleted: result.value.id });
      }
    }

    if (req.method === "POST" && path === "/rodizio/round") {
      const guestAuth = validateClientSession(parseClientCookie(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente obrigatória." });
      if (guestAuth.participation.status !== "OPEN") {
        return json(res, 403, { error: "Sua participação não permite novos pedidos." });
      }

      const body = (req.body || {}) as {
        rodizioId: string;
        items: OrderLineInput[];
      };
      const est = guestAuth.establishment;
      if (!est.rodizioEnabled) return json(res, 400, { error: "Rodízio indisponível." });
      const table = store.tables[guestAuth.participation.tableId];
      if (!table) return json(res, 404, { error: "Mesa inválida." });
      const rodizio = store.rodizios[body.rodizioId];
      if (!rodizio || rodizio.establishmentId !== est.id) {
        return json(res, 404, { error: "Rodízio não encontrado." });
      }
      const sectors = Object.fromEntries(
        Object.values(store.sectors)
          .filter((sector) => sector.establishmentId === est.id)
          .map((sector) => [sector.id, { name: sector.name }]),
      );
      const resolved = resolveOrderLines(store, est.id, sectors, body.items, {
        unitPriceFor: (product) => {
          if (rodizio.premiumProductIds.includes(product.id)) {
            return product.rodizioPremiumPrice ?? product.price;
          }
          if (rodizio.productIds.includes(product.id)) return 0;
          return product.price;
        },
      });
      if (!resolved.ok) return json(res, resolved.status, { error: resolved.error });
      if (resolved.items.length > rodizio.maxItemsPerRound) {
        return json(res, 400, { error: `Máximo ${rodizio.maxItemsPerRound} itens por rodada.` });
      }
      const command = getOrOpenCommand(table);
      const round = createRodizioRound({
        establishmentId: est.id,
        table,
        commandId: command.id,
        guestParticipationId: guestAuth.participation.id,
        rodizioId: body.rodizioId,
        items: resolved.items,
      });
      return json(res, 200, { round, message: "Rodada enviada para a cozinha." });
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("[mesaflow] handler error", err);
    return json(res, 500, { error: "Internal error" });
  }
}
