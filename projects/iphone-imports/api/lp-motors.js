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

// api/lp-motors.ts
var lp_motors_exports = {};
__export(lp_motors_exports, {
  default: () => handler
});
module.exports = __toCommonJS(lp_motors_exports);

// api/_lp-motors/store.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_crypto = require("node:crypto");
var import_blob = require("@vercel/blob");
var BLOB_PATHNAME = "lp-motors/store.json";
var FILE_PATH = process.env.VERCEL || process.env.VERCEL_ENV ? "/tmp/lp-motors-store.json" : "./data/lp-motors-store.json";
function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}
function blobAuthOptions() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return token ? { token } : {};
}
function emptyStore() {
  return {
    organizations: {},
    users: {},
    databases: {},
    tokens: {}
  };
}
function hashPassword(password) {
  return (0, import_node_crypto.createHash)("sha256").update(`lp-motors:${password}`).digest("hex");
}
function safeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return (0, import_node_crypto.timingSafeEqual)(ba, bb);
}
function slugifyStoreName(name) {
  const base = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  return base || "loja";
}
var RESERVED_SLUGS = /* @__PURE__ */ new Set([
  "lp-motors",
  "admin",
  "api",
  "login",
  "cadastro",
  "www",
  "app",
  "gestor"
]);
function isReservedSlug(slug) {
  return RESERVED_SLUGS.has(slug);
}
function issueToken() {
  return (0, import_node_crypto.randomBytes)(24).toString("hex");
}
var cached = null;
var JsonStore = class _JsonStore {
  store;
  dirty = false;
  constructor(store) {
    this.store = store;
  }
  static async open() {
    if (cached) return cached;
    (0, import_node_fs.mkdirSync)((0, import_node_path.dirname)(FILE_PATH), { recursive: true });
    let store = emptyStore();
    let hydratedFromBlob = false;
    if (blobConfigured()) {
      try {
        const listed = await (0, import_blob.list)({
          prefix: BLOB_PATHNAME,
          limit: 1,
          ...blobAuthOptions()
        });
        const blob = listed.blobs.find((b) => b.pathname === BLOB_PATHNAME);
        if (blob) {
          const res = await fetch(blob.url);
          if (res.ok) {
            store = { ...emptyStore(), ...await res.json() };
            hydratedFromBlob = true;
            try {
              (0, import_node_fs.writeFileSync)(FILE_PATH, JSON.stringify(store));
            } catch {
            }
          }
        }
      } catch (err) {
        console.warn("[lp-motors] blob hydrate failed", err);
      }
    }
    if (!hydratedFromBlob && (0, import_node_fs.existsSync)(FILE_PATH)) {
      try {
        const parsed = JSON.parse((0, import_node_fs.readFileSync)(FILE_PATH, "utf8"));
        store = { ...emptyStore(), ...parsed };
      } catch {
      }
    }
    cached = new _JsonStore(store);
    return cached;
  }
  data() {
    return this.store;
  }
  markDirty() {
    this.dirty = true;
  }
  async persist() {
    if (!this.dirty) return;
    (0, import_node_fs.writeFileSync)(FILE_PATH, JSON.stringify(this.store));
    if (blobConfigured()) {
      try {
        await (0, import_blob.put)(BLOB_PATHNAME, JSON.stringify(this.store), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "application/json",
          ...blobAuthOptions()
        });
      } catch (err) {
        console.warn("[lp-motors] blob persist failed", err);
      }
    }
    this.dirty = false;
  }
  findUserByUsername(username) {
    const key = username.toLowerCase();
    return Object.values(this.store.users).find((u) => u.username.toLowerCase() === key && u.active) || null;
  }
  findUsersByUsername(username) {
    const key = username.toLowerCase();
    return Object.values(this.store.users).filter(
      (u) => u.username.toLowerCase() === key && u.active
    );
  }
  findOrgBySlug(slug) {
    const key = slug.trim().toLowerCase();
    if (!key) return null;
    return Object.values(this.store.organizations).find((o) => o.slug === key) || null;
  }
  uniqueSlug(fromName) {
    let slug = slugifyStoreName(fromName);
    if (isReservedSlug(slug) || this.findOrgBySlug(slug)) {
      slug = `${slug}-${(0, import_node_crypto.randomBytes)(2).toString("hex")}`;
    }
    let n = 2;
    while (this.findOrgBySlug(slug) || isReservedSlug(slug)) {
      slug = `${slugifyStoreName(fromName)}-${n}`;
      n += 1;
    }
    return slug;
  }
  findUserForLogin(username, storeSlug) {
    const key = username.toLowerCase();
    if (storeSlug) {
      const org = this.findOrgBySlug(storeSlug);
      if (!org) return null;
      return Object.values(this.store.users).find(
        (u) => u.organizationId === org.id && u.username.toLowerCase() === key && u.active
      ) || null;
    }
    const matches = this.findUsersByUsername(username);
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    return matches;
  }
  toSession(user) {
    const org = this.store.organizations[user.organizationId];
    return {
      userId: user.id,
      username: user.username,
      nome: user.nome,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: org?.name,
      organizationSlug: org?.slug
    };
  }
  resolveToken(token) {
    const entry = this.store.tokens[token];
    if (!entry) return null;
    const user = this.store.users[entry.userId];
    if (!user || !user.active) return null;
    return this.toSession(user);
  }
};
async function getStore() {
  return JsonStore.open();
}

