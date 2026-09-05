const whatsappLabel = "(15) 99653-2750";

export const site = {
  name: "NA Veículos",
  legalName: "N.A. Veiculos Ltda",
  cnpj: "49.138.934/0001-83",
  whatsapp: "5515996532750",
  whatsappLabel,
  phone: {
    label: "(15) 3542-3229",
    href: "tel:+551535423229",
  },
  instagram: {
    handle: "@n.aveiculos__",
    url: "https://www.instagram.com/n.aveiculos__/",
  },
  facebook: "https://www.facebook.com/profile.php?id=100008066959463",
  address: {
    line1: "Rua Altino Arantes, 635, Centro",
    line2: "Capão Bonito, SP — CEP 18300-290",
    landmark: "Perto das Lojas Cem",
    maps: "https://www.google.com/maps/search/?api=1&query=Rua+Altino+Arantes+635+Cap%C3%A3o+Bonito+SP",
  },
  city: "Capão Bonito, SP",
  assets: {
    logo: "/brand/logo.svg",
    ogImage: "/brand/logo.png",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Como comprar", href: "#como-comprar" },
    { label: "Estoque", href: "#estoque" },
    { label: "Entregas", href: "#entregas" },
    { label: "Quero comprar", href: "#orcamento" },
    { label: "Contato", href: "#contato" },
  ],
  principles: [
    "PREÇO NO ANÚNCIO",
    "FOTO DO CARRO REAL",
    "FINANCIAMENTO EM ATÉ 60X",
    "CARTÃO EM ATÉ 36X",
    "TROCA DO SEU USADO",
    "CONSIGNAÇÃO",
  ],
  stats: [
    { value: 6100, label: "Seguidores no Instagram" },
    { value: 30, label: "Carros no catálogo" },
  ],
  truths: [
    {
      title: "Preço no anúncio",
      text: "O valor que você vê é o valor da loja. Sem teatro de “chama no privado pra saber”.",
    },
    {
      title: "Foto do carro real",
      text: "Cada unidade é a que está na NA. Sem banco de imagem, sem carro de outro estado.",
    },
    {
      title: "Negociação humana",
      text: "Financiamento, troca ou consignação — a gente fecha olhando o seu caso, não um roteiro.",
    },
  ],
  services: [
    {
      title: "Financiamento em até 60x",
      tagline: "Simulação na hora, sem enrolação.",
      desc: "Simulamos na hora com os bancos parceiros. Também dá para usar crédito do Mercado Pago / Mercado Livre.",
      tags: ["Até 60x", "Mercado Pago"],
      image: "/vehicles/DbLlGXYjlkC.jpg",
    },
    {
      title: "Cartão em até 36x",
      tagline: "Parcelou, levou.",
      desc: "Para quem prefere parcelar no cartão e levar o carro sem espera longa de banco.",
      tags: ["Até 36x", "Sem banco"],
      image: "/vehicles/Da5GSBjjnIZ.jpg",
    },
    {
      title: "Troca do seu usado",
      tagline: "Seu carro entra na conta.",
      desc: "Avaliamos o que você tem hoje e abatemos na negociação com transparência.",
      tags: ["Avaliação", "Abate no valor"],
      image: "/vehicles/DaOakpggUik.jpg",
    },
    {
      title: "Consignação",
      tagline: "Quer vender? A loja expõe pra você.",
      desc: "Deixamos o carro na loja e cuidamos da exposição, das fotos e do atendimento até fechar.",
      tags: ["Exposição", "Loja física"],
      image: "/vehicles/DaQ0nCRmB3U.jpg",
    },
  ],
  warnings: [
    "A NA só anuncia no Instagram e no Facebook oficiais.",
    `WhatsApp da loja: ${whatsappLabel} — qualquer outro número, desconfie.`,
    "Prefere segurança? Venha até a Rua Altino Arantes, 635.",
  ],
  paymentOptions: [
    "À vista",
    "Financiamento em até 60x",
    "Cartão em até 36x",
    "Troca + financiamento",
    "Ainda não sei — quero simular",
  ],
} as const;
