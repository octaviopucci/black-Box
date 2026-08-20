export const site = {
  name: 'Clínica Mar Odontologia',
  shortName: 'Mar',
  tagline: 'Odontologia em Belo Horizonte',
  promise:
    'Planejamento ortodôntico e estético que cuida da saúde do seu sorriso — não só da aparência.',
  niche: 'Clínica odontológica',
  instagram: {
    handle: 'clinicamarodontologia',
    url: 'https://www.instagram.com/clinicamarodontologia',
    followers: 594,
  },
  contact: {
    phone: '(31) 99431-9181',
    whatsapp: '5531994319181',
    whatsappMessage:
      'Olá! Vi o site da Clínica Mar e gostaria de agendar uma avaliação.',
  },
  address: {
    street: 'Avenida Contagem, 1451',
    city: 'Belo Horizonte',
    state: 'MG',
    cep: '31080-000',
    full: 'Avenida Contagem, 1451 — Belo Horizonte, MG',
    mapsQuery: 'Clínica Mar Odontologia, Avenida Contagem 1451, Belo Horizonte',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Mar+Odontologia+Avenida+Contagem+1451+Belo+Horizonte',
  },
  hours: [
    { days: 'Segunda a quinta', time: '8h às 19h' },
    { days: 'Sexta', time: '8h às 18h' },
    { days: 'Sábado', time: '8h às 13h' },
    { days: 'Domingo', time: 'Fechado' },
  ],
  source: 'Instagram @clinicamarodontologia',
} as const

export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-2.jpg',
  transformation: '/instagram/post-2.jpg',
  gallery: [
    '/instagram/post-1.jpg',
    '/instagram/post-2.jpg',
    '/instagram/post-6.jpg',
    '/instagram/post-9.jpg',
    '/instagram/post-7.jpg',
    '/instagram/post-5.jpg',
  ],
} as const

export const careAreas = [
  {
    id: 'ortodontia',
    title: 'Ortodontia',
    line: 'Alinhar e nivelar os dentes melhora a oclusão, protege a articulação e facilita a higienização.',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'reabilitacao',
    title: 'Reabilitação estética',
    line: 'Planejamento ortodôntico e estético pensado para saúde bucal a longo prazo.',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'manutencao',
    title: 'Manutenção de aparelho',
    line: 'Consultas regulares mantêm o tratamento evoluindo — sem atrasos no resultado.',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'prevencao',
    title: 'Saúde e prevenção',
    line: 'Orientação sobre higiene, hálito e cuidados do dia a dia — com avaliação quando necessário.',
    source: 'Instagram @clinicamarodontologia',
  },
] as const

export const transformationQuote = {
  headline: 'O sorriso que você sempre quis começa nos detalhes.',
  body: 'Alinhar e nivelar os dentes não serve apenas para deixar o sorriso mais bonito — é fundamental para melhorar a oclusão, proteger a articulação, facilitar a higienização e garantir a saúde bucal a longo prazo.',
  source: 'Instagram @clinicamarodontologia',
} as const

export const feedPosts = [
  {
    id: 1,
    image: '/instagram/post-1.jpg',
    alt: 'Campanha Sorriso Premiado — indique amigos na Clínica Mar',
    permalink: 'https://www.instagram.com/p/DcMWsZ4BOon/',
  },
  {
    id: 2,
    image: '/instagram/post-2.jpg',
    alt: 'Resultado de reabilitação ortodôntica e estética',
    permalink: 'https://www.instagram.com/p/DbLftqIlnNL/',
  },
  {
    id: 6,
    image: '/instagram/post-6.jpg',
    alt: 'Lembrete de manutenção do aparelho ortodôntico',
    permalink: 'https://www.instagram.com/p/DbLZlLCiikm/',
  },
  {
    id: 9,
    image: '/instagram/post-9.jpg',
    alt: 'Agende sua manutenção — Clínica Mar Odontologia',
    permalink: 'https://www.instagram.com/p/DZxX2OXCMbY/',
  },
  {
    id: 7,
    image: '/instagram/post-7.jpg',
    alt: 'Conteúdo educativo da Clínica Mar no Instagram',
    permalink: 'https://www.instagram.com/p/DaimSkzp8O4/',
  },
  {
    id: 5,
    image: '/instagram/post-5.jpg',
    alt: 'Dicas sobre saúde bucal e mau hálito',
    permalink: 'https://www.instagram.com/p/DbLfiySid8e/',
  },
] as const

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(message ?? site.contact.whatsappMessage)
  return `https://wa.me/${site.contact.whatsapp}?text=${text}`
}
