export const site = {
  name: "Esfiha Show",
  unit: "Capão Bonito",
  tagline: "Esfihas abertas, pizzas e combos — do forno direto pra sua mesa.",
  manifesto:
    "Na Esfiha Show, cada recheio, cada pizza e cada combo foi pensado pra dar um show de sabor. Abre todo dia à noite no Centro de Capão Bonito — peça pelo delivery, WhatsApp ou retire no balcão.",
  description:
    "Esfiha Show Capão Bonito: mais de 80 itens no cardápio — esfihas abertas, pizzas, doces, combos e bebidas. Delivery das 17h às 23h20.",

  address: {
    street: "Rua General Carneiro, 798",
    neighborhood: "Centro",
    city: "Capão Bonito",
    state: "SP",
    cep: "18300-260",
    full: "Rua General Carneiro, 798, Centro, Capão Bonito — SP",
    maps: "https://maps.app.goo.gl/EeHdxh8h9jcYNDov5",
    corner: "Esquina com R. Benjamin Constant",
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

  brand: {
    colors: {
      green: "#7DB641",
      greenDark: "#20b355",
      orange: "#F9976A",
      dark: "#201E1F",
      yellow: "#F5C518",
    },
    logo: "/logo.jpg",
  },

  features: [
    { label: "Delivery", detail: "Pedido online com taxa por bairro" },
    { label: "Retirada", detail: "Leve no balcão — sem fila no app" },
    { label: "Cartão", detail: "Crédito aceito no delivery" },
    { label: "Acessível", detail: "Estabelecimento acessível a cadeirantes" },
  ],

  proof: {
    googleRating: 4.7,
    priceRange: "R$ 20 – R$ 40 por pessoa",
    source: "Google via Restaurant Guru",
  },

  howToOrder: [
    {
      step: "01",
      title: "Escolha no cardápio",
      detail: "Mais de 80 itens: esfihas, pizzas, doces, combos e bebidas.",
    },
    {
      step: "02",
      title: "Peça pelo delivery",
      detail: "Monte seu pedido, escolha entrega ou retirada e finalize.",
    },
    {
      step: "03",
      title: "Receba quentinho",
      detail: "Acompanhe o status do pedido na aba Pedidos do app.",
    },
  ],

  faq: [
    {
      q: "Qual o horário de funcionamento?",
      a: "Todos os dias das 17h às 23h20. O delivery pode aceitar pedidos mesmo com estabelecimento fechado — confira o status no app.",
    },
    {
      q: "Como faço meu pedido?",
      a: "Pelo delivery oficial (link Fazer pedido), WhatsApp (15) 99802-0602 ou telefone (15) 3543-0602.",
    },
    {
      q: "Tem combo para família?",
      a: "Sim — caixas de 5 ou 10 esfihas (carne, calabresa ou frango) e combos com refri 2L a partir de R$ 65,49.",
    },
    {
      q: "Aceita cartão?",
      a: "Sim, cartões de crédito são aceitos no delivery.",
    },
    {
      q: "Onde fica a loja?",
      a: "Rua General Carneiro, 798, Centro — Capão Bonito/SP, esquina com R. Benjamin Constant.",
    },
  ],

  cta: {
    primary: "Fazer pedido",
    secondary: "WhatsApp",
    deliveryNote:
      "Cardápio completo com fotos, combos, adicionais e taxa de entrega por bairro.",
  },
} as const;

export const media = {
  hero: "/instagram/post-5.jpg",
  heroSecondary: "/instagram/post-6.jpg",
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
    {
      src: "/instagram/post-1.jpg",
      alt: "Esfihas Esfiha Show Capão Bonito",
      caption: "Esfihas abertas recheadas na hora.",
    },
  ],
} as const;
