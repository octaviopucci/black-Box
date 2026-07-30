export const site = {
  name: 'NA Veículos',
  legalName: 'N.A. Veiculos Ltda',
  brand: 'NA',
  brandFull: 'NA VEÍCULOS',
  tagline: 'Transformamos seu sonho em realidade',
  headline: 'Seu sonho está aqui.',
  lead: 'Novos e seminovos em Capão Bonito',
  description:
    'NA Veículos em Capão Bonito/SP: catálogo de novos e seminovos com valores, opcionais, financiamento, trocas e consignação. Atendimento pelo WhatsApp (15) 99653-2750.',
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
    message: 'Olá! Vim pelo site da NA Veículos e quero saber mais sobre os carros disponíveis.',
  },
  address: {
    street: 'Rua Altino Arantes, 635',
    district: 'Centro',
    city: 'Capão Bonito',
    state: 'SP',
    cep: '18300-290',
    landmark: 'Perto das Lojas Cem',
    maps: 'https://www.google.com/maps/search/?api=1&query=Rua+Altino+Arantes+635+Cap%C3%A3o+Bonito+SP',
  },
  city: 'Capão Bonito/SP',
  followers: '6,1 mil',
  cnpj: '49.138.934/0001-83',
  nav: [
    { label: 'Estoque', href: '#estoque' },
    { label: 'Entregas', href: '#entregas' },
    { label: 'Como comprar', href: '#como-comprar' },
    { label: 'Loja', href: '#loja' },
    { label: 'WhatsApp', href: '#falar' },
  ],
  truths: [
    {
      title: 'Preço no anúncio',
      text: 'O valor que você vê é o valor da loja. Sem teatro de “chama no privado pra saber”.',
    },
    {
      title: 'Foto do carro real',
      text: 'Cada unidade é a que está na NA. Sem banco de imagem, sem carro de outro estado.',
    },
    {
      title: 'Negociação humana',
      text: 'Financiamento, troca ou consignação — a gente fecha olhando o seu caso, não um roteiro.',
    },
  ],
  services: [
    {
      id: 'financiamento',
      title: 'Financiamento em até 60x',
      detail:
        'Simulamos na hora. Também dá para usar crédito do Mercado Pago / Mercado Livre.',
    },
    {
      id: 'cartao',
      title: 'Cartão em até 36x',
      detail: 'Para quem prefere parcelar no cartão e levar o carro sem espera longa de banco.',
    },
    {
      id: 'troca',
      title: 'Troca do seu usado',
      detail: 'Avaliamos o que você tem hoje e abatemos na negociação com transparência.',
    },
    {
      id: 'consignacao',
      title: 'Consignação',
      detail: 'Quer vender com a gente? Deixamos o carro na loja e cuidamos da exposição.',
    },
  ],
  warnings: [
    'A NA só anuncia no Instagram e no Facebook oficiais.',
    'WhatsApp da loja: (15) 99653-2750 — qualquer outro número, desconfie.',
    'Prefere segurança? Venha até a Rua Altino Arantes, 635.',
  ],
} as const

export function whatsappHref(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsapp.message)
  return `https://wa.me/${site.whatsapp.number}?text=${text}`
}

export function vehicleWhatsApp(title: string, priceLabel?: string) {
  const priceBit = priceLabel ? ` por ${priceLabel}` : ''
  return whatsappHref(
    `Olá! Vim pelo site e quero saber sobre o ${title}${priceBit}. Ainda está disponível?`,
  )
}
