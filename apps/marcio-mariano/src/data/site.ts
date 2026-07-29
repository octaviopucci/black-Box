export const site = {
  name: 'Márcio Mariano',
  legalName: 'Márcio Mariano Negócios Imobiliários',
  tagline: 'A certeza dos melhores negócios',
  headline: 'Tradição que constrói patrimônio',
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
  address: 'Rua Silva Jardim, 773 — Centro — Capão Bonito/SP, 18300-020',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Silva+Jardim,+773,+Centro,+Cap%C3%A3o+Bonito+SP',
  email: 'falecom@marciomariano.com.br',
  hours: {
    weekdays: 'Segunda a sexta · 08:30 às 18:00',
    saturday: 'Sábados · 08:30 às 12:00',
  },
  phones: [
    {
      label: '(15) 99732-5626',
      href: 'tel:+5515997325626',
      role: 'Plantão de vendas',
      whatsapp: true,
    },
    {
      label: '(15) 99662-8581',
      href: 'tel:+5515996628581',
      role: 'Plantão de vendas',
      whatsapp: true,
    },
    {
      label: '(15) 99664-8902',
      href: 'tel:+5515996648902',
      role: 'Aluguel',
      whatsapp: true,
    },
    {
      label: '(15) 99631-6229',
      href: 'tel:+5515996316229',
      role: 'Aluguel',
      whatsapp: true,
    },
    {
      label: '(15) 3542-3780',
      href: 'tel:+551535423780',
      role: 'Escritório',
      whatsapp: false,
    },
  ],
  whatsapp: {
    number: '5515997325626',
    message: 'Olá! Vim pelo site da Márcio Mariano e gostaria de atendimento.',
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
  services: [
    {
      title: 'Locação',
      description: 'Locamos seu imóvel com segurança, agilidade e acompanhamento completo.',
    },
    {
      title: 'Administração',
      description: 'Gestão profissional do seu patrimônio com competência e transparência.',
    },
    {
      title: 'Compra e venda',
      description: 'Negociação justa, esclarecimento total às partes e fechamento seguro.',
    },
    {
      title: 'Avaliação',
      description: 'Laudos e avaliações com base nas normas técnicas da ABNT.',
    },
    {
      title: 'Assessoria',
      description: 'Tudo o que você precisa para uma transação imobiliária sem surpresas.',
    },
    {
      title: 'Investimento',
      description: 'Análise de rentabilidade e plano sob medida para o seu capital.',
    },
  ],
  logo: `${import.meta.env.BASE_URL}logo.png`,
  originalSite: 'https://www.marciomariano.com.br/',
} as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
