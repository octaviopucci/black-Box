import { id } from "./crypto-utils";
import { FOOD_PRESETS, productImage, productImageByName } from "./product-images";
import type {
  BusinessType,
  Category,
  Establishment,
  MesaFlowStore,
  Product,
  Rodizio,
  Sector,
  Table,
  User,
} from "./types";

export type RegisterInput = {
  businessName: string;
  ownerName: string;
  email: string;
  passwordHash: string;
  businessType: BusinessType;
  tableCount: number;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function uniqueSlug(store: MesaFlowStore, base: string) {
  let slug = slugify(base) || "estabelecimento";
  let n = 0;
  while (Object.values(store.establishments).some((e) => e.slug === slug)) {
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}

const TYPE_LABELS: Record<BusinessType, string> = {
  restaurante: "Restaurante",
  lanchonete: "Lanchonete",
  padaria: "Padaria",
  bar: "Bar",
  cafeteria: "Cafeteria",
  rodizio: "Rodízio",
};

export function provisionEstablishment(store: MesaFlowStore, input: RegisterInput) {
  const estId = id("est_");
  const slug = uniqueSlug(store, input.businessName);
  const now = new Date().toISOString();
  const typeLabel = TYPE_LABELS[input.businessType];

  const establishment: Establishment = {
    id: estId,
    slug,
    name: input.businessName,
    tagline: `${typeLabel} · pedidos por QR Code`,
    logo: "🍽️",
    open: true,
    rodizioEnabled: input.businessType === "rodizio",
    businessType: input.businessType,
    settings: {
      currency: "BRL",
      allowEditAfterPrep: false,
      soundNotifications: true,
      minIntervalRodizioSec: 120,
    },
    createdAt: now,
  };

  const user: User = {
    id: id("user_"),
    establishmentId: estId,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.ownerName,
    role: "OWNER",
    active: true,
  };

  const secCozinha = id("sec_");
  const sectors: Record<string, Sector> = {
    [secCozinha]: {
      id: secCozinha,
      establishmentId: estId,
      name: "Cozinha",
      kind: "COZINHA",
      color: "#f97316",
      active: true,
    },
  };
  const secBalcao = id("sec_");
  sectors[secBalcao] = {
    id: secBalcao,
    establishmentId: estId,
    name: "Balcão",
    kind: "BALCAO",
    color: "#3b82f6",
    active: true,
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
      active: true,
    };
  }

  const catPrincipal = id("cat_");
  const catBebida = id("cat_");
  const categories: Record<string, Category> = {
    [catPrincipal]: {
      id: catPrincipal,
      establishmentId: estId,
      name: input.businessType === "padaria" ? "Padaria" : "Pratos",
      emoji: input.businessType === "padaria" ? "🥐" : "🍽️",
      sortOrder: 1,
      active: true,
    },
    [catBebida]: {
      id: catBebida,
      establishmentId: estId,
      name: "Bebidas",
      emoji: "🥤",
      sortOrder: 2,
      active: true,
    },
  };

  const p1 = id("p_");
  const p2 = id("p_");
  const p3 = id("p_");
  const products: Record<string, Product> = {
    [p1]: {
      id: p1,
      establishmentId: estId,
      categoryId: catPrincipal,
      sectorId: secCozinha,
      name: input.businessType === "padaria" ? "Pão na Chapa" : "Prato do Dia",
      description: "Edite este item no painel quando o CRUD estiver disponível.",
      price: 29.9,
      image:
        input.businessType === "padaria"
          ? FOOD_PRESETS.padaria
          : productImage("p_xburger", "prato"),
      tags: ["destaque"],
      prepMinutes: 15,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
    },
    [p2]: {
      id: p2,
      establishmentId: estId,
      categoryId: catPrincipal,
      sectorId: secCozinha,
      name: input.businessType === "lanchonete" ? "X-Salada" : "Porção Especial",
      description: "Item de exemplo — personalize no cardápio.",
      price: 24.9,
      image: productImageByName(
        input.businessType === "lanchonete" ? "X-Salada" : "Porção Especial",
        "porcao",
      ),
      tags: [],
      prepMinutes: 12,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
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
      rodizioIncluded: false,
    },
  };

  const tables: Record<string, Table> = {};
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
      qrToken: `mesa-${i}`,
    };
  }

  const rodizios: Record<string, Rodizio> = {};
  if (input.businessType === "rodizio") {
    const rid = id("rod_");
    rodizios[rid] = {
      id: rid,
      establishmentId: estId,
      name: "Rodízio",
      pricePerPerson: 59.9,
      durationMinutes: 90,
      maxItemsPerRound: 6,
      maxRounds: 8,
      minIntervalSec: 120,
      drinksIncluded: false,
      active: true,
      productIds: [p1, p2],
      premiumProductIds: [],
    };
  }

  store.establishments[estId] = establishment;
  store.users[user.id] = user;
  Object.assign(store.sectors, sectors);
  Object.assign(store.categories, categories);
  Object.assign(store.products, products);
  Object.assign(store.tables, tables);
  Object.assign(store.rodizios, rodizios);
  store.orderCounter[estId] = 1000;

  return { establishment, user, slug };
}
