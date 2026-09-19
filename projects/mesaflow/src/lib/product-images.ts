/**
 * Utilitários de imagem de produto — sem injetar fotos stock em runtime.
 * PRODUCT_IMAGES permanece só para referência histórica / testes de detecção stock.
 */

const PEXELS_Q = "auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";

function pexels(id: number, slug = "pexels-photo") {
  return `https://images.pexels.com/photos/${id}/${slug}-${id}.jpeg?${PEXELS_Q}`;
}

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=800&h=600&q=80&auto=format&fit=crop`;
}

/** Imagens stock do cardápio demo legado (Ponto do Sabor) — usadas só para detecção/strip. */
export const PRODUCT_IMAGES: Record<string, string> = {
  p_xburger: pexels(1639562),
  p_xsalada: pexels(1279330),
  p_pizza_calabresa: unsplash("1513104890138-7c749659a591"),
  p_pizza_frango: pexels(2983101),
  p_pizza_marg: unsplash("1565299624946-b28f40a0ae38"),
  p_pizza_pepper: unsplash("1604382354936-07c5d9983bd3"),
  p_batata: pexels(1581384),
  p_coxinha: pexels(4518843),
  p_coca: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  p_cappuccino: unsplash("1572442388796-11668a67e53d"),
  p_chopp: pexels(15515325),
  p_caipirinha: pexels(2097090),
  p_pudim: unsplash("1551024506-0bccd828d307"),
  p_brownie: pexels(1624487),
  p_salada: unsplash("1512621776951-a57141f2eefd"),
};

/** Presets stock legados — usados só para detecção/strip. */
export const FOOD_PRESETS = {
  burger: pexels(1639562),
  xsalada: pexels(1279330),
  pizza: unsplash("1513104890138-7c749659a591"),
  prato: unsplash("1504674900247-0877df9cc836"),
  padaria: pexels(5632401),
  porcao: pexels(1581384),
  bebida: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  cafe: unsplash("1495474472287-4d71bcdd2085"),
  default: pexels(1893556),
} as const;

export type FoodPreset = keyof typeof FOOD_PRESETS;

const STOCK_URL_MARKERS = [
  "picsum.photos",
  "images.pexels.com",
  "images.unsplash.com",
  "source.unsplash.com",
  "placehold.co",
  "placeholder.com",
  "via.placeholder.com",
  "loremflickr.com",
] as const;

const KNOWN_STOCK_URLS = new Set<string>([
  ...Object.values(PRODUCT_IMAGES),
  ...Object.values(FOOD_PRESETS),
]);

/** URL stock conhecida ou de banco genérico — nunca exibir como foto real. */
export function isStockProductImageUrl(src?: string | null): boolean {
  if (!src?.trim()) return false;
  const normalized = src.trim();
  if (KNOWN_STOCK_URLS.has(normalized)) return true;
  const lower = normalized.toLowerCase();
  return STOCK_URL_MARKERS.some((marker) => lower.includes(marker));
}

/** Remove URL stock; retorna undefined para persistir sem foto. */
export function sanitizeProductImageUrl(src?: string | null): string | undefined {
  if (!src?.trim()) return undefined;
  const normalized = src.trim();
  if (isStockProductImageUrl(normalized)) return undefined;
  return normalized;
}

/** @deprecated Não injeta mais imagens — retorna undefined. Mantido para compat de imports. */
export function productImage(_id: string, _fallback: FoodPreset | string = "default"): undefined {
  return undefined;
}

/** @deprecated Não injeta mais imagens — retorna undefined. Mantido para compat de imports. */
export function productImageByName(_name: string, _preset: FoodPreset = "default"): undefined {
  return undefined;
}
