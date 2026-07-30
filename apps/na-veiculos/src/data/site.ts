export const site = {
  name: 'NA Veículos',
  legalName: 'N.A. Veiculos Ltda',
  brand: 'N.A.',
  brandFull: 'NA VEÍCULOS',
  mantra: 'Trajetória',
  tagline: 'Transformamos seu sonho em realidade',
  headline: 'Seu sonho está aqui.',
  description:
    'NA Veículos — novos e seminovos em Capão Bonito/SP. Catálogo real com valores, descrição completa, financiamento, trocas e consignação. Atendimento pelo WhatsApp.',
  promise:
    'Estoque real da loja, transparência no valor e negociação humana — do primeiro olhar à entrega das chaves.',
  instagram: 'https://www.instagram.com/n.aveiculos__/',
  instagramHandle: '@n.aveiculos__',
  facebook: 'https://www.facebook.com/profile.php?id=100008066959463',
  linktree: 'https://linktr.ee/naveiculos_',
  phone: {
    label: '(15) 3542-3229',
    href: 'tel:+551535423229',
  },
  whatsapp: {
    label: '(15) 99653-2750',
    number: '5515996532750',
    message: 'Olá, NA Veículos! Vim pelo site e quero saber mais sobre um veículo.',
  },
  address: {
    street: 'Rua Altino Arantes, 635',
    district: 'Centro',
    city: 'Capão Bonito',
    state: 'SP',
    cep: '18300-290',
    landmark: 'Próximo às Lojas Cem',
    maps: 'https://www.google.com/maps/search/?api=1&query=Rua+Altino+Arantes+635+Cap%C3%A3o+Bonito+SP',
  },
  city: 'Capão Bonito/SP',
  followers: '6.1k',
  posts: '1.7k+',
  cnpj: '49.138.934/0001-83',
  nav: [
    { label: 'Disponíveis', href: '#pista' },
    { label: 'Vendidos', href: '#entregas' },
    { label: 'Negócio', href: '#negocio' },
    { label: 'Loja', href: '#loja' },
    { label: 'Contato', href: '#contato' },
  ],
  manifesto: [
    'Há quem procure um carro.',
    'Há quem procure o próximo capítulo.',
    'Na NA, os dois se encontram no asfalto.',
  ],
  services: [
    {
      id: 'financiamento',
      title: 'Financiamento em até 60x',
      line: 'Taxas pensadas para fechar',
      detail:
        'Simulação na hora, crédito sob medida e clareza do primeiro ao último boleto — inclusive via Mercado Pago / Mercado Livre.',
    },
    {
      id: 'cartao',
      title: 'Cartão em até 36x',
      line: 'Parcelamento direto',
      detail:
        'Flexibilidade para quem prefere cartão de crédito sem abrir mão do veículo certo.',
    },
    {
      id: 'troca',
      title: 'Trocas & consignação',
      line: 'Seu usado entra na conta',
      detail:
        'Avaliamos seu veículo com transparência e colocamos a consignação para trabalhar a seu favor.',
    },
    {
      id: 'presenca',
      title: 'Loja física',
      line: 'Negocie com quem você vê',
      detail:
        'Rua Altino Arantes, 635 — Centro. Capão Bonito/SP. Sem anúncio fora do Instagram e Facebook oficiais.',
    },
  ],
  warnings: [
    'Não anunciamos fora do Instagram e Facebook oficiais.',
    'WhatsApp oficial: (15) 99653-2750.',
    'Na dúvida, venha até a loja física.',
  ],
} as const

export function whatsappHref(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsapp.message)
  return `https://wa.me/${site.whatsapp.number}?text=${text}`
}

export function vehicleWhatsApp(title: string, priceLabel?: string) {
  const priceBit = priceLabel ? ` (${priceLabel})` : ''
  return whatsappHref(
    `Olá, NA Veículos! Vim pelo site e tenho interesse no ${title}${priceBit}.`,
  )
}
