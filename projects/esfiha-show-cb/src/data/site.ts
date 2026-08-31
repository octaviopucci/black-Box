export const site = {
  name: "Esfiha Show",
  unit: "Capão Bonito",
  tagline: "Esfihas abertas e pizzas — do forno direto pra sua mesa.",
  description:
    "Esfiha Show Capão Bonito: delivery de esfihas abertas e pizzas no Centro. Peça online ou pelo WhatsApp, das 17h às 23h20.",
  niche: "Esfiharia e pizzaria — delivery e retirada",

  address: {
    street: "Rua General Carneiro, 798",
    neighborhood: "Centro",
    city: "Capão Bonito",
    state: "SP",
    cep: "18300-260",
    full: "Rua General Carneiro, 798, Centro, Capão Bonito — SP",
    maps: "https://maps.google.com/?q=Rua+General+Carneiro+798+Capão+Bonito+SP",
  },

  hours: {
    label: "Todos os dias",
    open: "17:00",
    close: "23:20",
    display: "17h às 23h20",
  },

  phone: {
    landline: "(15) 3543-0602",
    landlineHref: "tel:+551535430602",
    whatsapp: "(15) 99802-0602",
    whatsappHref: "https://wa.me/5515998020602",
  },

  links: {
    delivery: "https://delivery.gourmetsa.com.br/v2/esfihashowcb",
    instagram: "https://www.instagram.com/esfihashowcapaobonito/",
    facebook: "https://fb.com/EsfihaShowCapaoBonito",
    website: "http://esfihashow.com/",
  },

  social: {
    instagramHandle: "@esfihashowcapaobonito",
    followers: 6948,
  },

  /** Sabores mencionados em fontes públicas — cardápio completo no link de delivery */
  flavors: {
    esfihas: [
      { name: "Carne", note: "Clássica da casa" },
      { name: "Queijo", note: "Derretida na hora" },
      { name: "Calabresa", note: "Fatiada e temperada" },
      { name: "Catupiry", note: "Cremosa por dentro" },
      { name: "Atum", note: "Recheio generoso" },
      { name: "Alho", note: "Sabor marcante" },
    ],
    pizzas: [
      { name: "Espanhola", note: "Calabresa, cebola e mussarela" },
      { name: "Argentina", note: "Para dividir com a galera" },
    ],
  },

  cta: {
    primary: "Fazer pedido",
    secondary: "WhatsApp",
    deliveryNote: "Cardápio completo, combos e promoções no delivery oficial.",
  },
} as const;

export const media = {
  hero: "/instagram/post-5.jpg",
  profile: "/instagram/profile.jpg",
  gallery: [
    {
      src: "/instagram/post-2.jpg",
      alt: "Esfiha Show — esfihas e pizza para compartilhar",
      caption: "Pizza e esfihas para momentos em família.",
    },
    {
      src: "/instagram/post-5.jpg",
      alt: "Pizza Espanhola Esfiha Show",
      caption: "Pizza Espanhola — calabresa, cebola e mussarela.",
    },
    {
      src: "/instagram/post-6.jpg",
      alt: "Pizza Argentina Esfiha Show",
      caption: "Pizza Argentina — sabor que dá show.",
    },
  ],
} as const;
