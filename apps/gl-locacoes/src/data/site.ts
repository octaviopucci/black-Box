export const site = {
  name: 'G&L Locações',
  fullName: 'G&L Locações de Brinquedos',
  brand: 'G&L',
  slogan: 'Diversão Garantida',
  tagline: 'Locação de brinquedos para festas',
  headline: 'A alegria da criançada, com tranquilidade para os pais.',
  description:
    'G&L Locações de Brinquedos em Capão Bonito e região. Pula-pula, piscina de bolinhas, escorregadores infláveis e toboágua. Reserva pelo WhatsApp.',
  promise:
    'Cada evento é preparado com carinho, responsabilidade e dedicação. Você aproveita. A gente cuida da diversão.',
  instagram: 'https://www.instagram.com/gllocacoes_de_brinquedos/',
  instagramHandle: '@gllocacoes_de_brinquedos',
  city: 'Capão Bonito e região',
  phones: [
    { label: '(15) 99690-5735', href: 'tel:+5515996905735', whatsapp: '5515996905735' },
    { label: '(15) 99785-2089', href: 'tel:+5515997852089', whatsapp: '5515997852089' },
  ],
  whatsapp: {
    number: '5515996905735',
    message:
      'Olá, G&L Locações! Quero reservar brinquedos para minha festa. Podem me ajudar com disponibilidade e valores?',
  },
  nav: [
    { label: 'Brinquedos', href: '#brinquedos' },
    { label: 'Combos', href: '#combos' },
    { label: 'Na festa', href: '#na-festa' },
    { label: 'Como reservar', href: '#reservar' },
    { label: 'FAQ', href: '#faq' },
  ],
} as const

export type Toy = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  tag: string
}

export const toys: Toy[] = [
  {
    id: 'pula-pula-244',
    title: 'Pula-pula 2,44 m',
    line: 'Cabe em praticamente qualquer lugar',
    detail:
      'Ideal para quintais e espaços menores. Rede de proteção, escada e regras claras de uso. Diversão garantida mesmo com pouco espaço.',
    image: 'moments/ig-00.jpg',
    tag: 'Compacto',
  },
  {
    id: 'pula-pula-310',
    title: 'Pula-pula 3,10 m',
    line: 'Mais área para mais risadas',
    detail:
      'O clássico das festas. Ampla área de salto, estrutura reforçada e visual colorido que vira o centro da brincadeira.',
    image: 'moments/ig-07.jpg',
    tag: 'Clássico',
  },
  {
    id: 'piscina-bolinhas',
    title: 'Piscina de bolinhas',
    line: 'Sucesso do começo ao fim da festa',
    detail:
      'Cobertura colorida, rede de proteção e milhares de bolinhas. Perfeita para aniversários, chá de bebê e eventos em Capão Bonito.',
    image: 'moments/ig-11.jpg',
    tag: 'Favorito',
  },
  {
    id: 'escorregador',
    title: 'Escorregador inflável',
    line: 'Atração que eleva qualquer festa',
    detail:
      'Do modelo compacto ao grande premium. Cores vibrantes, segurança e aquela emoção que as crianças pedem para repetir.',
    image: 'moments/ig-02.jpg',
    tag: 'Premium',
  },
  {
    id: 'toboagua',
    title: 'Toboágua',
    line: 'Diversão em grande estilo',
    detail:
      'Atração perfeita para dias de sol e festas com piscina. Segurança, alegria e aquele momento que vira memória.',
    image: 'moments/ig-10.jpg',
    tag: 'Verão',
  },
  {
    id: 'combo',
    title: 'Combo da Alegria',
    line: 'Pula-pula + piscina de bolinhas',
    detail:
      'O pacote que resolve a festa. Duas atrações, uma montagem, diversão do primeiro convidado ao último abraço.',
    image: 'moments/ig-01.jpg',
    tag: 'Combo',
  },
]

