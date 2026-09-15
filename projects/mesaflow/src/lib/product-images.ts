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
  p_cappuccino: unsplash("1572442388796-11668a67e53d"), // cappuccino com latte art
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
  cafe: unsplash("1495474472287-4d71bcdd2085"),
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