// api/_lp-motors/tenant.ts
function buildEmptyStoreDatabase(input) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const short = input.orgName.split(/\s+/).filter(Boolean).slice(0, 2).join(" ").slice(0, 24) || input.orgName.slice(0, 24);
  return {
    version: 7,
    organization: {
      id: input.orgId,
      name: input.orgName,
      slug: input.slug,
      createdAt: now
    },
    vehicles: [],
    sales: [],
    expenses: [],
    customers: [],
    users: [
      {
        id: input.userId,
        organizationId: input.orgId,
        username: input.username,
        password: input.password,
        nome: input.ownerName,
        role: "admin",
        active: true,
        createdAt: now
      }
    ],
    settings: [
      {
        id: "settings_default",
        organizationId: input.orgId,
        nomeEmpresa: input.orgName,
        nomeCurto: short,
        slogan: "Gest\xE3o profissional de estoque automotivo",
        logo: "",
        telefone: input.phone || "",
        whatsapp: input.phone || "",
        instagram: "",
        email: "",
        endereco: "",
        cidade: input.city || "",
        tema: "dark",
        modoEscuro: true,
        brand: {
          presetId: "lp",
          corPrimaria: "#0F766E",
          corSecundaria: "#C4A574",
          corFundo: "#0B1018",
          corSuperficie: "#121A26",
          corTexto: "#E8EEF6",
          corPainel: "#081018",
          aparencia: "premium",
          atmosfera: "showroom",
          intensidadeFoto: 42
        },
        org: {
          alertDaysWarn: 30,
          alertDaysAlert: 45,
          alertDaysCritical: 60,
          minMarginPercent: 8,
          brandConcentrationLimit: 20,
          lowStockDemandGap: 15,
          docExpiryWarnDays: 30
        },
        updatedAt: now
      }
    ],
    history: [],
    documents: [],
    checklists: [],
    priceHistory: [],
    statusHistory: [],
    suppliers: [],
    payables: [],
    auditLogs: [
      {
        id: `aud_${Date.now().toString(36)}`,
        organizationId: input.orgId,
        userId: input.userId,
        username: input.username,
        action: "org.register",
        entityType: "organization",
        entityId: input.orgId,
        detail: `Loja ${input.orgName} cadastrada`,
        createdAt: now
      }
    ]
  };
}

// api/_lp-motors/fipe.ts
var FIPE_BASE = "https://fipe.parallelum.com.br/api/v2";
async function fipeFetch(path) {
  const url = `${FIPE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const headers = { Accept: "application/json" };
    if (process.env.FIPE_API_TOKEN) {
      headers["X-Subscription-Token"] = process.env.FIPE_API_TOKEN;
    }
    const res = await fetch(url, { headers });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      data: { error: err instanceof Error ? err.message : "Falha ao consultar FIPE" }
    };
  }
}
function parseFipePrice(price) {
  if (!price) return 0;
  return Number(String(price).replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}
async function fipeDetailByCode(type, fipeCode, modelYear) {
  const code = encodeURIComponent(String(fipeCode).trim());
  const yearsRes = await fipeFetch(`/${type}/${code}/years`);
  if (!yearsRes.ok || !Array.isArray(yearsRes.data)) {
    return {
      ok: false,
      status: yearsRes.status || 404,
      data: yearsRes.data || {
        error: "N\xE3o foi poss\xEDvel listar anos para este c\xF3digo FIPE."
      }
    };
  }
  const years = yearsRes.data;
  if (!years.length) {
    return { ok: false, status: 404, data: { error: "C\xF3digo FIPE sem anos dispon\xEDveis." } };
  }
  let match = years[0];
  if (modelYear) {
    const y = String(modelYear);
    match = years.find((item) => String(item.code || "").startsWith(`${y}-`)) || years.find((item) => String(item.name || "").startsWith(y)) || years[0];
  }
  const yearId = String(match?.code || "");
  if (!yearId) {
    return { ok: false, status: 404, data: { error: "Ano FIPE n\xE3o encontrado para este c\xF3digo." } };
  }
  return fipeFetch(`/${type}/${code}/years/${encodeURIComponent(yearId)}`);
}
function normalizeTextSearchResults(raw) {
  const payload = raw && typeof raw === "object" ? raw : {};
  const results = (payload.results || []).map((hit) => {
    const valueLabel = String(hit.value_label || hit.price_label || hit.price || "");
    const price = typeof hit.price === "number" ? hit.price : parseFipePrice(valueLabel) || parseFipePrice(String(hit.price || ""));
    return {
      brand_name: String(hit.brand_name || hit.brand || ""),
      model_name: String(hit.model_name || hit.model || ""),
      model_year: Number(hit.model_year || hit.year || 0) || 0,
      codigo_fipe: String(hit.codigo_fipe || hit.code_fipe || hit.codeFipe || ""),
      fuel_name: hit.fuel_name ? String(hit.fuel_name) : void 0,
      price: price || void 0,
      value_label: valueLabel || void 0,
      reference_month: hit.reference_month ? String(hit.reference_month) : void 0,
      url_path: hit.url_path ? String(hit.url_path) : void 0
    };
  });
  return {
    query: payload.query,
    count: payload.count ?? results.length,
    results
  };
}
async function fipeTextSearch(q) {
  const url = `https://tabelafipe.info/api/busca?q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "LPMotorsGestor/1.0" }
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      data: { error: err instanceof Error ? err.message : "Falha na busca FIPE" }
    };
  }
}
function normalizePlate(raw) {
  return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}
