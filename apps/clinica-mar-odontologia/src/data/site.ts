export const site = {
  name: 'Clínica Mar Odontologia',
  shortName: 'Mar',
  tagline: 'Odontologia e Estética · Belo Horizonte',
  promise:
    'Planejamento ortodôntico e estético que cuida da saúde do seu sorriso — não só da aparência.',
  intro:
    'Na Clínica Mar, cada consulta começa com escuta e avaliação. Ortodontia, reabilitação estética e orientação de saúde bucal — com acompanhamento próximo do início ao resultado.',
  niche: 'Clínica odontológica e estética',
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
  hero: '/instagram/post-7.jpg',
  logoCard: '/instagram/post-8.jpg',
  transformation: '/instagram/post-2.jpg',
  campaign: '/instagram/post-1.jpg',
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
    detail:
      'O planejamento ortodôntico vai além da estética: corrige a forma como os dentes se encaixam, protege a articulação temporomandibular e facilita a higienização diária — pilares para saúde bucal a longo prazo.',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'reabilitacao',
    title: 'Reabilitação estética',
    line: 'Transformação pensada nos detalhes — do alinhamento à aparência final do sorriso.',
    detail:
      'A diferença que um planejamento ortodôntico e estético faz na reabilitação do paciente começa nos detalhes. Cada etapa é pensada para entregar um sorriso funcional, saudável e harmonioso.',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'manutencao',
    title: 'Manutenção de aparelho',
    line: 'Consultas regulares mantêm o tratamento evoluindo — sem atrasos no resultado.',
    detail:
      'As consultas de manutenção são essenciais para que o tratamento continue evoluindo da forma correta, evitando atrasos nos resultados. Cuidar do sorriso hoje é chegar mais rápido ao resultado que você deseja.',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'prevencao',
    title: 'Saúde e prevenção',
    line: 'Orientação sobre higiene, hálito e cuidados do dia a dia — com avaliação quando necessário.',
    detail:
      'Escovar os dentes é essencial, mas nem sempre basta. Mau hálito, língua, gengiva e outros fatores precisam de avaliação profissional — o chiclete apenas disfarça o problema por alguns minutos.',
    source: 'Instagram @clinicamarodontologia',
  },
] as const

export const processSteps = [
  {
    step: '01',
    title: 'Contato',
    body: 'Envie uma mensagem pelo WhatsApp ou passe na recepção. Conte o que te incomoda ou o que deseja para o seu sorriso.',
  },
  {
    step: '02',
    title: 'Avaliação',
    body: 'Consulta para entender seu caso, examinar oclusão, saúde bucal e expectativas — base para um plano realista.',
  },
  {
    step: '03',
    title: 'Plano de tratamento',
    body: 'Planejamento ortodôntico e/ou estético alinhado às suas necessidades — com transparência sobre etapas e cuidados.',
  },
  {
    step: '04',
    title: 'Acompanhamento',
    body: 'Manutenções periódicas, orientação de higiene e suporte durante todo o tratamento até o resultado.',
  },
] as const

export const educationPosts = [
  {
    id: 'halito',
    title: 'Mau hálito vai além da escovação',
    excerpt:
      'A causa pode estar na língua, na gengiva ou em outros fatores que precisam de avaliação. Agende e descubra a verdadeira origem.',
    image: '/instagram/post-5.jpg',
    permalink: 'https://www.instagram.com/p/DbLfiySid8e/',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'lingua',
    title: 'Raspador de língua: faz diferença?',
    excerpt:
      'Ajuda a remover resíduos e bactérias, contribuindo para hálito mais fresco — mas complementa escovação e fio dental, não substitui.',
    image: '/instagram/post-3.jpg',
    permalink: 'https://www.instagram.com/p/DbLfixNCN7t/',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'festa',
    title: 'Cuidados na hora de comer',
    excerpt:
      'Alimentos como pé de moleque e grãos de pipoca exigem atenção para evitar danos aos dentes — aproveite sem abrir mão do cuidado.',
    image: '/instagram/post-4.jpg',
    permalink: 'https://www.instagram.com/p/DbLfiyLiHk3/',
    source: 'Instagram @clinicamarodontologia',
  },
  {
    id: 'aparelho',
    title: 'Manutenção do aparelho',
    excerpt:
      'Já fez a manutenção deste mês? Consultas regulares evitam atrasos e mantêm seu tratamento no caminho certo.',
    image: '/instagram/post-6.jpg',
    permalink: 'https://www.instagram.com/p/DbLZlLCiikm/',
    source: 'Instagram @clinicamarodontologia',
  },
] as const

