/** URLs estáveis — picsum com seed fixo por produto (sempre disponível). */
export const PRODUCT_IMAGES: Record<string, string> = {
  p_xburger: "https://picsum.photos/seed/mf-xburger/800/600",
  p_xsalada: "https://picsum.photos/seed/mf-xsalada/800/600",
  p_pizza_calabresa: "https://picsum.photos/seed/mf-pizza-calabresa/800/600",
  p_pizza_frango: "https://picsum.photos/seed/mf-pizza-frango/800/600",
  p_pizza_marg: "https://picsum.photos/seed/mf-pizza-marg/800/600",
  p_pizza_pepper: "https://picsum.photos/seed/mf-pizza-pepper/800/600",
  p_batata: "https://picsum.photos/seed/mf-batata/800/600",
  p_coxinha: "https://picsum.photos/seed/mf-coxinha/800/600",
  p_coca: "https://picsum.photos/seed/mf-coca/800/600",
  p_cappuccino: "https://picsum.photos/seed/mf-cappuccino/800/600",
  p_chopp: "https://picsum.photos/seed/mf-chopp/800/600",
  p_caipirinha: "https://picsum.photos/seed/mf-caipirinha/800/600",
  p_pudim: "https://picsum.photos/seed/mf-pudim/800/600",
  p_brownie: "https://picsum.photos/seed/mf-brownie/800/600",
  p_salada: "https://picsum.photos/seed/mf-salada/800/600",
};

export function productImage(id: string, fallbackSeed = "mesaflow-food") {
  return PRODUCT_IMAGES[id] || `https://picsum.photos/seed/${fallbackSeed}/800/600`;
}