function plateFormats(plate) {
  const p = normalizePlate(plate);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(p)) {
    const digitMap = {
      A: "0",
      B: "1",
      C: "2",
      D: "3",
      E: "4",
      F: "5",
      G: "6",
      H: "7",
      I: "8",
      J: "9"
    };
    const fourthLetter = p[4];
    const antiga = `${p.slice(0, 3)}${p[3]}${digitMap[fourthLetter] ?? p[4]}${p.slice(5)}`;
    return { mercosul: p, antiga, input: p };
  }
  if (/^[A-Z]{3}[0-9]{4}$/.test(p)) {
    const digit = p[4];
    const letter = letters[Number(digit)] || "A";
    const mercosul = `${p.slice(0, 3)}${p[3]}${letter}${p.slice(5)}`;
    return { mercosul, antiga: p, input: p };
  }
  return { mercosul: p, antiga: p, input: p };
}
async function lookupPlateExternal(plate) {
  const formats = plateFormats(plate);
  const normalized = formats.input;
  const template = process.env.LP_MOTORS_PLATE_API_URL || "";
  if (!template) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: "none",
      message: "Consulta autom\xE1tica por placa n\xE3o configurada. Use a sele\xE7\xE3o FIPE abaixo (marca \u2192 modelo \u2192 ano) \u2014 gratuita."
    };
  }
  const url = template.replace("{plate}", encodeURIComponent(normalized)).replace("{placa}", encodeURIComponent(normalized)).replace("{mercosul}", encodeURIComponent(formats.mercosul)).replace("{antiga}", encodeURIComponent(formats.antiga));
  try {
    const headers = { Accept: "application/json" };
    if (process.env.LP_MOTORS_PLATE_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.LP_MOTORS_PLATE_API_TOKEN}`;
    }
    const res = await fetch(url, { headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: "external",
        message: String(data.error || data.message || `Provedor de placa retornou ${res.status}`)
      };
    }
    const brand = String(data.brand || data.marca || data.Brand || "");
    const model = String(data.model || data.modelo || data.Model || "");
    const version = String(data.version || data.versao || data.Version || "");
    const fipeCode = String(data.fipeCode || data.codigoFipe || data.codigo_fipe || "");
    const modelYear = Number(data.modelYear || data.anoModelo || data.ano_modelo || data.ano || 0) || void 0;
    const manufactureYear = Number(data.manufactureYear || data.anoFabricacao || data.ano_fabricacao || 0) || void 0;
    if (!brand && !model && !fipeCode) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: "external",
        message: "Provedor n\xE3o retornou marca/modelo/c\xF3digo FIPE para esta placa."
      };
    }
    return {
      ok: true,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: "external",
      vehicle: {
        brand,
        model,
        version,
        fipeCode: fipeCode || void 0,
        modelYear,
        manufactureYear,
        fuel: String(data.fuel || data.combustivel || "") || void 0,
        city: String(data.city || data.municipio || "") || void 0,
        state: String(data.state || data.uf || "") || void 0
      }
    };
  } catch (err) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: "external",
      message: err instanceof Error ? err.message : "Falha na consulta de placa"
    };
  }
}
var DEFAULT_IPVA_RATES = {
  AC: 0.02,
  AL: 0.03,
  AM: 0.03,
  AP: 0.03,
  BA: 0.025,
  CE: 0.03,
  DF: 0.03,
  ES: 0.02,
  GO: 0.0375,
  MA: 0.025,
  MG: 0.04,
  MS: 0.03,
  MT: 0.03,
  PA: 0.025,
  PB: 0.025,
  PE: 0.03,
  PI: 0.025,
  PR: 0.035,
  RJ: 0.04,
  RN: 0.03,
  RO: 0.03,
  RR: 0.03,
  RS: 0.03,
  SC: 0.02,
  SE: 0.025,
  SP: 0.04,
  TO: 0.02
};
function estimateIpva(fipeValue, uf = "SP") {
  const rate = DEFAULT_IPVA_RATES[uf.toUpperCase()] ?? 0.03;
  const value = Math.round(fipeValue * rate * 100) / 100;
  return { uf: uf.toUpperCase(), rate, aliquotPercent: rate * 100, value, base: fipeValue };
}

// api/_lp-motors/catalog.ts
var FUEL_LABELS = {
  flex: "Flex",
  gasolina: "Gasolina",
  etanol: "Etanol",
  diesel: "Diesel",
  eletrico: "El\xE9trico",
  hibrido: "H\xEDbrido",
  gnv: "GNV"
};
var TRANSMISSION_LABELS = {
  manual: "Manual",
  automatico: "Autom\xE1tico",
  cvt: "CVT",
  automatizado: "Automatizado"
};
var SITE_VISIBLE_STATUSES = /* @__PURE__ */ new Set(["pronto", "anunciado", "disponivel"]);
function normalizeStatus(status) {
  switch (status) {
    case "disponivel":
      return "pronto";
    case "oficina":
      return "preparacao";
    case "consignado":
    case "financiado":
      return "anunciado";
    default:
      return status;
  }
}
function isSiteVisibleVehicle(vehicle2) {
  if (vehicle2.archived || vehicle2.draft) return false;
  const normalized = normalizeStatus(vehicle2.status);
  if (normalized === "pronto" || normalized === "anunciado") return true;
  return SITE_VISIBLE_STATUSES.has(vehicle2.status);
}
function slugify(parts) {
  return parts.join("-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function vehicleTitle(v) {
  const parts = [v.marca, v.modelo, v.versao, String(v.anoModelo || v.ano)].filter(Boolean);
  return parts.join(" ").trim() || v.codigoInterno;
}
function pickImages(v) {
  const fotos = (v.fotos || []).filter((f) => typeof f === "string" && f.length > 0);
  if (fotos.length === 0) return [];
  const idx = Math.min(Math.max(0, v.fotoPrincipal ?? 0), fotos.length - 1);
  const primary = fotos[idx];
  const rest = fotos.filter((_, i) => i !== idx);
  return [primary, ...rest];
}
function toPublicVehicle(v) {
  const images = pickImages(v);
  const title = vehicleTitle(v);
  const fuel = FUEL_LABELS[v.combustivel] || v.combustivel || "";
  const transmission = TRANSMISSION_LABELS[v.cambio] || v.cambio || "";
  return {
    id: v.id,
    slug: slugify([v.marca, v.modelo, String(v.anoModelo || v.ano), v.id.slice(-6)]),
    title,
    brand: v.marca,
    model: v.modelo,
    version: v.versao || "",
    year: v.anoModelo || v.ano,
    price: v.precoAnunciado || 0,
    transmission,
    fuel,
    mileage: v.quilometragem || 0,
    color: v.cor || "",
    city: v.cidade || "",
    state: v.estado || "",
    images,
    image: images[0] || "",
    highlights: [transmission, fuel, v.cor].filter(Boolean),
    description: v.observacoes || `${title} dispon\xEDvel na loja.`,
    internalCode: v.codigoInterno
  };
}
function readSettings(db) {
  const row = db.settings?.[0];
  return row || {};
}
function buildPublicCatalog(db, orgSlug) {
  const settings = readSettings(db);
  const storeName = settings.nomeEmpresa || db.organization?.name || "LP Motors";
  const vehicles = (db.vehicles || []).filter(isSiteVisibleVehicle).filter((v) => (v.precoAnunciado || 0) > 0 || pickImages(v).length > 0).map(toPublicVehicle).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, "pt-BR"));
  const whatsappRaw = String(settings.whatsapp || settings.telefone || "").replace(/\D/g, "");
  return {
    storeName,
    storeSlug: orgSlug,
    whatsapp: whatsappRaw,
    phone: settings.telefone || "",
    instagram: settings.instagram || "",
    address: settings.endereco || "",
    city: settings.cidade || "",
    vehicles,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function getPublicVehicleById(db, orgSlug, vehicleId) {
  const catalog = buildPublicCatalog(db, orgSlug);
  return catalog.vehicles.find((v) => v.id === vehicleId || v.slug === vehicleId) || null;
}

// api/_lp-motors/pucci-vehicle-images.ts
var PUCCI_VEHICLE_IMAGES = {
  pucci_001: "https://cdn.imagin.studio/getImage?customer=img&make=porsche&modelFamily=911&modelYear=2022&paintId=grey&angle=23&zoomType=fullscreen",
  pucci_002: "https://cdn.imagin.studio/getImage?customer=img&make=porsche&modelFamily=cayenne&modelYear=2021&paintId=white&angle=23&zoomType=fullscreen",
  pucci_003: "https://cdn.imagin.studio/getImage?customer=img&make=bmw&modelFamily=m4&modelYear=2023&paintId=blue&angle=23&zoomType=fullscreen",
  pucci_004: "https://cdn.imagin.studio/getImage?customer=img&make=bmw&modelFamily=x5&modelYear=2022&paintId=black&angle=23&zoomType=fullscreen",
  pucci_005: "https://cdn.imagin.studio/getImage?customer=img&make=mercedes-benz&modelFamily=amg%20gt&modelYear=2021&paintId=silver&angle=23&zoomType=fullscreen",
  pucci_006: "https://cdn.imagin.studio/getImage?customer=img&make=mercedes-benz&modelFamily=gle&modelYear=2023&paintId=black&angle=23&zoomType=fullscreen",
  pucci_007: "https://cdn.imagin.studio/getImage?customer=img&make=ferrari&modelFamily=roma&modelYear=2021&paintId=red&angle=23&zoomType=fullscreen",
  pucci_008: "https://cdn.imagin.studio/getImage?customer=img&make=aston%20martin&modelFamily=db11&modelYear=2020&paintId=green&angle=23&zoomType=fullscreen",
  pucci_009: "https://cdn.imagin.studio/getImage?customer=img&make=lamborghini&modelFamily=huracan&modelYear=2022&paintId=yellow&angle=23&zoomType=fullscreen",
  pucci_010: "https://cdn.imagin.studio/getImage?customer=img&make=audi&modelFamily=r8&modelYear=2021&paintId=black&angle=23&zoomType=fullscreen",
  pucci_011: "https://cdn.imagin.studio/getImage?customer=img&make=mclaren&modelFamily=570s&modelYear=2019&paintId=orange&angle=23&zoomType=fullscreen",
  pucci_012: "https://cdn.imagin.studio/getImage?customer=img&make=bentley&modelFamily=continental&modelYear=2022&paintId=white&angle=23&zoomType=fullscreen",
  pucci_013: "https://cdn.imagin.studio/getImage?customer=img&make=maserati&modelFamily=granturismo&modelYear=2024&paintId=blue&angle=23&zoomType=fullscreen",
  pucci_014: "https://cdn.imagin.studio/getImage?customer=img&make=rolls-royce&modelFamily=ghost&modelYear=2020&paintId=black&angle=23&zoomType=fullscreen",
  pucci_015: "https://cdn.imagin.studio/getImage?customer=img&make=lexus&modelFamily=lc&modelYear=2022&paintId=red&angle=23&zoomType=fullscreen",
  pucci_016: "https://cdn.imagin.studio/getImage?customer=img&make=jaguar&modelFamily=f-type&modelYear=2021&paintId=white&angle=23&zoomType=fullscreen",
  pucci_017: "https://cdn.imagin.studio/getImage?customer=img&make=land%20rover&modelFamily=range%20rover%20sport&modelYear=2022&paintId=green&angle=23&zoomType=fullscreen",
  pucci_018: "https://cdn.imagin.studio/getImage?customer=img&make=volvo&modelFamily=xc90&modelYear=2023&paintId=grey&angle=23&zoomType=fullscreen"
};
function pucciVehicleImage(id) {
  return PUCCI_VEHICLE_IMAGES[id] || PUCCI_VEHICLE_IMAGES.pucci_001;
}

// api/_lp-motors/pucci-demo.ts
var ORG_ID = "org_pucci_motors";
var USER_ID = "user_pucci_admin";
var DEMO_SLUG = "pucci-motors";
function daysAgo(n) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAgo(n) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function vehicle(id, marca, modelo, versao, ano, preco, status, extras = {}) {
  const img = pucciVehicleImage(id);
  return {
    id,
    organizationId: ORG_ID,
    codigoInterno: `PUC-${id.slice(-4).toUpperCase()}`,
    marca,
    modelo,
    versao,
    ano,
    anoModelo: ano,
    categoria: extras.categoria || "Esportivo",
    cor: extras.cor || "Preto",
    placa: extras.placa || "",
    renavam: "",
    chassi: "",
    motor: extras.motor || "",
    portas: 2,
    combustivel: extras.combustivel || "gasolina",
    cambio: extras.cambio || "automatico",
    quilometragem: extras.quilometragem ?? 12e3,
    cidade: "Cap\xE3o Bonito",
    estado: "SP",
    fornecedor: "",
    telefoneFornecedor: "",
    origem: "Particular",
    cpfCnpjOrigem: "",
    localCompra: "",
    formaPagamentoCompra: "",
    entradaCompra: 0,
    financiamentoCompra: 0,
    observacoesCompra: "",
    precoFipe: Math.round(preco * 0.92),
    valorCompra: Math.round(preco * 0.82),
    precoAnunciado: preco,
    precoMinimo: Math.round(preco * 0.94),
    observacoes: extras.observacoes || `${marca} ${modelo} ${versao} \u2014 unidade inspecionada Pucci Motors.`,
    dataCompra: daysAgo(30),
    fotos: [img],
    fotoPrincipal: 0,
    status,
    consignado: false,
    archived: false,
    draft: false,
    vendedorResponsavel: "Administrador",
    createdAt: isoDaysAgo(30),
    updatedAt: isoDaysAgo(2),
    ...extras
  };
}
function buildPucciDemoVehicles() {
  return [
    vehicle("pucci_001", "Porsche", "911", "Carrera S 3.0", 2022, 899e3, "pronto", {
      categoria: "Esportivo",
      cor: "Cinza GT",
      motor: "3.0 biturbo",
      quilometragem: 8400
    }),
    vehicle("pucci_002", "Porsche", "Cayenne", "Turbo GT", 2021, 1249e3, "anunciado", {
      categoria: "SUV",
      cor: "Branco Carrara",
      motor: "4.0 V8",
      quilometragem: 22e3
    }),
    vehicle("pucci_003", "BMW", "M4", "Competition", 2023, 689e3, "pronto", {
      categoria: "Esportivo",
      cor: "Azul Portim\xE3o",
      motor: "3.0 biturbo",
      quilometragem: 5100
    }),
    vehicle("pucci_004", "BMW", "X5", "M50i xDrive", 2022, 549e3, "anunciado", {
      categoria: "SUV",
      cor: "Preto",
      motor: "4.4 V8",
      quilometragem: 28e3
    }),
    vehicle("pucci_005", "Mercedes-AMG", "GT", "63 S 4MATIC+", 2021, 998e3, "pronto", {
      categoria: "Esportivo",
      cor: "Prata Selenite",
      motor: "4.0 V8 biturbo",
      quilometragem: 15e3
    }),
    vehicle("pucci_006", "Mercedes-Benz", "GLE", "450 4MATIC", 2023, 589e3, "anunciado", {
      categoria: "SUV",
      cor: "Preto Obsidiana",
      motor: "3.0 inline-6",
      quilometragem: 12e3
    }),
    vehicle("pucci_007", "Ferrari", "Roma", "3.9 V8", 2021, 189e4, "pronto", {
      categoria: "Esportivo",
      cor: "Vermelho Rosso",
      motor: "3.9 V8",
      quilometragem: 6200
    }),
    vehicle("pucci_008", "Aston Martin", "DB11", "V8 AMR", 2020, 129e4, "anunciado", {
      categoria: "Esportivo",
      cor: "Verde British",
      motor: "4.0 V8",
      quilometragem: 18500
    }),
    vehicle("pucci_009", "Lamborghini", "Hurac\xE1n", "EVO RWD", 2022, 249e4, "pronto", {
      categoria: "Esportivo",
      cor: "Amarelo Giallo",
      motor: "5.2 V10",
      quilometragem: 4800
    }),
    vehicle("pucci_010", "Audi", "R8", "V10 Performance", 2021, 119e4, "anunciado", {
      categoria: "Esportivo",
      cor: "Preto Mythos",
      motor: "5.2 V10",
      quilometragem: 9100
    }),
    vehicle("pucci_011", "McLaren", "570S", "Coupe", 2019, 109e4, "pronto", {
      categoria: "Esportivo",
      cor: "Laranja McLaren",
      motor: "3.8 V8 biturbo",
      quilometragem: 24e3
    }),
    vehicle("pucci_012", "Bentley", "Continental GT", "V8", 2022, 159e4, "anunciado", {
      categoria: "Luxo",
      cor: "Branco Glacier",
      motor: "4.0 V8",
      quilometragem: 7e3
    }),
    vehicle("pucci_013", "Maserati", "GranTurismo", "Trofeo", 2024, 899e3, "pronto", {
      categoria: "Esportivo",
      cor: "Azul Emozione",
      motor: "3.0 V6 Nettuno",
      quilometragem: 2100
    }),
    vehicle("pucci_014", "Rolls-Royce", "Ghost", "Black Badge", 2020, 289e4, "pronto", {
      categoria: "Luxo",
      cor: "Preto Diamond",
      motor: "6.75 V12",
      quilometragem: 16e3
    }),
    vehicle("pucci_015", "Lexus", "LC", "500 Inspiration", 2022, 649e3, "anunciado", {
      categoria: "Esportivo",
      cor: "Vermelho Infrared",
      motor: "5.0 V8",
      quilometragem: 11e3
    }),
    vehicle("pucci_016", "Jaguar", "F-Type", "R AWD", 2021, 489e3, "preparacao", {
      categoria: "Esportivo",
      cor: "Branco Fuji",
      motor: "5.0 V8",
      quilometragem: 19e3,
      observacoes: "Em detalhamento est\xE9tico \u2014 n\xE3o publicado no site ainda."
    }),
    vehicle("pucci_017", "Land Rover", "Range Rover Sport", "SVR", 2022, 799e3, "preparacao", {
      categoria: "SUV",
      cor: "Verde Santorini",
      motor: "5.0 V8 SC",
      quilometragem: 25e3,
      observacoes: "Revis\xE3o mec\xE2nica em andamento."
    }),
    vehicle("pucci_018", "Volvo", "XC90", "Recharge T8", 2023, 429e3, "negociacao", {
      categoria: "SUV",
      cor: "Cinza Thunder",
      combustivel: "hibrido",
      motor: "2.0 plug-in hybrid",
      quilometragem: 14e3,
      observacoes: "Em negocia\xE7\xE3o de compra \u2014 ainda n\xE3o no site."
    })
  ];
}
function buildPucciDemoDatabase() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    version: 7,
    organization: {
      id: ORG_ID,
      name: "Pucci Motors",
      slug: DEMO_SLUG,
      createdAt: now
    },
    vehicles: buildPucciDemoVehicles(),
    sales: [],
    expenses: [],
    customers: [],
    users: [
      {
        id: USER_ID,
        organizationId: ORG_ID,
        username: "admin",
        password: "PucciMotors123",
        nome: "Administrador Pucci",
        role: "admin",
        active: true,
        createdAt: now
      }
    ],
    settings: [
      {
        id: "settings_pucci",
        organizationId: ORG_ID,
        nomeEmpresa: "Pucci Motors",
        nomeCurto: "Pucci",
        slogan: "Seminovos premium com transpar\xEAncia",
        logo: "",
        telefone: "(15) 3542-0000",
        whatsapp: "5515996532750",
        instagram: "@puccimotors",
        email: "contato@puccimotors.com.br",
        endereco: "Av. Principal, 1000 \u2014 Centro",
        cidade: "Cap\xE3o Bonito, SP",
        tema: "dark",
        modoEscuro: true,
        brand: {
          presetId: "lp",
          corPrimaria: "#C4A574",
          corSecundaria: "#0F766E",
          corFundo: "#0B1018",
          corSuperficie: "#121A26",
          corTexto: "#E8EEF6",
          corPainel: "#081018",
          aparencia: "premium",
          atmosfera: "showroom",
          intensidadeFoto: 42
        },
        org: {
          alertDaysWarn: 30,
          alertDaysAlert: 45,
          alertDaysCritical: 60,
          minMarginPercent: 8,
          brandConcentrationLimit: 20,
          lowStockDemandGap: 15,
          docExpiryWarnDays: 30
        },
        updatedAt: now
      }
    ],
    history: [],
    documents: [],
    checklists: [],
    priceHistory: [],
    statusHistory: [],
    suppliers: [],
    payables: [],
    auditLogs: []
  };
}
async function refreshPucciDemoVehicleImages(store) {
  const org = store.findOrgBySlug(DEMO_SLUG);
  if (!org) return 0;
  const rec = store.data().databases[org.id];
  const db = rec?.data;
  if (!db?.vehicles?.length) return 0;
  const seedById = new Map(buildPucciDemoVehicles().map((v) => [v.id, v]));
  let updated = 0;
  for (const vehicle2 of db.vehicles) {
    const seed = seedById.get(vehicle2.id);
    if (!seed) continue;
    const nextUrl = seed.fotos[0] || "";
    if (!nextUrl || vehicle2.fotos[0] === nextUrl) continue;
    vehicle2.fotos = [...seed.fotos];
    vehicle2.fotoPrincipal = seed.fotoPrincipal;
    updated++;
  }
  if (updated > 0) {
    store.markDirty();
    await store.persist();
  }
  return updated;
}
function upsertPucciDemoUser(store, orgId) {
  store.data().users[USER_ID] = {
    id: USER_ID,
    organizationId: orgId,
    username: "admin",
    passwordHash: hashPassword("PucciMotors123"),
    nome: "Administrador Pucci",
    role: "admin",
    active: true
  };
}
async function ensurePucciMotorsDemo(store) {
  const existing = store.findOrgBySlug(DEMO_SLUG);
  const rec = existing ? store.data().databases[existing.id] : null;
  const vehicles = rec?.data?.vehicles || [];
  const cloudUser = store.data().users[USER_ID];
  if (existing && vehicles.length > 0 && cloudUser) return false;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const org = existing || {
    id: ORG_ID,
    name: "Pucci Motors",
    slug: DEMO_SLUG,
    createdAt: now
  };
  store.data().organizations[org.id] = org;
  upsertPucciDemoUser(store, org.id);
  if (!existing || vehicles.length === 0) {
    store.data().databases[org.id] = {
      version: 1,
      updatedAt: now,
      data: buildPucciDemoDatabase()
    };
  }
  store.markDirty();
  await store.persist();
  return true;
}
var PUCCI_DEMO_CREDENTIALS = {
  store: DEMO_SLUG,
  username: "admin",
  password: "PucciMotors123"
};

// api/lp-motors.ts
function resolvePath(req) {
  const q = req.query?.path;
  if (Array.isArray(q) && q.length > 0) return "/" + q.map(String).join("/");
  if (typeof q === "string" && q.length > 0) return "/" + q.replace(/^\/+/, "");
  const originalUrl = req.url || "/";
  const qIndex = originalUrl.indexOf("?");
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
  const stripped = pathname.replace(/^\/api\/lp-motors\/?/, "/") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}
function readBearer(req) {
  const h = req.headers.authorization;
  if (!h || typeof h !== "string") return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}
function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  res.send(JSON.stringify(body));
}
async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return json(res, 204, {});
  }
  try {
    const store = await getStore();
    const path = resolvePath(req);
    if (req.method === "GET" && (path === "/health" || path === "/")) {
      return json(res, 200, {
        ok: true,
        service: "lp-motors",
        blob: blobConfigured(),
        blobAuth: process.env.BLOB_READ_WRITE_TOKEN ? "token" : process.env.BLOB_STORE_ID ? "oidc" : "none",
        plateApi: Boolean(process.env.LP_MOTORS_PLATE_API_URL),
        fipe: true,
        orgs: Object.keys(store.data().organizations).length
      });
    }
    if (req.method === "GET" && path === "/fipe/references") {
      const r = await fipeFetch("/references");
      return json(res, r.status, r.data);
    }
    if (req.method === "GET" && path === "/fipe/search") {
      const q = String(req.query?.q || "").trim();
      if (q.length < 2) return json(res, 400, { error: "Informe pelo menos 2 caracteres." });
      const r = await fipeTextSearch(q);
      if (!r.ok) return json(res, r.status, r.data);
      return json(res, 200, normalizeTextSearchResults(r.data));
    }
    {
      const codeMatch = path.match(/^\/fipe\/(cars|motorcycles|trucks)\/code\/([^/]+)\/?$/);
      if (req.method === "GET" && codeMatch) {
        const type = codeMatch[1];
        const code = decodeURIComponent(codeMatch[2]);
        const year = Number(req.query?.year || 0) || void 0;
        const r = await fipeDetailByCode(type, code, year);
        return json(res, r.status, r.data);
      }
    }
    if (req.method === "GET" && path.startsWith("/fipe/")) {
      const parts = path.split("/").filter(Boolean);
      if (parts[0] !== "fipe" || parts.length < 2) {
        return json(res, 400, { error: "Rota FIPE inv\xE1lida" });
      }
      const rest = "/" + parts.slice(1).join("/");
      const legacyCode = rest.match(/^\/(cars|motorcycles|trucks)\/fipe-code\/([^/]+)(?:\/years(?:\/([^/]+))?)?$/);
      if (legacyCode) {
        const type = legacyCode[1];
        const code = decodeURIComponent(legacyCode[2]);
        const yearHint = legacyCode[3] ? Number(String(legacyCode[3]).split("-")[0]) : void 0;
        const r2 = await fipeDetailByCode(type, code, yearHint);
        return json(res, r2.status, r2.data);
      }
      const safe = rest === "/references" || /^\/(cars|motorcycles|trucks)\/brands$/.test(rest) || /^\/(cars|motorcycles|trucks)\/brands\/\d+\/models$/.test(rest) || /^\/(cars|motorcycles|trucks)\/brands\/\d+\/models\/\d+\/years$/.test(rest) || /^\/(cars|motorcycles|trucks)\/brands\/\d+\/models\/\d+\/years\/[^/]+$/.test(rest) || /^\/(cars|motorcycles|trucks)\/(?!brands(?:\/|$))[^/]+\/years$/.test(rest) || /^\/(cars|motorcycles|trucks)\/(?!brands(?:\/|$))[^/]+\/years\/[^/]+$/.test(rest);
      if (!safe) return json(res, 400, { error: "Caminho FIPE n\xE3o permitido", path: rest });
      const r = await fipeFetch(rest);
      return json(res, r.status, r.data);
    }
    if (req.method === "GET" && path.startsWith("/placa/")) {
      const plate = normalizePlate(decodeURIComponent(path.replace(/^\/placa\//, "")));
      if (plate.length < 7) {
        return json(res, 400, { error: "Informe a placa completa (7 caracteres)." });
      }
      const formats = plateFormats(plate);
      const external = await lookupPlateExternal(plate);
      let fipe = null;
      let ipva = null;
      const uf = String(req.query?.uf || "SP");
      if (external.ok && external.vehicle?.fipeCode) {
        const type = String(req.query?.type || "cars") || "cars";
        const detail = await fipeDetailByCode(
          type,
          external.vehicle.fipeCode,
          external.vehicle.modelYear
        );
        if (detail.ok) {
          fipe = detail.data;
          const priceRaw = detail.data?.price || "";
          const price = Number(String(priceRaw).replace(/[^\d,]/g, "").replace(",", ".")) || 0;
          if (price > 0) ipva = estimateIpva(price, uf);
        }
      }
      return json(res, 200, {
        ...external,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        fipe,
        ipva,
        plateConfigured: Boolean(process.env.LP_MOTORS_PLATE_API_URL)
      });
    }
    if (req.method === "POST" && path === "/fipe/ipva") {
      const body = req.body || {};
      const value = Number(body.value || 0);
      if (!value) return json(res, 400, { error: "Informe o valor FIPE." });
      return json(res, 200, estimateIpva(value, body.uf || "SP"));
    }
    if (req.method === "POST" && path === "/init/pucci-motors") {
      const seeded = await ensurePucciMotorsDemo(store);
      const imagesUpdated = await refreshPucciDemoVehicleImages(store);
      return json(res, 200, {
        ok: true,
        seeded,
        imagesUpdated,
        credentials: PUCCI_DEMO_CREDENTIALS,
        catalog: `/api/lp-motors/catalog/${PUCCI_DEMO_CREDENTIALS.store}`
      });
    }
    if (req.method === "GET" && path.startsWith("/catalog/")) {
      const slug = decodeURIComponent(path.replace(/^\/catalog\//, "").replace(/\/$/, ""));
      if (slug === "pucci-motors") {
        await ensurePucciMotorsDemo(store);
        await refreshPucciDemoVehicleImages(store);
      }
      const org = store.findOrgBySlug(slug);
      if (!org) return json(res, 404, { error: "Loja n\xE3o encontrada." });
      const rec = store.data().databases[org.id];
      if (!rec?.data) return json(res, 404, { error: "Cat\xE1logo n\xE3o configurado." });
      const catalog = buildPublicCatalog(rec.data, org.slug);
      return json(res, 200, catalog);
    }
    if (req.method === "GET" && path.startsWith("/vehicle/")) {
      const parts = path.replace(/^\/vehicle\//, "").split("/");
      const vehicleId = decodeURIComponent(parts[0] || "");
      const storeSlug = decodeURIComponent(parts[1] || vehicleId);
      const org = store.findOrgBySlug(storeSlug);
      if (!org) return json(res, 404, { error: "Loja n\xE3o encontrada." });
      const rec = store.data().databases[org.id];
      if (!rec?.data) return json(res, 404, { error: "Ve\xEDculo n\xE3o encontrado." });
      const vehicle2 = getPublicVehicleById(rec.data, org.slug, vehicleId);
      if (!vehicle2) return json(res, 404, { error: "Ve\xEDculo n\xE3o encontrado." });
      return json(res, 200, vehicle2);
    }
    if (req.method === "POST" && path === "/auth/register") {
      if (!blobConfigured()) {
        return json(res, 503, {
          error: "Nuvem ainda n\xE3o est\xE1 ativa. Tente em alguns minutos."
        });
      }
      const body = req.body || {};
      const storeName = String(body.storeName || "").trim();
      const ownerName = String(body.ownerName || "").trim();
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      const city = String(body.city || "").trim();
      const phone = String(body.phone || "").trim();
      if (storeName.length < 2) return json(res, 400, { error: "Informe o nome da loja." });
      if (ownerName.length < 2) return json(res, 400, { error: "Informe o seu nome." });
      if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
        return json(res, 400, {
          error: "Usu\xE1rio: 3\u201332 caracteres (letras, n\xFAmeros, ponto, _ ou -)."
        });
      }
      if (password.length < 6) return json(res, 400, { error: "Senha com pelo menos 6 caracteres." });
      const slug = store.uniqueSlug(storeName);
      const orgId = `org_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const userId = `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const org = {
        id: orgId,
        name: storeName,
        slug,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      store.data().organizations[orgId] = org;
      store.data().users[userId] = {
        id: userId,
        organizationId: orgId,
        username,
        passwordHash: hashPassword(password),
        nome: ownerName,
        role: "admin",
        active: true
      };
      const database = buildEmptyStoreDatabase({
        orgId,
        orgName: storeName,
        slug,
        userId,
        username,
        password,
        ownerName,
        city,
        phone
      });
      store.data().databases[orgId] = {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        data: database
      };
      const token2 = issueToken();
      store.data().tokens[token2] = {
        organizationId: orgId,
        userId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      store.markDirty();
      await store.persist();
      const session2 = store.toSession(store.data().users[userId]);
      return json(res, 201, { token: token2, session: session2, database, version: 1, slug });
    }
    if (req.method === "POST" && path === "/auth/login") {
      const body = req.body || {};
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const storeSlug = String(body.store || "").trim();
      if (!username || !password) {
        return json(res, 400, { error: "Informe usu\xE1rio e senha." });
      }
      if (!storeSlug || storeSlug === PUCCI_DEMO_CREDENTIALS.store) {
        await ensurePucciMotorsDemo(store);
      }
      const found = store.findUserForLogin(username, storeSlug);
      if (Array.isArray(found)) {
        const options = found.map((u) => {
          const org = store.data().organizations[u.organizationId];
          return { slug: org?.slug || "", name: org?.name || "Loja" };
        });
        return json(res, 409, {
          error: "V\xE1rias lojas usam este login. Informe o c\xF3digo da loja.",
          stores: options
        });
      }
      const user = found;
      if (!user || !safeEqual(user.passwordHash, hashPassword(password))) {
        return json(res, 401, { error: "Usu\xE1rio, senha ou loja inv\xE1lidos." });
      }
      const token2 = issueToken();
      store.data().tokens[token2] = {
        organizationId: user.organizationId,
        userId: user.id,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      store.markDirty();
      await store.persist();
      const dbRec = store.data().databases[user.organizationId];
      return json(res, 200, {
        token: token2,
        session: store.toSession(user),
        database: dbRec?.data || null,
        version: dbRec?.version || 0
      });
    }
    if (req.method === "POST" && path === "/auth/bootstrap") {
      const body = req.body || {};
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!username || !password || !body.database) {
        return json(res, 400, { error: "Dados insuficientes para sincronizar." });
      }
      let existing = store.findUserByUsername(username);
      let orgId = body.session?.organizationId || body.database.organization?.id || `org_${Date.now().toString(36)}`;
      if (!existing) {
        const orgName = body.database.organization?.name || body.database.settings?.[0]?.nomeEmpresa || "LP Motors";
        const org = {
          id: orgId,
          name: orgName,
          slug: (body.database.organization?.slug || "lp-motors").toLowerCase(),
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        store.data().organizations[orgId] = org;
        for (const u of body.database.users || []) {
          const cloudUser = {
            id: u.id,
            organizationId: orgId,
            username: u.username,
            passwordHash: hashPassword(u.password),
            nome: u.nome,
            role: u.role || "vendedor",
            active: u.active !== false
          };
          store.data().users[u.id] = cloudUser;
        }
        if (!store.findUserByUsername(username)) {
          const id = body.session?.userId || `user_${Date.now().toString(36)}`;
          store.data().users[id] = {
            id,
            organizationId: orgId,
            username,
            passwordHash: hashPassword(password),
            nome: body.session?.nome || username,
            role: body.session?.role || "admin",
            active: true
          };
          existing = store.data().users[id];
        } else {
          existing = store.findUserByUsername(username);
        }
        store.data().databases[orgId] = {
          version: 1,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          data: body.database
        };
      } else {
        orgId = existing.organizationId;
        if (!safeEqual(existing.passwordHash, hashPassword(password))) {
          return json(res, 401, { error: "Usu\xE1rio ou senha inv\xE1lidos." });
        }
        store.data().databases[orgId] = {
          version: (store.data().databases[orgId]?.version || 0) + 1,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          data: body.database
        };
      }
      const user = existing || store.findUserByUsername(username);
      if (!user) return json(res, 500, { error: "Falha ao criar usu\xE1rio na nuvem." });
      const token2 = issueToken();
      store.data().tokens[token2] = {
        organizationId: user.organizationId,
        userId: user.id,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      store.markDirty();
      await store.persist();
      return json(res, 200, {
        token: token2,
        session: store.toSession(user),
        version: store.data().databases[user.organizationId]?.version || 1
      });
    }
    const token = readBearer(req);
    const session = token ? store.resolveToken(token) : null;
    if (req.method === "GET" && path === "/db") {
      if (!session) return json(res, 401, { error: "Sess\xE3o inv\xE1lida. Fa\xE7a login novamente." });
      const rec = store.data().databases[session.organizationId];
      if (!rec) return json(res, 404, { error: "Nenhum dado encontrado para esta organiza\xE7\xE3o." });
      return json(res, 200, { database: rec.data, version: rec.version, updatedAt: rec.updatedAt });
    }
    if (req.method === "PUT" && path === "/db") {
      if (!session) return json(res, 401, { error: "Sess\xE3o inv\xE1lida. Fa\xE7a login novamente." });
      const body = req.body || {};
      if (!body.database) return json(res, 400, { error: "Payload sem database." });
      const data = body.database;
      if (data.organization && data.organization.id && data.organization.id !== session.organizationId) {
        return json(res, 403, { error: "Acesso negado a outra organiza\xE7\xE3o." });
      }
      const prev = store.data().databases[session.organizationId];
      const nextVersion = (prev?.version || 0) + 1;
      store.data().databases[session.organizationId] = {
        version: nextVersion,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        data: body.database
      };
      store.markDirty();
      await store.persist();
      return json(res, 200, { ok: true, version: nextVersion });
    }
    return json(res, 404, { error: `Rota n\xE3o encontrada: ${path}` });
  } catch (err) {
    console.error("[lp-motors] handler error", err);
    return json(res, 500, {
      error: err instanceof Error ? err.message : "Erro interno no LP Motors API"
    });
  }
}
//# sourceMappingURL=lp-motors.js.map