export const moments = [
  {
    id: 'ig-01',
    file: 'moments/ig-01.jpg',
    caption: 'Combo perfeito: pula-pula + piscina de bolinhas',
    href: 'https://www.instagram.com/p/DbbIGf7kTqa/',
  },
  {
    id: 'ig-03',
    file: 'moments/ig-03.jpg',
    caption: 'Evento preparado com carinho e responsabilidade',
    href: 'https://www.instagram.com/p/Dau-VbcEZxP/',
  },
  {
    id: 'ig-05',
    file: 'moments/ig-05.jpg',
    caption: 'Cada montagem é o começo de um dia de alegria',
    href: 'https://www.instagram.com/p/DZ51ilDiQ04/',
  },
  {
    id: 'ig-02',
    file: 'moments/ig-02.jpg',
    caption: 'Diversão que cria memórias',
    href: 'https://www.instagram.com/p/DbT9VssCZzc/',
  },
  {
    id: 'ig-07',
    file: 'moments/ig-07.jpg',
    caption: 'Combo da Alegria montado e pronto',
    href: 'https://www.instagram.com/p/DZ26SNxFPDK/',
  },
  {
    id: 'ig-10',
    file: 'moments/ig-10.jpg',
    caption: 'Toboágua: atração em grande estilo',
    href: 'https://www.instagram.com/p/DZNTUQFRpA5/',
  },
  {
    id: 'ig-00',
    file: 'moments/ig-00.jpg',
    caption: 'Pula-pula 2,44 m em qualquer espaço',
    href: 'https://www.instagram.com/p/DbbIdbyxZBG/',
  },
  {
    id: 'ig-04',
    file: 'moments/ig-04.jpg',
    caption: 'Equipe G&L na rua: diversão garantida',
    href: 'https://www.instagram.com/p/DarFQLdNfNP/',
  },
] as const

export const steps = [
  {
    step: '01',
    title: 'Chame no WhatsApp',
    description:
      'Conte a data, o local e quantas crianças vêm. A gente indica o brinquedo certo para o espaço.',
  },
  {
    step: '02',
    title: 'Escolha o pacote',
    description:
      'Pula-pula, piscina, escorregador, toboágua ou combo. Orçamento claro, sem surpresa na hora da festa.',
  },
  {
    step: '03',
    title: 'Montagem e festa',
    description:
      'Levamos, montamos e desmontamos em Capão Bonito e região. Você recebe os convidados. A diversão já está pronta.',
  },
] as const

export const safety = [
  'Proibido pendurar na rede de proteção',
  'Retirar o calçado antes de entrar',
  'Respeitar o limite de peso (60 kg no pula-pula)',
  'Não entrar com comidas e bebidas',
  'Evitar pisar na lona colorida',
] as const

export const faqs = [
  {
    q: 'Vocês atendem só Capão Bonito?',
    a: 'Atendemos Capão Bonito e toda a região. Chame no WhatsApp com o endereço do evento que confirmamos disponibilidade e deslocamento.',
  },
  {
    q: 'Qual brinquedo cabe no meu quintal?',
    a: 'O pula-pula de 2,44 m foi feito para espaços menores. Para áreas amplas, indicamos o 3,10 m, os escorregadores ou o Combo da Alegria.',
  },
  {
    q: 'A montagem e a desmontagem estão inclusas?',
    a: 'Sim. Levamos a diversão até você, montamos com cuidado e recolhemos no horário combinado.',
  },
  {
    q: 'Posso reservar para festa junina ou evento na rua?',
    a: 'Sim. Trabalhamos aniversários, festas juninas, eventos de rua e celebrações em família. O importante é combinar data e local com antecedência.',
  },
  {
    q: 'Como faço a reserva?',
    a: 'Pelo WhatsApp (15) 99690-5735 ou (15) 99785-2089. Informe data, horário e brinquedos desejados. Nós confirmamos e garantimos sua diversão.',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file.replace(/^\//, '')}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
