export type MenuItem = {
  name: string;
  price: number;
  description?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  subtitle?: string;
  fromPrice?: number;
  items: MenuItem[];
};

/** Cardápio extraído do delivery oficial — delivery.gourmetsa.com.br/v2/esfihashowcb */
export const menuCategories: MenuCategory[] = [
  {
    id: "pizzas",
    name: "Pizzas",
    subtitle: "Salgadas, doces, calzones e especiais",
    fromPrice: 42.99,
    items: [
      { name: "Pizzas Salgadas", price: 42.99, description: "2 sabores disponíveis" },
      { name: "Pizzas Doces", price: 44.99, description: "2 sabores disponíveis" },
      { name: "Calzones", price: 60.99, description: "2 sabores disponíveis" },
      { name: "Indiana", price: 42.99, description: "1 sabor disponível" },
      { name: "Pizza Espanhola", price: 42.99, description: "Calabresa fatiada, cebola e mussarela" },
      { name: "Pizza Argentina", price: 42.99, description: "Para dividir com a galera" },
    ],
  },
  {
    id: "carne",
    name: "Carne",
    items: [
      { name: "Esfiha de Carne", price: 4.5, description: "Carne com pedaços de tomate e cebola" },
      { name: "Esfiha de Carne com Mussarela", price: 5.29 },
      { name: "Esfiha de Carne com Barbecue", price: 4.89 },
      { name: "Esfiha de Carne com Catupiry", price: 5.29 },
      { name: "Esfiha de Carne com Cheddar", price: 5.29 },
      { name: "Esfiha de Carne com Cream Cheese", price: 5.29 },
      { name: "Esfiha de Carne com Milho e Mussarela", price: 5.39 },
      { name: "Esfiha de Carne com Mussarela, Milho e Bacon", price: 5.99 },
    ],
  },
  {
    id: "calabresa",
    name: "Calabresa",
    items: [
      { name: "Esfiha Calabresa", price: 4.5, description: "Calabresa fatiada" },
      { name: "Esfiha de Calabresa com Mussarela", price: 5.29 },
      { name: "Esfiha de Calabresa com Barbecue", price: 4.89 },
      { name: "Esfiha de Calabresa com Catupiry", price: 5.29 },
      { name: "Esfiha de Calabresa com Cheddar", price: 5.29 },
      { name: "Esfiha de Calabresa com Cream Cheese", price: 5.29 },
      { name: "Esfiha de Calabresa com Milho e Mussarela", price: 5.39 },
      { name: "Esfiha de Calabresa com Mussarela, Milho e Bacon", price: 5.99 },
      { name: "Esfiha de Calabresa com Cebola", price: 6.89 },
      { name: "Esfiha de Calabresa, Cebola e Barbecue", price: 6.99 },
      { name: "Esfiha de Lombo Canadense", price: 6.99 },
      { name: "Esfiha de Lombo Canadense com Cheddar", price: 6.99 },
      { name: "Esfiha de Lombo Canadense com Catupiry", price: 6.99 },
      { name: "Esfiha de Lombo Canadense, Barbecue e Cebola", price: 6.99 },
      { name: "Esfiha de Lombo Canadense com Cream Cheese", price: 6.99 },
    ],
  },
  {
    id: "queijo",
    name: "Queijo",
    items: [
      { name: "Esfiha de Queijo", price: 4.79 },
      { name: "Esfiha de 2 Queijos", price: 5.49, description: "Queijo com catupiry" },
      { name: "Esfiha 3 Queijos", price: 6.29, description: "Queijo, catupiry e parmesão" },
      { name: "Esfiha 4 Queijos", price: 6.89, description: "Queijo, catupiry, parmesão e mussarela" },
    ],
  },
  {
    id: "mussarela",
    name: "Mussarela",
    items: [
      { name: "Esfiha de Mussarela", price: 5.39 },
      { name: "Esfiha de Alho", price: 5.49, description: "Mussarela com alho frito" },
      { name: "Esfiha de Tomate e Orégano", price: 5.99 },
      { name: "Esfiha de Brócolis", price: 6.49 },
      { name: "Esfiha de Pepperoni", price: 6.59 },
      { name: "Esfiha de Palmito", price: 6.59 },
      { name: "Esfiha de Mussarela com Milho", price: 6.59 },
      { name: "Esfiha de Mussarela com Bacon", price: 6.79 },
      { name: "Esfiha de Tomate Seco com Orégano", price: 6.89 },
      { name: "Esfiha de Tomate Seco com Bacon", price: 6.89 },
      { name: "Esfiha de Mussarela com Bacon e Milho", price: 6.89 },
      { name: "Esfiha de Escarola com Alho", price: 6.89 },
      { name: "Esfiha de Atum", price: 7.09, description: "Atum, tomate, cebola e palmito" },
      { name: "Esfiha de Mussarela com Presunto, Tomate e Orégano", price: 6.39 },
    ],
  },
  {
    id: "frango",
    name: "Frango",
    items: [
      { name: "Esfiha de Frango", price: 4.5, description: "Frango desfiado com molho especial" },
      { name: "Esfiha de Frango com Barbecue", price: 4.89 },
      { name: "Esfiha de Frango com Catupiry", price: 5.29 },
      { name: "Esfiha de Frango com Mussarela", price: 5.29 },
      { name: "Esfiha de Frango com Cheddar", price: 5.29 },
      { name: "Esfiha de Frango com Cream Cheese", price: 5.29 },
      { name: "Esfiha de Frango com Milho e Mussarela", price: 5.39 },
      { name: "Esfiha de Frango com Mussarela, Milho e Bacon", price: 5.99 },
    ],
  },
  {
    id: "doces",
    name: "Doces",
    items: [
      { name: "Romeu e Julieta", price: 5.29, description: "Queijo com goiabada" },
      { name: "Mineira", price: 5.39, description: "Queijo com doce de leite" },
      { name: "Magic", price: 7.59, description: "Creme de avelã com mussarela" },
      { name: "Magic com Beijinho", price: 7.19 },
      { name: "Queijadinha", price: 7.49, description: "Mussarela com creme de coco" },
      { name: "Torta de Limão", price: 5.99 },
      { name: "Torta de Maracujá", price: 5.99 },
      { name: "Magic com Creme de Limão", price: 7.19 },
      { name: "Magic com Creme de Maracujá", price: 7.19 },
      { name: "Esfiha Cream Cheese c/ Goiabada", price: 6.49 },
      { name: "Esfiha Cream Cheese c/ Limão", price: 7.09 },
      { name: "Esfiha Cream Cheese c/ Maracujá", price: 7.09 },
      { name: "Esfiha Cream Cheese c/ Doce de Leite", price: 7.09 },
      { name: "Cream Cheese com Beijinho", price: 7.09 },
      { name: "Esfiha de Nutella", price: 6.79 },
      { name: "Esfiha de Nutella com Paçoca", price: 7.19 },
      { name: "Esfiha Doce de Leite com Paçoca", price: 7.19 },
      { name: "Esfiha de Oreo", price: 6.79 },
      { name: "Nutella com Oreo", price: 7.19 },
    ],
  },
  {
    id: "combos",
    name: "Combos",
    subtitle: "Para família e galera",
    items: [
      { name: "Carne — Caixa c/ 10 unidades", price: 38.99, description: "+ R$ 9,99 por ingrediente extra" },
      { name: "Calabresa — Caixa c/ 10 unidades", price: 38.99, description: "+ R$ 9,99 por ingrediente extra" },
      { name: "Frango — Caixa c/ 10 unidades", price: 38.99, description: "+ R$ 9,99 por ingrediente extra" },
      { name: "Carne — Caixa c/ 5 unidades", price: 21.49, description: "+ R$ 4,99 por ingrediente extra" },
      { name: "Calabresa — Caixa c/ 5 unidades", price: 21.49, description: "+ R$ 4,99 por ingrediente extra" },
      { name: "Frango — Caixa c/ 5 unidades", price: 21.49, description: "+ R$ 4,99 por ingrediente extra" },
      { name: "Combo 1", price: 65.49, description: "15 esfihas + 1 refri 2L" },
      { name: "Combo 2", price: 131.99, description: "15 esfihas de carne + 15 de frango + 2 refri 2L" },
      { name: "Combo 3", price: 186.99, description: "15 carne + 15 queijo + 15 frango + 2 refri 2L" },
    ],
  },
  {
    id: "churros",
    name: "Mini Churros",
    items: [
      { name: "Mini Churros de Doce de Leite", price: 32.99, description: "Porção ~380g, passados no açúcar de confeiteiro" },
    ],
  },
  {
    id: "lata",
    name: "Lata 350ml",
    items: [
      { name: "Coca-Cola 350ml", price: 5.49 },
      { name: "Coca-Cola Zero 350ml", price: 5.49 },
      { name: "Fanta Laranja 350ml", price: 5.49 },
      { name: "Fanta Uva 350ml", price: 5.49 },
      { name: "Sprite 350ml", price: 5.49 },
      { name: "Guaraná Antarctica 350ml", price: 5.49 },
    ],
  },
  {
    id: "pet2l",
    name: "Pet 2 Litros",
    items: [
      { name: "Coca-Cola 2L", price: 13.99 },
      { name: "Coca-Cola Zero 2L", price: 13.99 },
      { name: "Fanta Laranja 2L", price: 13.99 },
      { name: "Fanta Uva 2L", price: 13.99 },
      { name: "Guaraná Kuat 2L", price: 8.49 },
      { name: "Sprite 2L", price: 13.99 },
      { name: "Guaraná Antarctica 2L", price: 13.99 },
      { name: "Pepsi 2L", price: 13.99 },
    ],
  },
];

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const menuStats = {
  categories: menuCategories.length,
  items: menuCategories.reduce((sum, c) => sum + c.items.length, 0),
  priceFrom: 4.5,
  priceTo: 186.99,
};
