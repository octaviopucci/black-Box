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

// projects/iphone-imports/api/_mesaflow/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(handler_exports);

// projects/mesaflow/src/lib/store.ts
var import_fs = require("fs");
var import_path = require("path");
var import_blob = require("@vercel/blob");

// projects/mesaflow/src/lib/crypto-utils.ts
var import_crypto = require("crypto");
function hashPassword(password) {
  return (0, import_crypto.createHash)("sha256").update(`mesaflow:${password}`).digest("hex");
}
function id(prefix = "") {
  return `${prefix}${(0, import_crypto.randomBytes)(8).toString("hex")}`;
}
function sessionToken() {
  return (0, import_crypto.randomBytes)(32).toString("hex");
}

// projects/mesaflow/src/lib/events.ts
var listeners = /* @__PURE__ */ new Map();
function emit(event) {
  const set = listeners.get(event.establishmentId);
  if (!set) return;
  for (const fn of set) fn(event);
}

// projects/mesaflow/src/lib/order-math.ts
function lineTotal(item) {
  const addons = item.addons.reduce((s, a) => s + a.price * a.qty, 0);
  return item.qty * (item.unitPrice + item.variantDelta) + addons;
}

// projects/mesaflow/src/lib/product-images.ts
var PEXELS_Q = "auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
function pexels(id2, slug = "pexels-photo") {
  return `https://images.pexels.com/photos/${id2}/${slug}-${id2}.jpeg?${PEXELS_Q}`;
}
function unsplash(id2) {
  return `https://images.unsplash.com/photo-${id2}?w=800&h=600&q=80&auto=format&fit=crop`;
}
var PRODUCT_IMAGES = {
  p_xburger: pexels(1639562),
  // hambúrguer artesanal
  p_xsalada: pexels(1279330),
  // burger com salada
  p_pizza_calabresa: unsplash("1513104890138-7c749659a591"),
  // pizza calabresa
  p_pizza_frango: pexels(2983101),
  // pizza de frango
  p_pizza_marg: unsplash("1565299624946-b28f40a0ae38"),
  // pizza margherita
  p_pizza_pepper: unsplash("1604382354936-07c5d9983bd3"),
  // pizza pepperoni
  p_batata: pexels(1581384),
  // batata frita
  p_coxinha: pexels(4518843),
  // salgado / coxinha
  p_coca: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  // coca-cola lata
  p_cappuccino: unsplash("1572442388796-11668a67e53d"),
  // cappuccino com latte art
  p_chopp: pexels(15515325),
  // chopp / cerveja na torneira
  p_caipirinha: pexels(2097090),
  // caipirinha / coquetel
  p_pudim: unsplash("1551024506-0bccd828d307"),
  // pudim de leite
  p_brownie: pexels(1624487),
  // brownie com sorvete
  p_salada: unsplash("1512621776951-a57141f2eefd")
  // salada fresca
};
var FOOD_PRESETS = {
  burger: pexels(1639562),
  xsalada: pexels(1279330),
  pizza: unsplash("1513104890138-7c749659a591"),
  prato: unsplash("1504674900247-0877df9cc836"),
  padaria: pexels(5632401),
  porcao: pexels(1581384),
  bebida: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  cafe: unsplash("1495474472287-4d71bcdd2085"),
  default: pexels(1893556)
};
function productImage(id2, fallback = "default") {
  if (PRODUCT_IMAGES[id2]) return PRODUCT_IMAGES[id2];
  if (fallback in FOOD_PRESETS) return FOOD_PRESETS[fallback];
  return FOOD_PRESETS.default;
}
function productImageByName(name, preset = "default") {
  const n = name.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (n.includes("x-salada") || n.includes("x salada")) return FOOD_PRESETS.xsalada;
  if (n.includes("burger") || n.includes("x-burger") || n.includes("hamburguer")) return FOOD_PRESETS.burger;
  if (n.includes("pizza") || n.includes("calabresa") || n.includes("pepperoni") || n.includes("marguerita") || n.includes("margherita")) {
    if (n.includes("pepperoni")) return PRODUCT_IMAGES.p_pizza_pepper;
    if (n.includes("marguerita") || n.includes("margherita")) return PRODUCT_IMAGES.p_pizza_marg;
    if (n.includes("frango")) return PRODUCT_IMAGES.p_pizza_frango;
    return PRODUCT_IMAGES.p_pizza_calabresa;
  }
  if (n.includes("coxinha") || n.includes("salgado")) return PRODUCT_IMAGES.p_coxinha;
  if (n.includes("pao") || n.includes("padaria") || n.includes("croissant")) return FOOD_PRESETS.padaria;
  if (n.includes("batata") || n.includes("porcao")) return FOOD_PRESETS.porcao;
  if (n.includes("refrigerante") || n.includes("coca") || n.includes("suco")) return FOOD_PRESETS.bebida;
  if (n.includes("cappuccino") || n.includes("capuccino")) return PRODUCT_IMAGES.p_cappuccino;
  if (n.includes("cafe") || n.includes("espresso") || n.includes("expresso") || n.includes("latte")) return FOOD_PRESETS.cafe;
  if (n.includes("chopp") || n.includes("cerveja")) return pexels(15515325);
  if (n.includes("caipirinha") || n.includes("drink")) return pexels(2097090);
  if (n.includes("pudim") || n.includes("flan")) return PRODUCT_IMAGES.p_pudim;
  if (n.includes("brownie") || n.includes("bolo") || n.includes("sobremesa") || n.includes("doce")) return PRODUCT_IMAGES.p_brownie;
  if (n.includes("salada")) return unsplash("1512621776951-a57141f2eefd");
  if (n.includes("prato")) return FOOD_PRESETS.prato;
  return FOOD_PRESETS[preset] ?? FOOD_PRESETS.default;
}

