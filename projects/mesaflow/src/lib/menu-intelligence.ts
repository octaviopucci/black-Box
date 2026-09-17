import type { Category, Product } from "./types";

export type SuggestionTone = "pairing" | "complete" | "closing" | "popular";

export type SoftSuggestion = {
  product: Product;
  reason: string;
  tone: SuggestionTone;
};

const DRINK_HINTS = /bebida|drink|suco|refrigerante|cerveja|vinho|drink|água|cafe|café|chá|drink|drink|smoothie|milkshake|coquetel|drinks/i;
const DESSERT_HINTS = /sobremesa|doce|sobremesas|dessert|sorvete|brownie|pudim|torta|açaí|acai|chocolate|mousse/i;
const SIDE_HINTS = /entrada|porção|porcao|acompanhamento|salada|batata|onion|petisco|guarnição|guarnicao/i;
const MAIN_HINTS = /prato|principal|burger|hambúrguer|hamburguer|pizza|massa|parmegiana|steak|carne|peixe|frango|risoto|lanche/i;

function categoryName(categories: Category[], categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.name || "";
}

export function classifyProduct(product: Product, categories: Category[]): "drink" | "dessert" | "side" | "main" | "other" {
  const blob = `${product.name} ${product.description} ${categoryName(categories, product.categoryId)} ${product.tags.join(" ")}`;
  if (DRINK_HINTS.test(blob)) return "drink";
  if (DESSERT_HINTS.test(blob)) return "dessert";
  if (SIDE_HINTS.test(blob)) return "side";
  if (MAIN_HINTS.test(blob)) return "main";
  return "other";
}

function resolveConfigured(
  ids: string[] | undefined,
  catalog: Product[],
  exclude: Set<string>,
  reason: string,
  tone: SuggestionTone,
): SoftSuggestion[] {
  if (!ids?.length) return [];
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const out: SoftSuggestion[] = [];
  for (const id of ids) {
    if (exclude.has(id)) continue;
    const product = byId.get(id);
    if (!product?.active) continue;
    exclude.add(id);
    out.push({ product, reason, tone });
  }
  return out;
}

/** Combina bumps configurados + heurística gentil (não agressiva). */
export function suggestionsForProduct(
  product: Product,
  catalog: Product[],
  categories: Category[],
  limit = 3,
): SoftSuggestion[] {
  const exclude = new Set<string>([product.id]);
  const configured = [
    ...resolveConfigured(product.bumpProductIds, catalog, exclude, "Combina bem", "pairing"),
    ...resolveConfigured(product.upsellProductIds, catalog, exclude, "Vale conhecer", "pairing"),
  ];
  if (configured.length >= limit) return configured.slice(0, limit);

  const kind = classifyProduct(product, categories);
  const want: Array<"drink" | "side" | "dessert"> =
    kind === "main" ? ["drink", "side"] : kind === "side" ? ["drink"] : kind === "drink" ? ["side"] : ["drink"];

  const inferred: SoftSuggestion[] = [];
  for (const target of want) {
    const match = catalog.find((candidate) => {
      if (exclude.has(candidate.id) || !candidate.active) return false;
      return classifyProduct(candidate, categories) === target;
    });
    if (!match) continue;
    exclude.add(match.id);
    inferred.push({
      product: match,
      reason: target === "drink" ? "Para acompanhar" : target === "side" ? "Para completar" : "Para fechar bem",
      tone: "complete",
    });
  }

  const featured = catalog
    .filter((p) => p.featured && p.active && !exclude.has(p.id))
    .slice(0, 2)
    .map((p) => ({ product: p, reason: "Sugestão da casa", tone: "popular" as const }));

  return [...configured, ...inferred, ...featured].slice(0, limit);
}

/** No carrinho: completa o que falta (bebida/entrada) sem empurrar. */
export function suggestionsForCart(
  lines: Array<{ product: Product }>,
  catalog: Product[],
  categories: Category[],
  limit = 4,
): SoftSuggestion[] {
  if (!lines.length) return [];
  const inCart = new Set(lines.map((l) => l.product.id));
  const kinds = new Set(lines.map((l) => classifyProduct(l.product, categories)));

  const configured: SoftSuggestion[] = [];
  for (const line of lines) {
    configured.push(
      ...resolveConfigured(line.product.bumpProductIds, catalog, inCart, "Combina com seu pedido", "pairing"),
      ...resolveConfigured(line.product.upsellProductIds, catalog, inCart, "Quem pediu isso também gostou", "pairing"),
    );
  }

  const gaps: SoftSuggestion[] = [];
  if (!kinds.has("drink")) {
    const drink = catalog.find((p) => p.active && !inCart.has(p.id) && classifyProduct(p, categories) === "drink");
    if (drink) {
      inCart.add(drink.id);
      gaps.push({ product: drink, reason: "Falta uma bebida?", tone: "complete" });
    }
  }
  if (kinds.has("main") && !kinds.has("side")) {
    const side = catalog.find((p) => p.active && !inCart.has(p.id) && classifyProduct(p, categories) === "side");
    if (side) {
      inCart.add(side.id);
      gaps.push({ product: side, reason: "Uma entrada leve?", tone: "complete" });
    }
  }

  return [...gaps, ...configured].slice(0, limit);
}

/** Antes de pedir a conta: sobremesa/café com saída fácil. */
export function suggestionsForClosing(
  orderedProducts: Product[],
  catalog: Product[],
  categories: Category[],
  limit = 3,
): SoftSuggestion[] {
  const orderedIds = new Set(orderedProducts.map((p) => p.id));
  const orderedKinds = new Set(orderedProducts.map((p) => classifyProduct(p, categories)));
  const out: SoftSuggestion[] = [];

  if (!orderedKinds.has("dessert")) {
    const desserts = catalog.filter(
      (p) => p.active && !orderedIds.has(p.id) && classifyProduct(p, categories) === "dessert",
    );
    for (const dessert of desserts.slice(0, 2)) {
      orderedIds.add(dessert.id);
      out.push({ product: dessert, reason: "Uma sobremesa antes de ir?", tone: "closing" });
    }
  }

  const coffee = catalog.find((p) => {
    if (!p.active || orderedIds.has(p.id)) return false;
    return /café|cafe|espresso|cappuccino/i.test(`${p.name} ${p.description}`);
  });
  if (coffee) {
    orderedIds.add(coffee.id);
    out.push({ product: coffee, reason: "Um café pra acompanhar?", tone: "closing" });
  }

  if (out.length < limit) {
    const drink = catalog.find(
      (p) => p.active && !orderedIds.has(p.id) && classifyProduct(p, categories) === "drink",
    );
    if (drink) out.push({ product: drink, reason: "Última rodada de bebida?", tone: "closing" });
  }

  return out.slice(0, limit);
}

export function productBadge(product: Product): string | null {
  if (product.featured) return "Sugestão da casa";
  if (product.tags.some((t) => /mais.?pedido|best.?seller|popular/i.test(t))) return "Mais pedido";
  if (product.tags.some((t) => /novo|new/i.test(t))) return "Novidade";
  return null;
}
