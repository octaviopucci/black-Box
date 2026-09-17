import type { Order } from "./types";

const STORAGE_KEY = "mf_orders";

type CacheEntry = {
  participationId: string;
  orders: Order[];
};

function readAll(): CacheEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CacheEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: CacheEntry[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getCachedGuestOrders(participationId: string): Order[] {
  const entry = readAll().find((item) => item.participationId === participationId);
  return entry?.orders || [];
}

export function addCachedGuestOrder(participationId: string, order: Order) {
  const entries = readAll();
  const idx = entries.findIndex((item) => item.participationId === participationId);
  const existing = idx >= 0 ? entries[idx].orders : [];
  const orders = [order, ...existing.filter((item) => item.id !== order.id)].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );
  if (idx >= 0) entries[idx] = { participationId, orders };
  else entries.push({ participationId, orders });
  writeAll(entries);
}

export function mergeGuestOrders(participationId: string, serverOrders: Order[]): Order[] {
  const cached = getCachedGuestOrders(participationId);
  const byId = new Map<string, Order>();
  for (const order of [...serverOrders, ...cached]) {
    const current = byId.get(order.id);
    if (!current || order.updatedAt > current.updatedAt) byId.set(order.id, order);
  }
  const merged = Array.from(byId.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const entries = readAll();
  const idx = entries.findIndex((entry) => entry.participationId === participationId);
  const next = { participationId, orders: merged };
  if (idx >= 0) entries[idx] = next;
  else entries.push(next);
  writeAll(entries);
  return merged;
}

export function consumptionTotalFor(orders: Order[]) {
  return orders.filter((order) => order.status !== "CANCELADO").reduce((sum, order) => sum + order.total, 0);
}