export const campaign = {
  title: 'Sorriso Premiado',
  headline: 'Indique quem ainda não conhece a clínica.',
  body: 'Seu sorriso pode trazer um prêmio incrível: indique amigos e familiares e concorra a um Galaxy Buds Core Samsung. Quanto mais indicar, mais chances de ganhar.',
  cta: 'Passe na recepção e confira as regras da campanha.',
  image: '/instagram/post-1.jpg',
  permalink: 'https://www.instagram.com/p/DcMWsZ4BOon/',
  source: 'Instagram @clinicamarodontologia',
} as const

export const transformationQuote = {
  headline: 'O sorriso que você sempre quis começa nos detalhes.',
  body: 'Alinhar e nivelar os dentes não serve apenas para deixar o sorriso mais bonito — é fundamental para melhorar a oclusão, proteger a articulação, facilitar a higienização e garantir a saúde bucal a longo prazo.',
  cta: 'Tem dúvidas sobre como cuidar melhor do seu sorriso? Agende sua avaliação.',
  source: 'Instagram @clinicamarodontologia',
} as const

export const aboutPoints = [
  {
    title: 'Odontologia e estética',
    body: 'Tratamentos que unem função e aparência — do aparelho à reabilitação do sorriso.',
  },
  {
    title: 'Atendimento em BH',
    body: 'Av. Contagem, 1451 — com horário estendido de segunda a sábado para encaixar na sua rotina.',
  },
  {
    title: 'Conteúdo e proximidade',
    body: 'Dicas de saúde bucal, lembretes de manutenção e campanhas exclusivas no Instagram oficial.',
  },
] as const

export const feedPosts = [
  {
    id: 1,
    image: '/instagram/post-1.jpg',
    alt: 'Campanha Sorriso Premiado — indique amigos na Clínica Mar',
    caption: 'Indique amigos e concorra a Galaxy Buds Core Samsung.',
    permalink: 'https://www.instagram.com/p/DcMWsZ4BOon/',
  },
  {
    id: 2,
    image: '/instagram/post-2.jpg',
    alt: 'Resultado de reabilitação ortodôntica e estética',
    caption: 'Planejamento ortodôntico e estético na reabilitação.',
    permalink: 'https://www.instagram.com/p/DbLftqIlnNL/',
  },
  {
    id: 6,
    image: '/instagram/post-6.jpg',
    alt: 'Lembrete de manutenção do aparelho ortodôntico',
    caption: 'Manutenção mensal do aparelho.',
    permalink: 'https://www.instagram.com/p/DbLZlLCiikm/',
  },
  {
    id: 9,
    image: '/instagram/post-9.jpg',
    alt: 'Agende sua manutenção — Clínica Mar Odontologia',
    caption: 'Agende e mantenha o tratamento no caminho certo.',
    permalink: 'https://www.instagram.com/p/DZxX2OXCMbY/',
  },
  {
    id: 7,
    image: '/instagram/post-7.jpg',
    alt: 'Equipe Clínica Mar Odontologia',
    caption: 'Conteúdo educativo no Instagram.',
    permalink: 'https://www.instagram.com/p/DaimSkzp8O4/',
  },
  {
    id: 5,
    image: '/instagram/post-5.jpg',
    alt: 'Dicas sobre saúde bucal e mau hálito',
    caption: 'Mau hálito: causas além da escovação.',
    permalink: 'https://www.instagram.com/p/DbLfiySid8e/',
  },
] as const

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(message ?? site.contact.whatsappMessage)
  return `https://wa.me/${site.contact.whatsapp}?text=${text}`
}