// projects/mesaflow/src/lib/provision.ts
var import_crypto2 = require("crypto");
function slugify(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
function uniqueSlug(store, base) {
  let slug = slugify(base) || "estabelecimento";
  let n = 0;
  while (Object.values(store.establishments).some((e) => e.slug === slug)) {
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}
function uniqueQrToken(store, pending) {
  let token = (0, import_crypto2.randomBytes)(32).toString("hex");
  while (Object.values(store.tables).some((table) => table.qrToken === token) || Object.values(pending).some((table) => table.qrToken === token)) {
    token = (0, import_crypto2.randomBytes)(32).toString("hex");
  }
  return token;
}
var TYPE_LABELS = {
  restaurante: "Restaurante",
  lanchonete: "Lanchonete",
  padaria: "Padaria",
  bar: "Bar",
  cafeteria: "Cafeteria",
  rodizio: "Rod\xEDzio"
};
function provisionEstablishment(store, input) {
  const estId = id("est_");
  const slug = uniqueSlug(store, input.businessName);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const typeLabel = TYPE_LABELS[input.businessType];
  const establishment = {
    id: estId,
    slug,
    name: input.businessName,
    tagline: `${typeLabel} \xB7 pedidos por QR Code`,
    logo: "\u{1F37D}\uFE0F",
    open: true,
    rodizioEnabled: input.businessType === "rodizio",
    businessType: input.businessType,
    settings: {
      currency: "BRL",
      allowEditAfterPrep: false,
      soundNotifications: true,
      minIntervalRodizioSec: 120
    },
    createdAt: now
  };
  const user = {
    id: id("user_"),
    establishmentId: estId,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.ownerName,
    role: "OWNER",
    active: true
  };
  const secCozinha = id("sec_");
  const sectors = {
    [secCozinha]: {
      id: secCozinha,
      establishmentId: estId,
      name: "Cozinha",
      kind: "COZINHA",
      color: "#f97316",
      active: true
    }
  };
  const secBalcao = id("sec_");
  sectors[secBalcao] = {
    id: secBalcao,
    establishmentId: estId,
    name: "Balc\xE3o",
    kind: "BALCAO",
    color: "#3b82f6",
    active: true
  };
  let secBar = secBalcao;
  if (["bar", "restaurante", "rodizio"].includes(input.businessType)) {
    secBar = id("sec_");
    sectors[secBar] = {
      id: secBar,
      establishmentId: estId,
      name: "Bar",
      kind: "BAR",
      color: "#a855f7",
      active: true
    };
  }
  const catPrincipal = id("cat_");
  const catBebida = id("cat_");
  const categories = {
    [catPrincipal]: {
      id: catPrincipal,
      establishmentId: estId,
      name: input.businessType === "padaria" ? "Padaria" : "Pratos",
      emoji: input.businessType === "padaria" ? "\u{1F950}" : "\u{1F37D}\uFE0F",
      sortOrder: 1,
      active: true
    },
    [catBebida]: {
      id: catBebida,
      establishmentId: estId,
      name: "Bebidas",
      emoji: "\u{1F964}",
      sortOrder: 2,
      active: true
    }
  };
  const p1 = id("p_");
  const p2 = id("p_");
  const p3 = id("p_");
  const products = {
    [p1]: {
      id: p1,
      establishmentId: estId,
      categoryId: catPrincipal,
      sectorId: secCozinha,
      name: input.businessType === "padaria" ? "P\xE3o na Chapa" : "Prato do Dia",
      description: "Edite este item no painel quando o CRUD estiver dispon\xEDvel.",
      price: 29.9,
      image: input.businessType === "padaria" ? FOOD_PRESETS.padaria : productImage("p_xburger", "prato"),
      tags: ["destaque"],
      prepMinutes: 15,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    [p2]: {
      id: p2,
      establishmentId: estId,
      categoryId: catPrincipal,
      sectorId: secCozinha,
      name: input.businessType === "lanchonete" ? "X-Salada" : "Por\xE7\xE3o Especial",
      description: "Item de exemplo \u2014 personalize no card\xE1pio.",
      price: 24.9,
      image: productImageByName(
        input.businessType === "lanchonete" ? "X-Salada" : "Por\xE7\xE3o Especial",
        "porcao"
      ),
      tags: [],
      prepMinutes: 12,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    [p3]: {
      id: p3,
      establishmentId: estId,
      categoryId: catBebida,
      sectorId: secBalcao,
      name: "Refrigerante Lata",
      description: "350ml gelado.",
      price: 8.9,
      image: FOOD_PRESETS.bebida,
      tags: [],
      prepMinutes: 1,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    }
  };
  const tables = {};
  const count = Math.min(20, Math.max(3, input.tableCount || 5));
  for (let i = 1; i <= count; i++) {
    const tid = id("tbl_");
    tables[tid] = {
      id: tid,
      establishmentId: estId,
      number: String(i).padStart(2, "0"),
      name: `Mesa ${String(i).padStart(2, "0")}`,
      capacity: i <= 4 ? 4 : 6,
      status: "LIVRE",
      qrToken: uniqueQrToken(store, tables)
    };
  }
  const rodizios = {};
  if (input.businessType === "rodizio") {
    const rid = id("rod_");
    rodizios[rid] = {
      id: rid,
      establishmentId: estId,
      name: "Rod\xEDzio",
      pricePerPerson: 59.9,
      durationMinutes: 90,
      maxItemsPerRound: 6,
      maxRounds: 8,
      minIntervalSec: 120,
      drinksIncluded: false,
      active: true,
      productIds: [p1, p2],
      premiumProductIds: []
    };
  }
  store.establishments[estId] = establishment;
  store.users[user.id] = user;
  Object.assign(store.sectors, sectors);
  Object.assign(store.categories, categories);
  Object.assign(store.products, products);
  Object.assign(store.tables, tables);
  Object.assign(store.rodizios, rodizios);
  store.orderCounter[estId] = 1e3;
  return { establishment, user, slug };
}

// projects/mesaflow/src/lib/demo.ts
var DEMO_ESTABLISHMENT_SLUG = "ponto-do-sabor";
var DEMO_ESTABLISHMENT_ID = "est_ponto_sabor";

// projects/mesaflow/src/lib/seed.ts
var EST_ID = DEMO_ESTABLISHMENT_ID;
var DEMO_SLUG = DEMO_ESTABLISHMENT_SLUG;
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
      image: productImage("p_xburger"),
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
      image: productImage("p_xsalada"),
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
      image: productImage("p_pizza_calabresa"),
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
      image: productImage("p_pizza_frango"),
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
      image: productImage("p_pizza_marg"),
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
      image: productImage("p_batata"),
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
      image: productImage("p_coxinha"),
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
      image: productImage("p_coca"),
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
      image: productImage("p_cappuccino"),
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
      image: productImage("p_chopp"),
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
      image: productImage("p_caipirinha"),
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
      image: productImage("p_pudim"),
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
      image: productImage("p_brownie"),
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
      image: productImage("p_pizza_pepper"),
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
      image: productImage("p_salada"),
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
    sessions: {},
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

// projects/mesaflow/src/lib/store.ts
var BLOB_PATHNAME = "mesaflow/store.json";
var DATA_PATH = process.env.MESAFLOW_DATA || (process.env.VERCEL ? "/tmp/mesaflow-store.json" : (0, import_path.join)(process.cwd(), "data", "store.json"));
var cache = null;
var persistentDirty = false;
var runtimeOidcToken;
var SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
function emptyStore() {
  return {
    establishments: {},
    users: {},
    sessions: {},
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
function migrateProductImages(store) {
  let changed = false;
  for (const product of Object.values(store.products)) {
    const canonical = PRODUCT_IMAGES[product.id];
    const next = canonical ?? productImageByName(product.name);
    const stale = !product.image || product.image.includes("picsum.photos") || product.id === "p_cappuccino" && product.image.includes("1593508512255");
    if (stale && next && product.image !== next) {
      product.image = next;
      changed = true;
    }
  }
  if (changed) persist();
}
function load() {
  if (cache) return cache;
  (0, import_fs.mkdirSync)((0, import_path.dirname)(DATA_PATH), { recursive: true });
  if ((0, import_fs.existsSync)(DATA_PATH)) {
    try {
      cache = { ...emptyStore(), ...JSON.parse((0, import_fs.readFileSync)(DATA_PATH, "utf8")) };
      migrateProductImages(cache);
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
  persistentDirty = true;
}
function getStore() {
  return load();
}
function saveStore(next) {
  cache = next;
  persist();
}
function blobAuthOptions() {
  const token = process.env.MESAFLOW_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (token) return { token };
  const storeId = process.env.MESAFLOW_BLOB_STORE_ID || process.env.BLOB_STORE_ID;
  const oidcToken = runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN;
  return {
    ...storeId ? { storeId } : {},
    ...oidcToken ? { oidcToken } : {}
  };
}
function blobConfigured() {
  const auth = blobAuthOptions();
  return Boolean(auth.token || auth.storeId || auth.oidcToken);
}
function setPersistentStoreOidcToken(token) {
  runtimeOidcToken = token?.trim() || void 0;
}
async function hydratePersistentStore() {
  if (!process.env.VERCEL) {
    getStore();
    return;
  }
  (0, import_fs.mkdirSync)((0, import_path.dirname)(DATA_PATH), { recursive: true });
  if (blobConfigured()) {
    try {
      const listed = await (0, import_blob.list)({
        prefix: BLOB_PATHNAME,
        limit: 1,
        ...blobAuthOptions()
      });
      const blob = listed.blobs.find((candidate) => candidate.pathname === BLOB_PATHNAME);
      if (blob) {
        const response = await fetch(blob.url);
        if (!response.ok) throw new Error(`Blob read failed (${response.status})`);
        cache = {
          ...emptyStore(),
          ...await response.json()
        };
        (0, import_fs.writeFileSync)(DATA_PATH, JSON.stringify(cache, null, 2));
        persistentDirty = false;
        migrateProductImages(cache);
        return;
      }
    } catch (error) {
      console.warn("[mesaflow] blob hydrate failed", error);
    }
  }
  cache = null;
  getStore();
}
async function flushPersistentStore() {
  if (!process.env.VERCEL || !persistentDirty || !cache) return;
  if (!blobConfigured()) {
    throw new Error("MesaFlow Blob persistence is not configured.");
  }
  await (0, import_blob.put)(BLOB_PATHNAME, JSON.stringify(cache), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...blobAuthOptions()
  });
  persistentDirty = false;
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
function findUserByEmail(email) {
  const store = getStore();
  return Object.values(store.users).find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.active
  ) || null;
}
function purgeExpiredSessions(store) {
  const now = Date.now();
  for (const [token, session] of Object.entries(store.sessions)) {
    if (new Date(session.expiresAt).getTime() <= now) {
      delete store.sessions[token];
    }
  }
}
function createSession(user) {
  const store = getStore();
  purgeExpiredSessions(store);
  const now = /* @__PURE__ */ new Date();
  const session = {
    token: sessionToken(),
    userId: user.id,
    establishmentId: user.establishmentId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString()
  };
  store.sessions[session.token] = session;
  saveStore(store);
  return session;
}
function validateSession(token) {
  if (!token) return null;
  const store = getStore();
  purgeExpiredSessions(store);
  const session = store.sessions[token];
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    delete store.sessions[token];
    saveStore(store);
    return null;
  }
  const user = store.users[session.userId];
  const establishment = store.establishments[session.establishmentId];
  if (!user?.active || !establishment) return null;
  return { session, user, establishment };
}
function registerEstablishment(input) {
  const store = getStore();
  const email = input.email.toLowerCase().trim();
  if (!email || !input.password || input.password.length < 6) {
    return { error: "Preencha todos os campos. Senha com no m\xEDnimo 6 caracteres." };
  }
  if (findUserByEmail(email)) {
    return { error: "Este e-mail j\xE1 est\xE1 cadastrado." };
  }
  if (!input.businessName.trim() || !input.ownerName.trim()) {
    return { error: "Nome do neg\xF3cio e respons\xE1vel s\xE3o obrigat\xF3rios." };
  }
  const { establishment, user } = provisionEstablishment(store, {
    businessName: input.businessName.trim(),
    ownerName: input.ownerName.trim(),
    email,
    passwordHash: hashPassword(input.password),
    businessType: input.businessType,
    tableCount: input.tableCount
  });
  saveStore(store);
  const session = createSession(user);
  return { user, establishment, session };
}
function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return { error: "E-mail ou senha inv\xE1lidos." };
  }
  const store = getStore();
  const establishment = store.establishments[user.establishmentId];
  if (!establishment) return { error: "Estabelecimento n\xE3o encontrado." };
  const session = createSession(user);
  return { user, establishment, session };
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
function findTableByQr(establishmentId, tableToken) {
  const store = getStore();
  return Object.values(store.tables).find(
    (t) => t.establishmentId === establishmentId && t.qrToken === tableToken
  ) || null;
}
var PRODUCT_AVAILABILITIES = /* @__PURE__ */ new Set([
  "VITRINE",
  "SOB_DEMANDA",
  "AMBOS"
]);
var TABLE_STATUSES = /* @__PURE__ */ new Set([
  "LIVRE",
  "OCUPADA",
  "AGUARDANDO_PAGAMENTO",
  "RESERVADA",
  "INATIVA"
]);
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function invalid(error, status = 400) {
  return { error, status };
}
function validateProductFields(store, establishmentId, body, partial) {
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const fields = {};
  const required = ["categoryId", "sectorId", "name", "description", "price", "prepMinutes", "availability"];
  if (!partial && required.some((field) => body[field] === void 0)) {
    return invalid("Preencha os campos obrigat\xF3rios do produto.");
  }
  if (body.categoryId !== void 0) {
    if (typeof body.categoryId !== "string") return invalid("Categoria inv\xE1lida.");
    const category = store.categories[body.categoryId];
    if (!category || category.establishmentId !== establishmentId) {
      return invalid("Categoria n\xE3o pertence ao estabelecimento.");
    }
    fields.categoryId = body.categoryId;
  }
  if (body.sectorId !== void 0) {
    if (typeof body.sectorId !== "string") return invalid("Setor inv\xE1lido.");
    const sector = store.sectors[body.sectorId];
    if (!sector || sector.establishmentId !== establishmentId) {
      return invalid("Setor n\xE3o pertence ao estabelecimento.");
    }
    fields.sectorId = body.sectorId;
  }
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      return invalid("Nome deve ter entre 1 e 120 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.description !== void 0) {
    if (typeof body.description !== "string" || body.description.length > 1e3) {
      return invalid("Descri\xE7\xE3o deve ter no m\xE1ximo 1000 caracteres.");
    }
    fields.description = body.description.trim();
  }
  if (body.price !== void 0) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0 || body.price > 1e6) {
      return invalid("Pre\xE7o deve estar entre 0 e 1000000.");
    }
    fields.price = body.price;
  }
  if (body.image !== void 0) {
    if (body.image !== null && (typeof body.image !== "string" || body.image.length > 2048)) {
      return invalid("Imagem inv\xE1lida.");
    }
    fields.image = body.image === null || body.image === "" ? void 0 : body.image;
  }
  if (body.tags !== void 0) {
    if (!Array.isArray(body.tags) || body.tags.length > 20 || body.tags.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 50)) {
      return invalid("Tags inv\xE1lidas.");
    }
    fields.tags = body.tags.map((tag) => String(tag).trim());
  }
  if (body.prepMinutes !== void 0) {
    if (!Number.isInteger(body.prepMinutes) || Number(body.prepMinutes) < 0 || Number(body.prepMinutes) > 1440) {
      return invalid("Tempo de preparo deve ser inteiro entre 0 e 1440.");
    }
    fields.prepMinutes = Number(body.prepMinutes);
  }
  if (body.availability !== void 0) {
    if (typeof body.availability !== "string" || !PRODUCT_AVAILABILITIES.has(body.availability)) {
      return invalid("Disponibilidade inv\xE1lida.");
    }
    fields.availability = body.availability;
  }
  for (const field of ["featured", "active"]) {
    if (body[field] !== void 0) {
      if (typeof body[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      fields[field] = body[field];
    }
  }
  return { value: fields };
}
function listAdminProducts(establishmentId) {
  const store = getStore();
  return {
    categories: Object.values(store.categories).filter((item) => item.establishmentId === establishmentId).sort((a, b) => a.sortOrder - b.sortOrder),
    sectors: Object.values(store.sectors).filter(
      (item) => item.establishmentId === establishmentId
    ),
    products: Object.values(store.products).filter(
      (item) => item.establishmentId === establishmentId
    )
  };
}
function createAdminProduct(establishmentId, body) {
  const store = getStore();
  const parsed = validateProductFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const product = {
    id: id("p_"),
    establishmentId,
    categoryId: parsed.value.categoryId,
    sectorId: parsed.value.sectorId,
    name: parsed.value.name,
    description: parsed.value.description,
    price: parsed.value.price,
    image: parsed.value.image,
    tags: parsed.value.tags || [],
    prepMinutes: parsed.value.prepMinutes,
    availability: parsed.value.availability,
    featured: parsed.value.featured ?? false,
    active: parsed.value.active ?? true,
    variants: [],
    addons: [],
    rodizioIncluded: false
  };
  store.products[product.id] = product;
  saveStore(store);
  return { value: product };
}
function updateAdminProduct(establishmentId, productId, body) {
  const store = getStore();
  const product = store.products[productId];
  if (!product || product.establishmentId !== establishmentId) {
    return invalid("Produto n\xE3o encontrado.", 404);
  }
  const parsed = validateProductFields(store, establishmentId, body, true);
  if ("error" in parsed) return parsed;
  Object.assign(product, parsed.value);
  saveStore(store);
  return { value: product };
}
function deleteAdminProduct(establishmentId, productId) {
  const store = getStore();
  const product = store.products[productId];
  if (!product || product.establishmentId !== establishmentId) {
    return invalid("Produto n\xE3o encontrado.", 404);
  }
  product.active = false;
  saveStore(store);
  return { value: product };
}
function uniqueQrToken2(store) {
  let token = sessionToken();
  while (Object.values(store.tables).some((table) => table.qrToken === token)) {
    token = sessionToken();
  }
  return token;
}
function validateTableFields(store, establishmentId, body, partial, currentId) {
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const fields = {};
  if (!partial && ["number", "capacity"].some((field) => body[field] === void 0)) {
    return invalid("Preencha os campos obrigat\xF3rios da mesa.");
  }
  if (body.number !== void 0) {
    if (typeof body.number !== "string" || !body.number.trim() || body.number.trim().length > 20) {
      return invalid("N\xFAmero deve ter entre 1 e 20 caracteres.");
    }
    const number = body.number.trim();
    const duplicate = Object.values(store.tables).some(
      (table) => table.establishmentId === establishmentId && table.id !== currentId && table.number === number
    );
    if (duplicate) return invalid("J\xE1 existe uma mesa com este n\xFAmero.", 409);
    fields.number = number;
  }
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || body.name.trim().length > 80) {
      return invalid("Nome deve ter no m\xE1ximo 80 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.capacity !== void 0) {
    if (!Number.isInteger(body.capacity) || Number(body.capacity) < 1 || Number(body.capacity) > 100) {
      return invalid("Capacidade deve ser inteira entre 1 e 100.");
    }
    fields.capacity = Number(body.capacity);
  }
  if (body.status !== void 0) {
    if (typeof body.status !== "string" || !TABLE_STATUSES.has(body.status)) {
      return invalid("Status de mesa inv\xE1lido.");
    }
    fields.status = body.status;
  }
  return { value: fields };
}
function listAdminTables(establishmentId) {
  return Object.values(getStore().tables).filter(
    (table) => table.establishmentId === establishmentId
  );
}
function createAdminTable(establishmentId, body) {
  const store = getStore();
  const parsed = validateTableFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const table = {
    id: id("tbl_"),
    establishmentId,
    number: parsed.value.number,
    name: parsed.value.name || `Mesa ${parsed.value.number}`,
    capacity: parsed.value.capacity,
    status: parsed.value.status || "LIVRE",
    qrToken: uniqueQrToken2(store)
  };
  store.tables[table.id] = table;
  saveStore(store);
  return { value: table };
}
function updateAdminTable(establishmentId, tableId, body) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa n\xE3o encontrada.", 404);
  }
  const parsed = validateTableFields(store, establishmentId, body, true, tableId);
  if ("error" in parsed) return parsed;
  Object.assign(table, parsed.value);
  saveStore(store);
  return { value: table };
}
function deleteAdminTable(establishmentId, tableId) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa n\xE3o encontrada.", 404);
  }
  const blockingCommand = Object.values(store.commands).some(
    (command) => command.establishmentId === establishmentId && command.tableId === tableId && (command.status === "ABERTA" || command.status === "PAGAMENTO_SOLICITADO")
  );
  if (blockingCommand) {
    return invalid("Mesa possui comanda aberta ou aguardando pagamento.", 409);
  }
  delete store.tables[tableId];
  saveStore(store);
  return { value: { id: tableId } };
}
function regenerateAdminTableQr(establishmentId, tableId) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa n\xE3o encontrada.", 404);
  }
  table.qrToken = uniqueQrToken2(store);
  saveStore(store);
  return { value: table };
}
function getAdminSettings(establishmentId) {
  return getStore().establishments[establishmentId] || null;
}
function updateAdminSettings(establishmentId, body) {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return invalid("Estabelecimento n\xE3o encontrado.", 404);
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const next = {
    ...establishment,
    settings: { ...establishment.settings }
  };
  if (body.settings !== void 0 && !isRecord(body.settings)) {
    return invalid("Ajustes inv\xE1lidos.");
  }
  const settings = isRecord(body.settings) ? body.settings : body;
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      return invalid("Nome deve ter entre 1 e 120 caracteres.");
    }
    next.name = body.name.trim();
  }
  if (body.tagline !== void 0) {
    if (typeof body.tagline !== "string" || body.tagline.length > 240) {
      return invalid("Tagline deve ter no m\xE1ximo 240 caracteres.");
    }
    next.tagline = body.tagline.trim();
  }
  for (const field of ["open", "rodizioEnabled"]) {
    if (body[field] !== void 0) {
      if (typeof body[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      next[field] = body[field];
    }
  }
  if (settings.currency !== void 0) {
    if (typeof settings.currency !== "string" || !/^[A-Za-z]{3}$/.test(settings.currency)) {
      return invalid("Moeda deve usar c\xF3digo ISO de 3 letras.");
    }
    next.settings.currency = settings.currency.toUpperCase();
  }
  for (const field of ["allowEditAfterPrep", "soundNotifications"]) {
    if (settings[field] !== void 0) {
      if (typeof settings[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      next.settings[field] = settings[field];
    }
  }
  if (settings.minIntervalRodizioSec !== void 0) {
    if (!Number.isInteger(settings.minIntervalRodizioSec) || Number(settings.minIntervalRodizioSec) < 0 || Number(settings.minIntervalRodizioSec) > 86400) {
      return invalid("Intervalo do rod\xEDzio deve ser inteiro entre 0 e 86400.");
    }
    next.settings.minIntervalRodizioSec = Number(settings.minIntervalRodizioSec);
  }
  store.establishments[establishmentId] = next;
  saveStore(store);
  return { value: next };
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

// projects/iphone-imports/api/_mesaflow/handler.ts
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
async function json(res, status, body) {
  try {
    await flushPersistentStore();
  } catch (error) {
    console.error("[mesaflow] blob persist failed", error);
    status = 500;
    body = { error: "N\xE3o foi poss\xEDvel persistir a altera\xE7\xE3o." };
  }
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.send(JSON.stringify(body));
}
function readOidcHeader(req) {
  const value = req.headers["x-vercel-oidc-token"];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return void 0;
}
function adminAuth(req) {
  const authorization = req.headers.authorization;
  const match = typeof authorization === "string" && authorization.match(/^Bearer\s+(.+)$/i);
  return validateSession(match ? match[1].trim() : void 0);
}
async function handler(req, res) {
  setPersistentStoreOidcToken(readOidcHeader(req));
  if (req.method === "OPTIONS") return json(res, 204, {});
  try {
    await hydratePersistentStore();
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
      const result = loginUser(String(body.email), String(body.password));
      if (result.error) return json(res, 401, { error: result.error });
      return json(res, 200, {
        token: result.session.token,
        user: publicUser(result.user),
        establishment: result.establishment
      });
    }
    if (req.method === "POST" && path === "/auth/register") {
      const body = req.body || {};
      const result = registerEstablishment({
        businessName: String(body.businessName || ""),
        ownerName: String(body.ownerName || ""),
        email: String(body.email || ""),
        password: String(body.password || ""),
        businessType: body.businessType || "restaurante",
        tableCount: Number(body.tableCount) || 5
      });
      if (result.error) return json(res, 400, { error: result.error });
      return json(res, 201, {
        token: result.session.token,
        user: publicUser(result.user),
        establishment: result.establishment
      });
    }
    if (req.method === "GET" && path === "/auth/me") {
      const auth = validateSession(req.headers.authorization?.replace(/^Bearer\s+/i, ""));
      if (!auth) return json(res, 401, { error: "Sess\xE3o inv\xE1lida." });
      return json(res, 200, {
        user: publicUser(auth.user),
        establishment: auth.establishment
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
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const est = auth.establishment;
      const stats = dashboardStats(est.id);
      const orders = Object.values(store.orders).filter((o) => o.establishmentId === est.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id && s.active);
      const notifications = Object.values(store.notifications).filter((n) => n.establishmentId === est.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);
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
        products
      });
    }
    if (path === "/admin/settings") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "GET") {
        const establishment = getAdminSettings(auth.establishment.id);
        if (!establishment) {
          return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
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
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
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
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
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
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
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
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "POST") {
        const result = regenerateAdminTableQr(auth.establishment.id, regenerateQrMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
    }
    const adminTableMatch = path.match(/^\/admin\/tables\/([^/]+)$/);
    if (adminTableMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
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
