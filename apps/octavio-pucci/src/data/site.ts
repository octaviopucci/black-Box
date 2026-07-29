export const site = {
  name: 'Octávio Pucci',
  fullName: 'Octávio Pucci Tattoo',
  brand: 'OCTÁVIO PUCCI',
  mantra: 'Predestinado',
  tagline: 'Tatuador · Studio Privado',
  headline: 'Arte que nasce para permanecer.',
  description:
    'Octávio Pucci — tatuador em Capão Bonito/SP. Realismo preto e cinza, coberturas e fine line em studio privado. 12 anos de experiência. Orçamentos pelo WhatsApp.',
  promise: 'Composição autoral, técnica cirúrgica e presença do início ao último traço.',
  instagram: 'https://www.instagram.com/octaviopuccitattoo',
  instagramHandle: '@octaviopuccitattoo',
  phone: {
    label: '(15) 99749-9178',
    href: 'tel:+5515997499178',
  },
  whatsapp: {
    number: '5515997499178',
    message:
      'Olá, Octávio! Vim pelo site e quero orçar um projeto de tatuagem.',
  },
  city: 'Capão Bonito/SP',
  studio: 'Studio Privado · Capão Bonito/SP',
  years: 12,
  followers: '6.8k',
  nav: [
    { label: 'Credo', href: '#credo' },
    { label: 'Linguagens', href: '#linguagens' },
    { label: 'Arquivo', href: '#arquivo' },
    { label: 'Ritual', href: '#ritual' },
    { label: 'Estúdio', href: '#estudio' },
    { label: 'Orçar', href: '#orcar' },
  ],
  manifesto: [
    'Há marcas que você escolhe.',
    'Há marcas que te encontram.',
    'No studio, o destino vira pele.',
  ],
  story: [
    'Doze anos transformando histórias em composição permanente.',
    'Realismo preto e cinza, coberturas sem cara de cobertura, e fine line com precisão de atelier — em um studio privado em Capão Bonito/SP.',
  ],
} as const

export type Language = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  accent: string
}

export const languages: Language[] = [
  {
    id: 'realismo',
    title: 'Realismo preto & cinza',
    line: 'Volume, luz e pele que respira',
    detail:
      'Retratos, simbolismos e grandes fechamentos com lavagem precisa — do primeiro preto sólido ao último branco de luz.',
    image: 'duality-wolf-lion.jpg',
    accent: 'Black & Grey',
  },
  {
    id: 'cobertura',
    title: 'Coberturas & reformas',
    line: 'O passado some. A arte aparece.',
    detail:
      'Coberturas que não entregam o que estava embaixo. Reformas pensadas anatomia a anatomia — desafio técnico, resultado limpo.',
    image: 'cover-lion.jpg',
    accent: 'Cover-up',
  },
  {
    id: 'fineline',
    title: 'Fine line',
    line: 'Traço fino, intenção pesada',
    detail:
      'Linhas delicadas, tipografia e composições leves que pedem pulso firme — elegância sem abrir mão da presença.',
    image: 'memento-vivere.jpg',
    accent: 'Fine Line',
  },
]

export type ArchivePiece = {
  id: string
  title: string
  meta: string
  image: string
  span?: 'tall' | 'wide' | 'square'
}

export const archive: ArchivePiece[] = [
  {
    id: 'hannya',
    title: 'Hannya — fechamento de costas',
    meta: '2 sessões · Black & Grey',
    image: 'back-hannya.jpg',
    span: 'tall',
  },
  {
    id: 'duality',
    title: 'Duality · Lobo & Leão',
    meta: 'Composição vertical · Panturrilha',
    image: 'duality-wolf-lion.jpg',
    span: 'tall',
  },
  {
    id: 'cover',
    title: 'Cobertura · Leão',
    meta: 'Antes → Depois · Braço',
    image: 'cover-lion.jpg',
    span: 'square',
  },
  {
    id: 'memento',
    title: 'Memento Vivere',
    meta: 'Fine line · Antebraço',
    image: 'memento-vivere.jpg',
    span: 'square',
  },
  {
    id: 'wings',
    title: 'Cruz & asas',
    meta: 'Peitoral · Realismo',
    image: 'chest-wings.jpg',
    span: 'square',
  },
  {
    id: 'eye',
    title: 'Cobertura autoral',
    meta: '3 sessões · Composição narrativa',
    image: 'cover-eye.jpg',
    span: 'tall',
  },
  {
    id: 'ouroboros',
    title: 'Ouroboros',
    meta: 'Ciclo · Renovação',
    image: 'ouroboros.jpg',
    span: 'tall',
  },
  {
    id: 'session',
    title: 'Sessão em foco',
    meta: 'Studio privado',
    image: 'session-focus.jpg',
    span: 'tall',
  },
]

export const ritual = [
  {
    step: '01',
    title: 'Ideia',
    description:
      'Você traz a história — homenagem, cobertura, sonho, símbolo. Eu escuto o que precisa viver na pele.',
  },
  {
    step: '02',
    title: 'Arte',
    description:
      'Composição pensada para o seu corpo. Encaixe, fluxo e leitura. Nada genérico. Nada de catálogo.',
  },
  {
    step: '03',
    title: 'Pele',
    description:
      'Sessão com atenção do primeiro ao último traço. Higiene, ritmo e presença — mesmo em 20 horas seguidas.',
  },
  {
    step: '04',
    title: 'Permanência',
    description:
      'Cuidados, cicatrização e o resultado que acompanha a sua vida. A marca fica. A intenção também.',
  },
] as const

export const proofs = [
  {
    text: 'Fechamento de braço em uma única sessão de 20 horas — atenção máxima do primeiro ao último traço.',
    who: 'Sessão marathon',
  },
  {
    text: 'Cobertura em 3 sessões com mais de 80% cicatrizado — sem “cara de cobertura”.',
    who: 'Projeto de reforma',
  },
  {
    text: 'Hannya em fechamento de costas completo em apenas 2 sessões.',
    who: 'Grande composição',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
