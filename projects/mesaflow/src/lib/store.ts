import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { hashPassword, id } from "./crypto-utils";
import { emit } from "./events";
import { lineTotal } from "./order-math";
import { buildDemoStore } from "./seed";
import type {
  Command,
  MesaFlowStore,
  Notification,
  Order,
  OrderItem,
  OrderStatus,
  RodizioRound,
  StoreEvent,
  Table,
} from "./types";

const DATA_PATH =
  process.env.MESAFLOW_DATA ||
  (process.env.VERCEL ? "/tmp/mesaflow-store.json" : join(process.cwd(), "data", "store.json"));

let cache: MesaFlowStore | null = null;

function emptyStore(): MesaFlowStore {
  return {
    establishments: {},
    users: {},
    sectors: {},
    categories: {},
    products: {},
    tables: {},
    commands: {},
    orders: {},
    rodizios: {},
    rodizioRounds: {},
    notifications: {},
    orderCounter: {},
  };
}

export { hashPassword } from "./crypto-utils";

function load(): MesaFlowStore {
  if (cache) return cache;
  mkdirSync(dirname(DATA_PATH), { recursive: true });
  if (existsSync(DATA_PATH)) {
    try {
      cache = { ...emptyStore(), ...JSON.parse(readFileSync(DATA_PATH, "utf8")) };
      return cache!;
    } catch {
      /* fallthrough */
    }
  }
  cache = buildDemoStore();
  persist();
  return cache;
}

function persist() {
  if (!cache) return;
  writeFileSync(DATA_PATH, JSON.stringify(cache, null, 2));
}

export function getStore() {
  return load();
}

export function saveStore(next: MesaFlowStore) {
  cache = next;
  persist();
}

function notify(establishmentId: string, type: string, title: string, body: string) {
  const store = getStore();
  const n: Notification = {
    id: id("ntf_"),
    establishmentId,
    type,
    title,
    body,
    read: false,
    createdAt: new Date().toISOString(),
  };
  store.notifications[n.id] = n;
  saveStore(store);
  emit({ type: "notification", notificationId: n.id, establishmentId });
}

export function findEstablishmentBySlug(slug: string) {
  const store = getStore();
  return Object.values(store.establishments).find((e) => e.slug === slug) || null;
}

export function findTableByQr(establishmentId: string, tableToken: string) {
  const store = getStore();
  return (
    Object.values(store.tables).find(
      (t) => t.establishmentId === establishmentId && (t.qrToken === tableToken || t.number === tableToken),
    ) || null
  );
}

export function getOrOpenCommand(table: Table): Command {
  const store = getStore();
  if (table.commandId && store.commands[table.commandId]?.status === "ABERTA") {
    return store.commands[table.commandId];
  }
  const cmd: Command = {
    id: id("cmd_"),
    establishmentId: table.establishmentId,
    tableId: table.id,
    openedAt: new Date().toISOString(),
    status: "ABERTA",
    guestCount: 2,
    total: 0,
  };
  store.commands[cmd.id] = cmd;
  table.commandId = cmd.id;
  table.status = "OCUPADA";
  store.tables[table.id] = table;
  saveStore(store);
  emit({ type: "command.updated", commandId: cmd.id, establishmentId: table.establishmentId });
  return cmd;
}

export function recalcCommandTotal(commandId: string) {
  const store = getStore();
  const cmd = store.commands[commandId];
  if (!cmd) return;
  const orders = Object.values(store.orders).filter((o) => o.commandId === commandId && o.status !== "CANCELADO");
  cmd.total = orders.reduce((s, o) => s + o.total, 0);
  store.commands[commandId] = cmd;
  saveStore(store);
}

export function nextOrderNumber(establishmentId: string) {
  const store = getStore();
  const n = (store.orderCounter[establishmentId] || 1200) + 1;
  store.orderCounter[establishmentId] = n;
  saveStore(store);
  return n;
}

