const whatsappLabel = "(15) 99999-9999";

export const site = {
  name: "Pucci Motors",
  legalName: "Pucci Motors Ltda",
  cnpj: "",
  tagline: "Seminovos selecionados com transparência",
  whatsapp: "5515999999999",
  whatsappLabel,
  phone: {
    label: whatsappLabel,
    href: "tel:+5515999999999",
  },
  instagram: {
    handle: "@puccimotors",
    url: "https://www.instagram.com/puccimotors/",
  },
  facebook: "",
  address: {
    line1: "Endereço da loja",
    line2: "Capão Bonito, SP",
    landmark: "",
    maps: "https://www.google.com/maps/search/?api=1&query=Cap%C3%A3o+Bonito+SP",
  },
  city: "Capão Bonito, SP",
  gestorUrl: "/lp-motors/",
  assets: {
    logo: "/brand/logo.svg",
    ogImage: "/brand/logo.svg",
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
    { value: 1200, label: "Clientes atendidos" },
    { value: 0, label: "Carros no catálogo" },
  ],
  truths: [
    {
      title: "Preço no anúncio",
      text: "O valor que você vê é o valor da loja. Sem teatro de “chama no privado pra saber”.",
    },
    {
      title: "Foto do carro real",
      text: "Cada unidade é a que está na Pucci. Sem banco de imagem, sem carro de outro estado.",
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
      desc: "Simulamos na hora com os bancos parceiros.",
      tags: ["Até 60x", "Bancos parceiros"],
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
    "A Pucci Motors só anuncia nos canais oficiais da loja.",
    `WhatsApp da loja: ${whatsappLabel} — qualquer outro número, desconfie.`,
    "Prefere segurança? Venha até a loja.",
  ],
  paymentOptions: [
    "À vista",
    "Financiamento em até 60x",
    "Cartão em até 36x",
    "Troca + financiamento",
    "Ainda não sei — quero simular",
  ],
} as const;
