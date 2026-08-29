import { asset, site, whatsappUrl } from '../../data/site'

export { asset, site, whatsappUrl }

export function v2Asset(file: string) {
  return asset(`v2/${file.replace(/^v2\//, '')}`)
}

export const v2Stats = [
  { value: `+${site.years}`, label: 'Anos de experiência' },
  { value: site.followers, label: 'Seguidoras no Instagram' },
  { value: '2', label: 'Trilhas de formação' },
  { value: 'RT', label: 'Método de marcação' },
] as const

export const v2ServiceHighlights = [
  {
    id: 'design',
    name: 'Design de sobrancelha',
    line: 'Leitura do rosto e método RT.',
    image: 'design-sobrancelha.jpg',
    imageAlt: 'Antes e depois de design de sobrancelha',
    href: '/servicos#design',
  },
  {
    id: 'spa',
    name: 'Spa labial',
    line: 'Hidratação e brilho nos lábios.',
    image: 'spa-labial.jpg',
    imageAlt: 'Spa labial com acabamento glossy',
    href: '/servicos#spa',
  },
  {
    id: 'experiencia',
    name: 'Experiência',
    line: 'Acolhimento e mimo no studio.',
    image: 'experiencia-cafe.jpg',
    imageAlt: 'Experiência com café e mimo para clientes',
    href: '#galeria',
  },
  {
    id: 'tintura',
    name: 'Tintura',
    line: 'Cor alinhada ao tom do olhar.',
    image: 'tintura.jpg',
    imageAlt: 'Antes e depois de tintura',
    href: '/servicos#tintura',
  },
  {
    id: 'henna',
    name: 'Henna ombré',
    line: 'Preenchimento com efeito ombré.',
    image: 'henna-ombre.jpg',
    imageAlt: 'Resultado de henna ombré',
    href: '/servicos#henna',
  },
  {
    id: 'coloracao',
    name: 'Design com coloração',
    line: 'Definição alinhada ao olhar.',
    image: 'design-coloracao.jpg',
    imageAlt: 'Antes e depois de design com coloração',
    href: '/servicos#coloracao',
  },
  {
    id: 'brow',
    name: 'Brow lamination',
    line: 'Fios alinhados e direcionados.',
    image: 'brow-lamination.jpg',
    imageAlt: 'Antes e depois de brow lamination',
    href: '/servicos#brow',
  },
  {
    id: 'brow-tintura',
    name: 'Brow lamination com tintura',
    line: 'Volume e cor no mesmo protocolo.',
    image: 'brow-lamination-tintura.jpg',
    imageAlt: 'Resultado de brow lamination com tintura',
    href: '/servicos#brow-tintura',
  },
  {
    id: 'costeleta',
    name: 'Epilação costeleta',
    line: 'Acabamento limpo na linha do rosto.',
    image: 'epilacao-costeleta.jpg',
    imageAlt: 'Antes e depois de epilação de costeleta',
    href: '/servicos#costeleta',
  },
  {
    id: 'facial',
    name: 'Epilação facial',
    line: 'Pele lisa e harmonizada.',
    image: 'epilacao-facial.jpg',
    imageAlt: 'Antes e depois de epilação facial',
    href: '/servicos#facial',
  },
] as const

export const v2Testimonials = [
  {
    file: 'depoimento-01.jpg',
    alt: 'Depoimento de aluna sobre o curso no Instagram',
  },
  {
    file: 'depoimento-02.jpg',
    alt: 'Depoimento de aluna sobre o curso iniciante',
  },
  {
    file: 'depoimento-03.jpg',
    alt: 'Depoimento de aluna sobre curso de aperfeiçoamento',
  },
] as const

export const v2Gallery = [
  { file: 'design-sobrancelha.jpg', alt: 'Design de sobrancelha — antes e depois' },
  { file: 'tintura.jpg', alt: 'Tintura — antes e depois' },
  { file: 'henna-ombre.jpg', alt: 'Henna ombré — resultado' },
  { file: 'design-coloracao.jpg', alt: 'Design com coloração — antes e depois' },
  { file: 'brow-lamination.jpg', alt: 'Brow lamination — antes e depois' },
  { file: 'brow-lamination-tintura.jpg', alt: 'Brow lamination com tintura' },
  { file: 'epilacao-costeleta.jpg', alt: 'Epilação costeleta — antes e depois' },
  { file: 'epilacao-facial.jpg', alt: 'Epilação facial — antes e depois' },
  { file: 'spa-labial.jpg', alt: 'Spa labial' },
  { file: 'experiencia-cafe.jpg', alt: 'Experiência — café e mimo' },
  { file: 'experiencia-bancada.jpg', alt: 'Bancada de atendimento preparada' },
  { file: 'experiencia-procedimento.jpg', alt: 'Procedimento de design no studio' },
  { file: 'experiencia-certificado.jpg', alt: 'Entrega de certificado de curso' },
  { file: 'henna-ombre-edicao.jpg', alt: 'Henna ombré — edição de foto' },
] as const
