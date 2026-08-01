export const site = {
  name: 'G&L Fest',
  fullName: 'G&L Fest Locações',
  brand: 'G&L Fest',
  tagline: 'Locação · Infláveis · Decoração',
  headline: 'Tudo para a festa perfeita, em um só lugar.',
  description:
    'G&L Fest Locações — brinquedos infláveis, decoração temática, balões personalizados e barraquinhas para aniversários, batizados, casamentos e eventos corporativos.',
  promise: 'Estrutura completa, criatividade e carinho em cada detalhe do seu evento.',
  email: 'contato@glfest.com.br',
  phone: {
    label: '(61) 99954-9085',
    href: 'tel:+5561999549085',
  },
  whatsapp: {
    number: '5561999549085',
    message:
      'Olá, G&L Fest! Vim pelo site e quero orçar locação para o meu evento.',
  },
  city: 'Brasília – DF',
  years: '2015',
  nav: [
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Momentos', href: '#momentos' },
    { label: 'Como funciona', href: '#como' },
    { label: 'Orçar', href: '#orcar' },
  ],
  heroImage:
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=2000&q=80',
} as const

export type CatalogItem = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  accent: string
}

export const catalog: CatalogItem[] = [
  {
    id: 'inflaveis',
    title: 'Brinquedos infláveis',
    line: 'Pula-pula, tobogãs e castelos',
    detail:
      'Estruturas seguras e coloridas para aniversários e eventos — montagem, operação e desmontagem inclusas.',
    image:
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=1400&q=80',
    accent: 'Diversão',
  },
  {
    id: 'decoracao',
    title: 'Decoração temática',
    line: 'Balões, cores e cenário',
    detail:
      'Decoração personalizada com balões e composição temática para transformar o espaço no universo da festa.',
    image:
      'https://images.unsplash.com/photo-1527529482833-47aceed5d5b6?auto=format&fit=crop&w=1400&q=80',
    accent: 'Cenário',
  },
  {
    id: 'barraquinhas',
    title: 'Barraquinhas & doces',
    line: 'Pipoca, algodão e sabor',
    detail:
      'Barraquinhas de pipoca, algodão-doce e mesas de jogos — o toque que completa a experiência dos convidados.',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1400&q=80',
    accent: 'Sabor',
  },
]

export const moments = [
  {
    title: 'Aniversários',
    line: 'Do primeiro ano ao chá de revelação — a festa do jeito que a família sonhou.',
  },
  {
    title: 'Batizados & chá de fraldas',
    line: 'Celebrações delicadas com estrutura completa e visual acolhedor.',
  },
  {
    title: 'Casamentos & formaturas',
    line: 'Espaços memoráveis para momentos que pedem presença e cuidado.',
  },
  {
    title: 'Corporativos',
    line: 'Ativações e confraternizações com montagem ágil e identidade da marca.',
  },
] as const

export const steps = [
  {
    step: '01',
    title: 'Conte a festa',
    description: 'Data, local, faixa etária e o clima que você quer. A gente escuta o brief.',
  },
  {
    step: '02',
    title: 'Monte o pacote',
    description: 'Infláveis, decoração e barraquinhas sob medida — orçamento claro no WhatsApp.',
  },
  {
    step: '03',
    title: 'Entrega e festa',
    description: 'Montagem, operação e desmontagem. Você aproveita. A gente cuida do resto.',
  },
] as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
