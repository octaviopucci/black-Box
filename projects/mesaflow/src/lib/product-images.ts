/**
 * Fotos reais de comida — URLs verificadas (Pexels / Unsplash).
 * Parâmetros fixos para cache estável no CDN.
 */

const PEXELS_Q = "auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";

function pexels(id: number, slug = "pexels-photo") {
  return `https://images.pexels.com/photos/${id}/${slug}-${id}.jpeg?${PEXELS_Q}`;
}

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=800&h=600&q=80&auto=format&fit=crop`;
}

/** Imagens do cardápio demo (Ponto do Sabor). */
export const PRODUCT_IMAGES: Record<string, string> = {
  p_xburger: pexels(1639562), // hambúrguer artesanal
  p_xsalada: pexels(1279330), // burger com salada
  p_pizza_calabresa: unsplash("1513104890138-7c749659a591"), // pizza calabresa
  p_pizza_frango: pexels(2983101), // pizza de frango
  p_pizza_marg: unsplash("1565299624946-b28f40a0ae38"), // pizza margherita
  p_pizza_pepper: unsplash("1604382354936-07c5d9983bd3"), // pizza pepperoni
  p_batata: pexels(1581384), // batata frita
  p_coxinha: pexels(4518843), // salgado / coxinha
  p_coca: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"), // coca-cola lata
  p_cappuccino: unsplash("1593508512255-86ab42a8e620"), // cappuccino
  p_chopp: pexels(15515325), // chopp / cerveja na torneira
  p_caipirinha: pexels(2097090), // caipirinha / coquetel
  p_pudim: unsplash("1551024506-0bccd828d307"), // pudim de leite
  p_brownie: pexels(1624487), // brownie com sorvete
  p_salada: unsplash("1512621776951-a57141f2eefd"), // salada fresca
};

/** Presets para novos estabelecimentos (provision). */
export const FOOD_PRESETS = {
  burger: pexels(1639562),
  xsalada: pexels(1279330),
  pizza: unsplash("1513104890138-7c749659a591"),
  prato: unsplash("1504674900247-0877df9cc836"),
  padaria: pexels(5632401),
  porcao: pexels(1581384),
  bebida: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  cafe: unsplash("1593508512255-86ab42a8e620"),
  default: pexels(1893556),
} as const;

export type FoodPreset = keyof typeof FOOD_PRESETS;

export function productImage(id: string, fallback: FoodPreset | string = "default") {
  if (PRODUCT_IMAGES[id]) return PRODUCT_IMAGES[id];
  if (fallback in FOOD_PRESETS) return FOOD_PRESETS[fallback as FoodPreset];
  return FOOD_PRESETS.default;
}

/** Escolhe imagem pelo nome do produto (novos tenants). */
export function productImageByName(name: string, preset: FoodPreset = "default") {
  const n = name.toLowerCase();
  if (n.includes("burger") || n.includes("x-burger") || n.includes("hambúrguer")) return FOOD_PRESETS.burger;
  if (n.includes("salada") && n.includes("x-")) return FOOD_PRESETS.xsalada;
  if (n.includes("pizza")) return FOOD_PRESETS.pizza;
  if (n.includes("pão") || n.includes("padaria")) return FOOD_PRESETS.padaria;
  if (n.includes("batata") || n.includes("porção") || n.includes("porcao")) return FOOD_PRESETS.porcao;
  if (n.includes("refrigerante") || n.includes("coca") || n.includes("suco")) return FOOD_PRESETS.bebida;
  if (n.includes("café") || n.includes("cafe") || n.includes("cappuccino")) return FOOD_PRESETS.cafe;
  if (n.includes("chopp") || n.includes("cerveja")) return pexels(15515325);
  if (n.includes("caipirinha") || n.includes("drink")) return pexels(2097090);
  if (n.includes("pudim") || n.includes("doce") || n.includes("brownie")) return pexels(1624487);
  if (n.includes("salada")) return unsplash("1512621776951-a57141f2eefd");
  if (n.includes("coxinha") || n.includes("salgado")) return pexels(4518843);
  if (n.includes("prato")) return FOOD_PRESETS.prato;
  return FOOD_PRESETS[preset] ?? FOOD_PRESETS.default;
}
