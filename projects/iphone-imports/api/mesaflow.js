"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/_mesaflow/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(handler_exports);

// ../mesaflow/src/lib/store.ts
var import_fs = require("fs");
var import_path = require("path");

// ../mesaflow/src/lib/crypto-utils.ts
var import_crypto = require("crypto");
function hashPassword(password) {
  return (0, import_crypto.createHash)("sha256").update(`mesaflow:${password}`).digest("hex");
}
function id(prefix = "") {
  return `${prefix}${(0, import_crypto.randomBytes)(8).toString("hex")}`;
}

// ../mesaflow/src/lib/events.ts
var listeners = /* @__PURE__ */ new Map();
function emit(event) {
  const set = listeners.get(event.establishmentId);
  if (!set) return;
  for (const fn of set) fn(event);
}

// ../mesaflow/src/lib/order-math.ts
function lineTotal(item) {
  const addons = item.addons.reduce((s, a) => s + a.price * a.qty, 0);
  return item.qty * (item.unitPrice + item.variantDelta) + addons;
}

// ../mesaflow/src/lib/demo.ts
var DEMO_ESTABLISHMENT_SLUG = "ponto-do-sabor";
var DEMO_ESTABLISHMENT_ID = "est_ponto_sabor";

// ../mesaflow/src/lib/seed.ts
var EST_ID = DEMO_ESTABLISHMENT_ID;
var DEMO_SLUG = DEMO_ESTABLISHMENT_SLUG;
var img = (seed) => `https://images.unsplash.com/photo-${seed}?w=800&q=80&auto=format&fit=crop`;
function buildDemoStore() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const sectors = {
    sec_cozinha: {
      id: "sec_cozinha",
      establishmentId: EST_ID,
      name: "Cozinha",
      kind: "COZINHA",
      color: "#f97316",
      active: true
    },
    sec_balcao: {
      id: "sec_balcao",
      establishmentId: EST_ID,
      name: "Balc\xE3o",
      kind: "BALCAO",
      color: "#3b82f6",
      active: true
    },
    sec_bar: {
      id: "sec_bar",
      establishmentId: EST_ID,
      name: "Bar",
      kind: "BAR",
      color: "#a855f7",
      active: true
    }
  };
  const categories = {
    cat_burger: { id: "cat_burger", establishmentId: EST_ID, name: "Hamb\xFArgueres", emoji: "\u{1F354}", sortOrder: 1, active: true },
    cat_pizza: { id: "cat_pizza", establishmentId: EST_ID, name: "Pizzas", emoji: "\u{1F355}", sortOrder: 2, active: true },
    cat_porcao: { id: "cat_porcao", establishmentId: EST_ID, name: "Por\xE7\xF5es", emoji: "\u{1F35F}", sortOrder: 3, active: true },
    cat_bebida: { id: "cat_bebida", establishmentId: EST_ID, name: "Bebidas", emoji: "\u{1F964}", sortOrder: 4, active: true },
    cat_doce: { id: "cat_doce", establishmentId: EST_ID, name: "Sobremesas", emoji: "\u{1F370}", sortOrder: 5, active: true },
    cat_rodizio: { id: "cat_rodizio", establishmentId: EST_ID, name: "Rod\xEDzio", emoji: "\u{1F525}", sortOrder: 6, active: true }
  };
  const products = {
    p_xburger: {
      id: "p_xburger",
      establishmentId: EST_ID,
      categoryId: "cat_burger",
      sectorId: "sec_cozinha",
      name: "X-Burger Artesanal",
      description: "Blend 180g, queijo prato, molho da casa e p\xE3o brioche.",
      price: 32.9,
      image: img("1568901716194-d49b35ccf59f"),
      tags: ["destaque"],
      prepMinutes: 18,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [
        { id: "v_simples", name: "Simples", priceDelta: 0 },
        { id: "v_duplo", name: "Duplo", priceDelta: 14 }
      ],
      addons: [
        { id: "a_bacon", name: "Bacon", price: 6 },
        { id: "a_cheddar", name: "Cheddar", price: 5 }
      ],
      rodizioIncluded: false
    },
    p_xsalada: {
      id: "p_xsalada",
      establishmentId: EST_ID,
      categoryId: "cat_burger",
      sectorId: "sec_cozinha",
      name: "X-Salada Premium",
      description: "Hamb\xFArguer com salada fresca, tomate e cebola roxa.",
      price: 36.9,
      image: img("1550547660-b9eea9836a88"),
      tags: [],
      prepMinutes: 20,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [{ id: "a_ovo", name: "Ovo", price: 4 }],
      rodizioIncluded: false
    },
    p_pizza_calabresa: {
      id: "p_pizza_calabresa",
      establishmentId: EST_ID,
      categoryId: "cat_pizza",
      sectorId: "sec_cozinha",
      name: "Pizza Calabresa",
      description: "Massa fina, calabresa fatiada e cebola.",
      price: 54.9,
      image: img("1513104890138-7c749659a591"),
      tags: ["rod\xEDzio"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [
        { id: "v_p", name: "Broto", priceDelta: -12 },
        { id: "v_g", name: "Grande", priceDelta: 18 }
      ],
      addons: [{ id: "a_borda_cat", name: "Borda catupiry", price: 12 }],
      rodizioIncluded: true
    },
    p_pizza_frango: {
      id: "p_pizza_frango",
      establishmentId: EST_ID,
      categoryId: "cat_pizza",
      sectorId: "sec_cozinha",
      name: "Frango com Catupiry",
      description: "Cl\xE1ssica da casa com frango desfiado.",
      price: 56.9,
      image: img("1574071318508-1cdbab1a896f"),
      tags: ["rod\xEDzio"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: true,
      rodizioPremiumPrice: 9.9
    },
    p_pizza_marg: {
      id: "p_pizza_marg",
      establishmentId: EST_ID,
      categoryId: "cat_pizza",
      sectorId: "sec_cozinha",
      name: "Marguerita",
      description: "Molho de tomate, mussarela e manjeric\xE3o.",
      price: 49.9,
      image: img("1604382354936-07c5d9983bd3"),
      tags: ["rod\xEDzio"],
      prepMinutes: 22,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: true
    },
    p_batata: {
      id: "p_batata",
      establishmentId: EST_ID,
      categoryId: "cat_porcao",
      sectorId: "sec_cozinha",
      name: "Batata Frita Grande",
      description: "Por\xE7\xE3o generosa com alecrim e parmes\xE3o.",
      price: 28.9,
      image: img("1573080496219-a418b8a838f6"),
      tags: [],
      prepMinutes: 12,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [{ id: "a_cheddar_bat", name: "Cheddar", price: 8 }],
      rodizioIncluded: false
    },
    p_coxinha: {
      id: "p_coxinha",
      establishmentId: EST_ID,
      categoryId: "cat_porcao",
      sectorId: "sec_balcao",
      name: "Coxinha de Frango",
      description: "Massa crocante, recheio cremoso (unidade).",
      price: 9.9,
      image: img("1608037375126-370c4aa7859e"),
      tags: [],
      prepMinutes: 5,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_coca: {
      id: "p_coca",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_balcao",
      name: "Coca-Cola Lata",
      description: "350ml gelada.",
      price: 8.9,
      image: img("1629203851122-3726ecdf080e"),
      tags: [],
      prepMinutes: 1,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_cappuccino: {
      id: "p_cappuccino",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_balcao",
      name: "Cappuccino",
      description: "Espresso, leite vaporizado e espuma.",
      price: 14.9,
      image: img("1572442383536-47c21b6ff7c5"),
      tags: [],
      prepMinutes: 6,
      availability: "SOB_DEMANDA",
      featured: true,
      active: true,
      variants: [
        { id: "v_p", name: "Pequeno", priceDelta: 0 },
        { id: "v_g", name: "Grande", priceDelta: 4 }
      ],
      addons: [
        { id: "a_leite_amend", name: "Leite de am\xEAndoas", price: 3 },
        { id: "a_chantilly", name: "Chantilly", price: 2 }
      ],
      rodizioIncluded: false
    },
    p_chopp: {
      id: "p_chopp",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_bar",
      name: "Chopp Artesanal",
      description: "300ml da torneira.",
      price: 16.9,
      image: img("1608272941294-597ded4a8af3"),
      tags: [],
      prepMinutes: 2,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [{ id: "v_500", name: "500ml", priceDelta: 8 }],
      addons: [],
      rodizioIncluded: false
    },
    p_caipirinha: {
      id: "p_caipirinha",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_bar",
      name: "Caipirinha",
      description: "Lim\xE3o, cacha\xE7a e gelo.",
      price: 22.9,
      image: img("1551539166-88256b0655f4"),
      tags: [],
      prepMinutes: 5,
      availability: "SOB_DEMANDA",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_pudim: {
      id: "p_pudim",
      establishmentId: EST_ID,
      categoryId: "cat_doce",
      sectorId: "sec_balcao",
      name: "Pudim de Leite",
      description: "Receita da v\xF3, calda caramelizada.",
      price: 18.9,
      image: img("1586985289765-7b0e9e725bfe"),
      tags: [],
      prepMinutes: 3,
      availability: "VITRINE",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_brownie: {
      id: "p_brownie",
      establishmentId: EST_ID,
      categoryId: "cat_doce",
      sectorId: "sec_balcao",
      name: "Brownie com Sorvete",
      description: "Chocolate belga e sorvete de creme.",
      price: 24.9,
      image: img("1606313564204-75a0c8d0538f"),
      tags: [],
      prepMinutes: 5,
      availability: "SOB_DEMANDA",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_pizza_pepper: {
      id: "p_pizza_pepper",
      establishmentId: EST_ID,
      categoryId: "cat_rodizio",
      sectorId: "sec_cozinha",
      name: "Pizza Pepperoni",
      description: "Pepperoni importado e mussarela.",
      price: 59.9,
      image: img("1628840040245-3fea7438c6a0"),
      tags: ["rod\xEDzio", "premium"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: true,
      rodizioPremiumPrice: 9.9
    },
    p_salada: {
      id: "p_salada",
      establishmentId: EST_ID,
      categoryId: "cat_porcao",
      sectorId: "sec_cozinha",
      name: "Salada da Casa",
      description: "Mix de folhas, tomate cereja e molho bals\xE2mico.",
      price: 26.9,
      image: img("1512621776951-a57141f2eefd"),
      tags: [],
      prepMinutes: 8,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    }
  };
  const tables = {};
  for (let i = 1; i <= 10; i++) {
    const tid = `tbl_${i}`;
    tables[tid] = {
      id: tid,
      establishmentId: EST_ID,
      number: String(i).padStart(2, "0"),
      name: `Mesa ${String(i).padStart(2, "0")}`,
      capacity: i <= 4 ? 4 : i <= 7 ? 6 : 8,
      status: i === 4 || i === 8 ? "OCUPADA" : i === 3 ? "AGUARDANDO_PAGAMENTO" : "LIVRE",
      qrToken: `mesa-${i}`
    };
  }
  const cmd4 = {
    id: "cmd_demo_4",
    establishmentId: EST_ID,
    tableId: "tbl_4",
    openedAt: new Date(Date.now() - 45 * 6e4).toISOString(),
    status: "ABERTA",
    guestCount: 4,
    total: 0
  };
  tables.tbl_4.commandId = cmd4.id;
  const cmd8 = {
    id: "cmd_demo_8",
    establishmentId: EST_ID,
    tableId: "tbl_8",
    openedAt: new Date(Date.now() - 20 * 6e4).toISOString(),
    status: "ABERTA",
    guestCount: 2,
    total: 0
  };
  tables.tbl_8.commandId = cmd8.id;
  function demoItem(productId, qty, status = "EM_PREPARO", notes) {
    const p = products[productId];
    const sec = sectors[p.sectorId];
    return {
      id: id("oi_"),
      productId: p.id,
      productName: p.name,
      sectorId: p.sectorId,
      sectorName: sec.name,
      qty,
      unitPrice: p.price,
      variantDelta: 0,
      addons: [],
      notes,
      status
    };
  }
  const demoOrders = [
    {
      id: "ord_demo_1",
      establishmentId: EST_ID,
      tableId: "tbl_8",
      tableNumber: "08",
      commandId: cmd8.id,
      number: 1294,
      status: "EM_PREPARO",
      items: [demoItem("p_xburger", 2, "EM_PREPARO", "1 sem cebola"), demoItem("p_batata", 1)],
      total: 94.7,
      source: "MESA",
      createdAt: new Date(Date.now() - 4 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ord_demo_2",
      establishmentId: EST_ID,
      tableId: "tbl_4",
      tableNumber: "04",
      commandId: cmd4.id,
      number: 1293,
      status: "NOVO",
      items: [demoItem("p_cappuccino", 2), demoItem("p_coxinha", 1)],
      total: 39.7,
      source: "MESA",
      createdAt: new Date(Date.now() - 1 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ord_demo_3",
      establishmentId: EST_ID,
      tableId: "tbl_4",
      tableNumber: "04",
      commandId: cmd4.id,
      number: 1290,
      status: "PRONTO",
      items: [demoItem("p_chopp", 2), demoItem("p_caipirinha", 1)],
      total: 56.7,
      source: "MESA",
      createdAt: new Date(Date.now() - 18 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ord_demo_4",
      establishmentId: EST_ID,
      tableId: "tbl_4",
      tableNumber: "04",
      commandId: cmd4.id,
      number: 1288,
      status: "ENTREGUE",
      items: [demoItem("p_pizza_calabresa", 1), demoItem("p_salada", 1)],
      total: 81.8,
      source: "MESA",
      createdAt: new Date(Date.now() - 55 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  cmd4.total = demoOrders.filter((o) => o.commandId === cmd4.id).reduce((s, o) => s + o.total, 0);
  cmd8.total = demoOrders.filter((o) => o.commandId === cmd8.id).reduce((s, o) => s + o.total, 0);
  return {
    establishments: {
      [EST_ID]: {
        id: EST_ID,
        slug: DEMO_SLUG,
        name: "Ponto do Sabor",
        tagline: "Gar\xE7om digital na sua mesa",
        logo: "\u{1F37D}\uFE0F",
        open: true,
        rodizioEnabled: true,
        settings: {
          currency: "BRL",
          allowEditAfterPrep: false,
          soundNotifications: true,
          minIntervalRodizioSec: 120
        },
        createdAt: now
      }
    },
    users: {
      user_owner: {
        id: "user_owner",
        establishmentId: EST_ID,
        email: "owner@pontodosabor.com",
        passwordHash: hashPassword("demo123"),
        name: "Carlos Mendes",
        role: "OWNER",
        active: true
      }
    },
    sectors,
    categories,
    products,
    tables,
    commands: { [cmd4.id]: cmd4, [cmd8.id]: cmd8 },
    orders: Object.fromEntries(demoOrders.map((o) => [o.id, o])),
    rodizios: {
      rod_pizza: {
        id: "rod_pizza",
        establishmentId: EST_ID,
        name: "Rod\xEDzio de Pizza",
        pricePerPerson: 59.9,
        durationMinutes: 90,
        maxItemsPerRound: 6,
        maxRounds: 8,
        minIntervalSec: 120,
        drinksIncluded: false,
        active: true,
        productIds: ["p_pizza_calabresa", "p_pizza_frango", "p_pizza_marg", "p_pizza_pepper"],
        premiumProductIds: ["p_pizza_frango", "p_pizza_pepper"]
      }
    },
    rodizioRounds: {},
    notifications: {},
    orderCounter: { [EST_ID]: 1294 }
  };
}

// ../mesaflow/src/lib/store.ts
var DATA_PATH = process.env.MESAFLOW_DATA || (process.env.VERCEL ? "/tmp/mesaflow-store.json" : (0, import_path.join)(process.cwd(), "data", "store.json"));
var cache = null;
function emptyStore() {
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
    orderCounter: {}
  };
}
function load() {
  if (cache) return cache;
  (0, import_fs.mkdirSync)((0, import_path.dirname)(DATA_PATH), { recursive: true });
  if ((0, import_fs.existsSync)(DATA_PATH)) {
    try {
      cache = { ...emptyStore(), ...JSON.parse((0, import_fs.readFileSync)(DATA_PATH, "utf8")) };
      return cache;
    } catch {
    }
  }
  cache = buildDemoStore();
  persist();
  return cache;
}
function persist() {
  if (!cache) return;
  (0, import_fs.writeFileSync)(DATA_PATH, JSON.stringify(cache, null, 2));
}
function getStore() {
  return load();
}
function saveStore(next) {
  cache = next;
  persist();
}
function notify(establishmentId, type, title, body) {
  const store = getStore();
  const n = {
    id: id("ntf_"),
    establishmentId,
    type,
    title,
    body,
    read: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  store.notifications[n.id] = n;
  saveStore(store);
  emit({ type: "notification", notificationId: n.id, establishmentId });
}
function findEstablishmentBySlug(slug) {
  const store = getStore();
  return Object.values(store.establishments).find((e) => e.slug === slug) || null;
}
function findTableByQr(establishmentId, tableToken) {
  const store = getStore();
  return Object.values(store.tables).find(
    (t) => t.establishmentId === establishmentId && (t.qrToken === tableToken || t.number === tableToken)
  ) || null;
}
function getOrOpenCommand(table) {
  const store = getStore();
  if (table.commandId && store.commands[table.commandId]?.status === "ABERTA") {
    return store.commands[table.commandId];
  }
  const cmd = {
    id: id("cmd_"),
    establishmentId: table.establishmentId,
    tableId: table.id,
    openedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "ABERTA",
    guestCount: 2,
    total: 0
  };
  store.commands[cmd.id] = cmd;
  table.commandId = cmd.id;
  table.status = "OCUPADA";
  store.tables[table.id] = table;
  saveStore(store);
  emit({ type: "command.updated", commandId: cmd.id, establishmentId: table.establishmentId });
  return cmd;
}
function recalcCommandTotal(commandId) {
  const store = getStore();
  const cmd = store.commands[commandId];
  if (!cmd) return;
  const orders = Object.values(store.orders).filter((o) => o.commandId === commandId && o.status !== "CANCELADO");
  cmd.total = orders.reduce((s, o) => s + o.total, 0);
  store.commands[commandId] = cmd;
  saveStore(store);
}
function nextOrderNumber(establishmentId) {
  const store = getStore();
  const n = (store.orderCounter[establishmentId] || 1200) + 1;
  store.orderCounter[establishmentId] = n;
  saveStore(store);
  return n;
}
function createOrder(input) {
  const store = getStore();
  const total = input.items.reduce((s, i) => s + lineTotal(i), 0);
  const order = {
    id: id("ord_"),
    establishmentId: input.establishmentId,
    tableId: input.table.id,
    tableNumber: input.table.number,
    commandId: input.commandId,
    number: nextOrderNumber(input.establishmentId),
    status: "NOVO",
    items: input.items.map((i) => ({ ...i, status: "NOVO" })),
    notes: input.notes,
    source: input.source || "MESA",
    rodizioRoundId: input.rodizioRoundId,
    total,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  store.orders[order.id] = order;
  saveStore(store);
  recalcCommandTotal(input.commandId);
  notify(input.establishmentId, "order.new", "Novo pedido", `Mesa ${input.table.number} \xB7 Pedido #${order.number}`);
  emit({ type: "order.created", orderId: order.id, establishmentId: input.establishmentId });
  return order;
}
function updateOrderStatus(orderId, status) {
  const store = getStore();
  const order = store.orders[orderId];
  if (!order) return null;
  order.status = status;
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  order.items = order.items.map((i) => ({ ...i, status }));
  store.orders[orderId] = order;
  saveStore(store);
  if (status === "PRONTO") {
    notify(order.establishmentId, "order.ready", "Pedido pronto", `#${order.number} \xB7 Mesa ${order.tableNumber}`);
  }
  emit({ type: "order.updated", orderId, establishmentId: order.establishmentId });
  return order;
}
function requestBill(tableId) {
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
function createRodizioRound(input) {
  const store = getStore();
  const existing = Object.values(store.rodizioRounds).filter(
    (r) => r.commandId === input.commandId && r.rodizioId === input.rodizioId
  );
  const round = {
    id: id("rrd_"),
    establishmentId: input.establishmentId,
    commandId: input.commandId,
    tableId: input.table.id,
    rodizioId: input.rodizioId,
    roundNumber: existing.length + 1,
    status: "NOVO",
    items: input.items,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  createOrder({
    establishmentId: input.establishmentId,
    table: input.table,
    commandId: input.commandId,
    items: input.items,
    source: "RODIZIO",
    rodizioRoundId: round.id
  });
  round.sentAt = (/* @__PURE__ */ new Date()).toISOString();
  round.status = "ACEITO";
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  notify(input.establishmentId, "rodizio.round", "Nova rodada", `Mesa ${input.table.number} \xB7 Rodada ${round.roundNumber}`);
  emit({ type: "rodizio.round", roundId: round.id, establishmentId: input.establishmentId });
  return round;
}
function dashboardStats(establishmentId) {
  const store = getStore();
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const orders = Object.values(store.orders).filter(
    (o) => o.establishmentId === establishmentId && o.createdAt.startsWith(today) && o.status !== "CANCELADO"
  );
  const revenue = orders.filter((o) => o.status === "ENTREGUE").reduce((s, o) => s + o.total, 0);
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishmentId);
  const occupied = tables.filter((t) => t.status === "OCUPADA").length;
  const inPrep = orders.filter((o) => ["ACEITO", "EM_PREPARO"].includes(o.status)).length;
  const pending = orders.filter((o) => o.status === "NOVO").length;
  const ticket = orders.length ? revenue / Math.max(1, orders.filter((o) => o.status === "ENTREGUE").length) : 0;
  const productSales = {};
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
    topProducts
  };
}

// api/_mesaflow/handler.ts
function resolvePath(req) {
  const q = req.query?.path;
  if (Array.isArray(q) && q.length > 0) return "/" + q.map(String).join("/");
  if (typeof q === "string" && q.length > 0) return "/" + q.replace(/^\/+/, "");
  const originalUrl = req.url || "/";
  const qIndex = originalUrl.indexOf("?");
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
  const stripped = pathname.replace(/^\/api\/mesaflow\/?/, "/") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}
function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.send(JSON.stringify(body));
}
async function handler(req, res) {
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
      if (!slug || !table) return json(res, 400, { error: "Path inv\xE1lido." });
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
      if (!est.open) return json(res, 403, { error: "Estabelecimento fechado no momento." });
      const tbl = findTableByQr(est.id, table);
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida ou QR expirado." });
      const command = getOrOpenCommand(tbl);
      const categories = Object.values(store.categories).filter((c) => c.establishmentId === est.id && c.active).sort((a, b) => a.sortOrder - b.sortOrder);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id && p.active);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id);
      const orders = Object.values(store.orders).filter((o) => o.commandId === command.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const rodizio = est.rodizioEnabled ? Object.values(store.rodizios).find((r) => r.establishmentId === est.id && r.active) : null;
      return json(res, 200, {
        establishment: est,
        table: tbl,
        command,
        categories,
        products,
        sectors,
        orders,
        rodizio
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
      const body = req.body || {};
      const est = findEstablishmentBySlug(body.slug);
      if (!est?.open) return json(res, 400, { error: "Estabelecimento indispon\xEDvel." });
      const tbl = findTableByQr(est.id, body.tableToken);
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida." });
      if (!body.items?.length) return json(res, 400, { error: "Carrinho vazio." });
      const command = getOrOpenCommand(tbl);
      const order = createOrder({
        establishmentId: est.id,
        table: tbl,
        commandId: command.id,
        items: body.items.map((i) => ({ ...i, id: i.id || `oi_${Date.now()}` })),
        notes: body.notes,
        source: "MESA"
      });
      return json(res, 200, { order, total: order.total });
    }
    const orderMatch = path.match(/^\/orders\/([^/]+)$/);
    if (orderMatch) {
      const orderId = orderMatch[1];
      if (req.method === "GET") {
        const order = store.orders[orderId];
        if (!order) return json(res, 404, { error: "N\xE3o encontrado" });
        return json(res, 200, { order });
      }
      if (req.method === "PATCH") {
        const body = req.body || {};
        const order = updateOrderStatus(orderId, body.status);
        if (!order) return json(res, 404, { error: "Pedido n\xE3o encontrado." });
        return json(res, 200, { order });
      }
    }
    if (req.method === "POST" && path === "/auth/login") {
      const body = req.body || {};
      const user = Object.values(store.users).find(
        (u) => u.email.toLowerCase() === String(body.email).toLowerCase() && u.active
      );
      if (!user || user.passwordHash !== hashPassword(String(body.password))) {
        return json(res, 401, { error: "E-mail ou senha inv\xE1lidos." });
      }
      const establishment = store.establishments[user.establishmentId];
      return json(res, 200, {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        establishment
      });
    }
    if (req.method === "POST" && path === "/bill") {
      const body = req.body || {};
      const est = findEstablishmentBySlug(body.slug);
      if (!est) return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
      const table = findTableByQr(est.id, body.tableToken);
      if (!table) return json(res, 404, { error: "Mesa inv\xE1lida." });
      const cmd = requestBill(table.id);
      return json(res, 200, { ok: true, command: cmd });
    }
    if (req.method === "GET" && path === "/admin/dashboard") {
      const slug = String(req.query?.slug || "");
      if (!slug) return json(res, 400, { error: "slug required" });
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "not found" });
      const stats = dashboardStats(est.id);
      const orders = Object.values(store.orders).filter((o) => o.establishmentId === est.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
      const notifications = Object.values(store.notifications).filter((n) => n.establishmentId === est.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);
      const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
      return json(res, 200, { establishment: est, stats, orders, tables, commands, notifications });
    }
    if (req.method === "POST" && path === "/rodizio/round") {
      const body = req.body || {};
      const est = findEstablishmentBySlug(body.slug);
      if (!est?.rodizioEnabled) return json(res, 400, { error: "Rod\xEDzio indispon\xEDvel." });
      const table = findTableByQr(est.id, body.tableToken);
      if (!table) return json(res, 404, { error: "Mesa inv\xE1lida." });
      const rodizio = store.rodizios[body.rodizioId];
      if (!rodizio) return json(res, 404, { error: "Rod\xEDzio n\xE3o encontrado." });
      if (body.items.length > rodizio.maxItemsPerRound) {
        return json(res, 400, { error: `M\xE1ximo ${rodizio.maxItemsPerRound} itens por rodada.` });
      }
      const command = getOrOpenCommand(table);
      const round = createRodizioRound({
        establishmentId: est.id,
        table,
        commandId: command.id,
        rodizioId: body.rodizioId,
        items: body.items
      });
      return json(res, 200, { round, message: "Rodada enviada para a cozinha." });
    }
    return json(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("[mesaflow] handler error", err);
    return json(res, 500, { error: "Internal error" });
  }
}
//# sourceMappingURL=mesaflow.js.map