export function createOrder(input: {
  establishmentId: string;
  table: Table;
  commandId: string;
  items: OrderItem[];
  notes?: string;
  source?: Order["source"];
  rodizioRoundId?: string;
}): Order {
  const store = getStore();
  const total = input.items.reduce((s, i) => s + lineTotal(i), 0);
  const order: Order = {
    id: id("ord_"),
    establishmentId: input.establishmentId,
    tableId: input.table.id,
    tableNumber: input.table.number,
    commandId: input.commandId,
    number: nextOrderNumber(input.establishmentId),
    status: "NOVO",
    items: input.items.map((i) => ({ ...i, status: "NOVO" as OrderStatus })),
    notes: input.notes,
    source: input.source || "MESA",
    rodizioRoundId: input.rodizioRoundId,
    total,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.orders[order.id] = order;
  saveStore(store);
  recalcCommandTotal(input.commandId);
  notify(input.establishmentId, "order.new", "Novo pedido", `Mesa ${input.table.number} · Pedido #${order.number}`);
  emit({ type: "order.created", orderId: order.id, establishmentId: input.establishmentId });
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const store = getStore();
  const order = store.orders[orderId];
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.items = order.items.map((i) => ({ ...i, status }));
  store.orders[orderId] = order;
  saveStore(store);
  if (status === "PRONTO") {
    notify(order.establishmentId, "order.ready", "Pedido pronto", `#${order.number} · Mesa ${order.tableNumber}`);
  }
  emit({ type: "order.updated", orderId, establishmentId: order.establishmentId });
  return order;
}

export function requestBill(tableId: string) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table?.commandId) return null;
  const cmd = store.commands[table.commandId];
  if (!cmd) return null;
  cmd.status = "PAGAMENTO_SOLICITADO";
  table.status = "AGUARDANDO_PAGAMENTO";
  store.commands[cmd.id] = cmd;
  store.tables[tableId] = table;
  saveStore(store);
  notify(table.establishmentId, "bill.request", "Conta solicitada", `Mesa ${table.number}`);
  emit({ type: "command.updated", commandId: cmd.id, establishmentId: table.establishmentId });
  return cmd;
}

export function createRodizioRound(input: {
  establishmentId: string;
  table: Table;
  commandId: string;
  rodizioId: string;
  items: OrderItem[];
}): RodizioRound {
  const store = getStore();
  const existing = Object.values(store.rodizioRounds).filter(
    (r) => r.commandId === input.commandId && r.rodizioId === input.rodizioId,
  );
  const round: RodizioRound = {
    id: id("rrd_"),
    establishmentId: input.establishmentId,
    commandId: input.commandId,
    tableId: input.table.id,
    rodizioId: input.rodizioId,
    roundNumber: existing.length + 1,
    status: "NOVO",
    items: input.items,
    createdAt: new Date().toISOString(),
  };
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  createOrder({
    establishmentId: input.establishmentId,
    table: input.table,
    commandId: input.commandId,
    items: input.items,
    source: "RODIZIO",
    rodizioRoundId: round.id,
  });
  round.sentAt = new Date().toISOString();
  round.status = "ACEITO";
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  notify(input.establishmentId, "rodizio.round", "Nova rodada", `Mesa ${input.table.number} · Rodada ${round.roundNumber}`);
  emit({ type: "rodizio.round", roundId: round.id, establishmentId: input.establishmentId });
  return round;
}

export function dashboardStats(establishmentId: string) {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);
  const orders = Object.values(store.orders).filter(
    (o) => o.establishmentId === establishmentId && o.createdAt.startsWith(today) && o.status !== "CANCELADO",
  );
  const revenue = orders.filter((o) => o.status === "ENTREGUE").reduce((s, o) => s + o.total, 0);
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishmentId);
  const occupied = tables.filter((t) => t.status === "OCUPADA").length;
  const inPrep = orders.filter((o) => ["ACEITO", "EM_PREPARO"].includes(o.status)).length;
  const pending = orders.filter((o) => o.status === "NOVO").length;
  const ticket = orders.length ? revenue / Math.max(1, orders.filter((o) => o.status === "ENTREGUE").length) : 0;

  const productSales: Record<string, { name: string; qty: number }> = {};
  for (const o of orders) {
    for (const item of o.items) {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, qty: 0 };
      productSales[item.productId].qty += item.qty;
    }
  }
  const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return {
    revenue,
    ordersToday: orders.length,
    ticketAvg: ticket,
    tablesOccupied: occupied,
    tablesTotal: tables.length,
    inPrep,
    pending,
    topProducts,
  };
}
