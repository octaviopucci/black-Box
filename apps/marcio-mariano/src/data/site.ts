export const site = {
  name: 'Márcio Mariano',
  brand: 'Márcio Mariano Imóveis',
  legalName: 'Márcio Mariano Negócios Imobiliários',
  tagline: 'A certeza dos melhores negócios',
  headline: 'Patrimônio com quem entende da região',
  description:
    'Compra, venda, locação e administração de imóveis em Capão Bonito e região — com a solidez de uma família no mercado desde 1955.',
  since: 1955,
  about: [
    'A comercialização e administração de imóveis já é tradição na família Santos Mariano desde que chegaram ao Brasil em 1955. Vindos de Portugal, adquiriram seus primeiros imóveis na região de Capão Bonito e, desde então, passam de geração em geração a arte de realizar negócios imobiliários com ética.',
    'Hoje a empresa está situada em sede própria na Rua Silva Jardim, 773, Centro, com uma equipe preparada para orientar cada etapa — da busca ao fechamento — com transparência e segurança.',
    'Mais que alugar, vender e administrar: a qualidade de vida e a felicidade de clientes e colaboradores estão acima de tudo.',
  ],
  mission:
    'Ser a melhor empresa no setor imobiliário da região, com honestidade, competência, transparência, verdade, bom senso e ética.',
  address: {
    street: 'Rua Silva Jardim, 773',
    district: 'Centro',
    city: 'Capão Bonito',
    state: 'SP',
    zip: '18300-020',
    full: 'Rua Silva Jardim, 773 — Centro — Capão Bonito/SP, 18300-020',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Silva+Jardim,+773,+Centro,+Cap%C3%A3o+Bonito+SP',
  email: 'falecom@marciomariano.com.br',
  hours: {
    weekdays: 'Segunda a sexta · 08:30 às 18:00',
    saturday: 'Sábados · 08:30 às 12:00',
    plantao: 'Plantão de vendas também em sábados e feriados',
  },
  phones: [
    {
      label: '(15) 99732-5626',
      href: 'tel:+5515997325626',
      role: 'Plantão de vendas',
      whatsapp: '5515997325626',
    },
    {
      label: '(15) 99662-8581',
      href: 'tel:+5515996628581',
      role: 'Plantão de vendas',
      whatsapp: '5515996628581',
    },
    {
      label: '(15) 99664-8902',
      href: 'tel:+5515996648902',
      role: 'Aluguel',
      whatsapp: '5515996648902',
    },
    {
      label: '(15) 99631-6229',
      href: 'tel:+5515996316229',
      role: 'Aluguel',
      whatsapp: '5515996316229',
    },
    {
      label: '(15) 99714-0635',
      href: 'tel:+5515997140635',
      role: 'Atendimento',
      whatsapp: '5515997140635',
    },
    {
      label: '(15) 3542-3780',
      href: 'tel:+551535423780',
      role: 'Escritório',
      whatsapp: null,
    },
  ],
  whatsapp: {
    number: '5515997325626',
    rentNumber: '5515996648902',
    message: 'Olá! Vim pelo site da Márcio Mariano e gostaria de atendimento.',
  },
  social: {
    instagram: 'https://www.instagram.com/marciomarianoimoveis',
    facebook: 'https://www.facebook.com/imoveismariano/',
  },
  cities: [
    'Capão Bonito',
    'Guapiara',
    'Ribeirão Grande',
    'Apiaí',
    'Itaberá',
    'Itapetininga',
    'Sorocaba',
    'Itanhaém',
  ],
  propertyTypes: ['Residencial', 'Comercial', 'Terreno', 'Chácara', 'Sítio', 'Fazenda'],
  services: [
    {
      slug: 'locacao',
      title: 'Locação',
      description:
        'Locamos seu imóvel com cadastro criterioso, acompanhamento e segurança para locador e locatário.',
    },
    {
      slug: 'administracao',
      title: 'Administração',
      description:
        'Gestão completa do patrimônio: cobrança, contas, vistoria, manutenção e redução de inadimplência.',
    },
    {
      slug: 'compra-venda',
      title: 'Compra e venda',
      description:
        'Negociação justa, esclarecimento total às partes e fechamento seguro em cada detalhe.',
    },
    {
      slug: 'avaliacao',
      title: 'Avaliação',
      description:
        'Laudos urbanos e rurais com base nas normas técnicas da ABNT e credenciamento CAAVI.',
    },
    {
      slug: 'assessoria',
      title: 'Assessoria',
      description:
        'Acompanhamento documental e orientação completa para uma transação sem surpresas.',
    },
    {
      slug: 'investimento',
      title: 'Investimento',
      description:
        'Análise de rentabilidade e orientação para quem busca patrimônio com retorno consistente.',
    },
  ],
  values: [
    { title: 'Honestidade', text: 'Cada valor, cada cláusula e cada expectativa no lugar certo.' },
    { title: 'Transparência', text: 'As duas partes merecem clareza antes de assinar.' },
    { title: 'Ética', text: 'Tradição familiar que se mede em reputação, não em atalhos.' },
    { title: 'Proximidade', text: 'Atendimento humano, local e disponível quando importa.' },
  ],
  logo: `${import.meta.env.BASE_URL}logo.png`,
  originalSite: 'https://www.marciomariano.com.br/',
} as const

export function whatsappUrl(
  message: string = site.whatsapp.message,
  number: string = site.whatsapp.number,
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function rentWhatsappUrl(message: string) {
  return whatsappUrl(message, site.whatsapp.rentNumber)
}
