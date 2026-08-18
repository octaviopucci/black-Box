/** Studio Laís Felicia — fonte de verdade: Instagram @studiolaisfelicia + Drive da marca.
 * Copy sem travessao. Nao inventar numeros, depoimentos ou certificados.
 */

export const site = {
  name: 'Laís Felicia',
  studio: 'Studio Laís Felicia',
  role: 'Designer de sobrancelhas',
  city: 'Capão Bonito/SP',
  headline: 'Suas sobrancelhas desenhadas para o rosto que é seu.',
  lead: 'Design, henna e brow lamination com leitura do seu formato. Sem padrão pronto. Sem tirar demais.',
  description:
    'Studio Laís Felicia em Capão Bonito/SP. Design de sobrancelhas, henna e brow lamination. Cuidando de olhares há 10 anos. Agende pelo WhatsApp.',
  promise: 'Cuidando de olhares há 10 anos.',
  instagram: 'https://www.instagram.com/studiolaisfelicia',
  instagramHandle: '@studiolaisfelicia',
  phone: {
    label: '(15) 99857-5128',
    href: 'tel:+5515998575128',
  },
  whatsapp: {
    number: '5515998575128',
    message: 'Olá! Vim pelo site e gostaria de agendar meu design de sobrancelhas.',
    courseMessage: 'Olá! Vim pelo site e quero informações sobre o curso.',
  },
  address: 'Rua Floriano Peixoto, 310',
  landmark: 'Em frente à loja Clamarroca',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Floriano+Peixoto+310+Capão+Bonito+SP',
  payment: ['Pix', 'Cartão', 'Dinheiro'],
  followers: '7,4 mil',
  years: 10,
  nav: [
    { label: 'O olhar', href: '#olhar' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Cursos', href: '#cursos' },
    { label: 'Laís', href: '#lais' },
  ],
} as const

export const services = [
  {
    id: 'design',
    name: 'Design de sobrancelha',
    price: 'R$ 45',
    text: 'Leitura do rosto, marcação e epilação para um desenho que respeita o seu traço.',
  },
  {
    id: 'henna',
    name: 'Design com henna',
    price: 'R$ 50',
    text: 'Cor e preenchimento com henna profissional. O acabamento ombré deixa o olhar marcado sem parecer maquiagem.',
  },
  {
    id: 'coloracao',
    name: 'Design com coloração',
    price: 'R$ 60',
    text: 'Para quem quer fios alinhados à cor do olhar, com definição mais suave.',
  },
  {
    id: 'brow',
    name: 'Brow lamination',
    price: 'R$ 100',
    text: 'Fios alinhados, volume e direção. Com cuidado em casa, o resultado pode durar até 45 dias.',
  },
  {
    id: 'descoloracao',
    name: 'Descoloração',
    price: 'R$ 40',
    text: 'Abre a cor dos fios quando o desenho pede mais luz e harmonia.',
  },
  {
    id: 'retoque',
    name: 'Retoque de henna',
    price: 'R$ 25',
    text: 'Mantém o preenchimento entre os retornos. A henna, com cuidado, dura até 10 dias.',
  },
] as const

export const extras = [
  { name: 'Buço', price: 'R$ 10' },
  { name: 'Costeleta', price: 'R$ 20' },
  { name: 'Partes avulsas', price: 'R$ 10' },
  { name: 'Rosto completo', price: 'R$ 60' },
] as const

export const plans = [
  { name: '2 designs de sobrancelha', price: 'R$ 70' },
  { name: '2 designs com henna', price: 'R$ 80' },
  { name: '1 design com henna + 1 retoque', price: 'R$ 60' },
  { name: 'Plano Plus · até 8 atendimentos no mês', price: 'R$ 179' },
] as const

export const process = [
  {
    step: '01',
    title: 'Leitura',
    text: 'Olho o formato do rosto, a densidade dos fios e o que você já tentou. O desenho começa antes da pinça.',
  },
  {
    step: '02',
    title: 'Método RT',
    text: 'Marcação para o seu formato, não para um molde. Correção dos erros que deixam o olhar pesado ou sem caimento.',
  },
  {
    step: '03',
    title: 'Design',
    text: 'Epilação com linha e acabamento cuidadoso. Se for henna, a cor é escolhida para a sua pele.',
  },
  {
    step: '04',
    title: 'Finalização',
    text: 'Alinho os fios, oriento a manutenção e o retorno. Design a cada 20 dias. Brow, em torno de 25.',
  },
] as const

export const pains = [
  'Sobrancelha sem formato, que some no rosto',
  'Assimetria que a gente tenta esconder com lápis',
  'Medo de sair com o olhar artificial',
  'Excesso de pelo, ou o contrário: falha e densidade baixa',
]

export const why = [
  {
    title: 'Dez anos de olhar',
    text: 'Não é um serviço rápido de salão. É o tempo de quem já viu muitos rostos e ainda trata o seu como o primeiro.',
  },
  {
    title: 'Método RT de marcação',
    text: 'Um desenho para cada formato. O ponto alto, o caimento e a densidade entram na conta antes de qualquer fio sair.',
  },
  {
    title: 'Henna com critério',
    text: 'Preparo, cor e tempo de ação pensados para a sua pele. O ombré preenche sem deixar o início marcado demais.',
  },
  {
    title: 'Studio que respira calma',
    text: 'Poltrona, silêncio e atenção no seu olhar. O celular fica de lado para o procedimento acontecer por inteiro.',
  },
] as const

export const courses = [
  {
    id: 'iniciante',
    kicker: 'Presencial · 2 dias',
    title: 'Curso iniciante',
    price: 'R$ 1.300',
    includes: 'Kit completo e certificado',
    image: 'course-setup.jpg',
    imageAlt: 'Estações do curso iniciante com kit, apostila e caixa branca com fita rosa',
    days: [
      {
        title: '1º dia · Teoria e demonstração',
        items: [
          'Materiais e produtos utilizados',
          'Método RT de marcação para todos os formatos',
          'Correção dos principais erros no design',
          'Henna profissional: preparo, aplicação, cores, tempo de ação e cuidados',
          'Treinos de coordenação motora, sobrancelha e epilação com linha',
          'Demonstração completa em modelo real',
          'Avaliação prática',
        ],
      },
      {
        title: '2º dia · Prática supervisionada',
        items: [
          'Atendimento em 2 modelos reais com supervisão',
          'Técnica de henna efeito ombré',
          'Como produzir fotos profissionais para divulgação',
        ],
      },
    ],
    bonus: [
      'Atendimento e fidelização, com protocolos e mensagens prontas',
      'Técnicas de overdelivery para gerar indicações',
      'Dicas de edição de fotos',
      'Os 7 pilares para conquistar as primeiras clientes',
      'Ficha de anamnese profissional',
    ],
  },
  {
    id: 'henna',
    kicker: 'Presencial · 1 dia',
    title: 'Especialização henna',
    price: 'R$ 1.100',
    includes: 'Kit completo e certificado',
    image: 'kit.jpg',
    imageAlt: 'Kit do curso com henna La Benig, régua da marca e materiais de design',
    days: [
      {
        title: 'O dia da especialização',
        items: [
          'Colorimetria avançada da henna',
          'Marcação estratégica para diferentes formatos',
          'Técnicas de acabamento e maior durabilidade',
          'Correção de falhas',
        ],
      },
    ],
    bonus: [
      'Estratégias de atendimento e fidelização, com o modelo de mensagens e protocolo que a Laís usa',
      'Técnicas de overdelivery para gerar indicações',
      'Dicas para edição e produção de fotos que vendem',
      'Os 7 pilares para conquistar as primeiras clientes',
    ],
  },
] as const

export const results = [
  {
    file: 'result-smile.jpg',
    alt: 'Cliente sorrindo depois do design, com a placa oficial ao fundo',
    caption: 'Depois do design',
  },
  {
    file: 'result-face.jpg',
    alt: 'Close do olhar com sobrancelha desenhada e preenchida',
    caption: 'Design',
  },
  {
    file: 'result-lam.jpg',
    alt: 'Brow lamination com fios alinhados e brilho',
    caption: 'Brow lamination',
  },
  {
    file: 'result-mirror.jpg',
    alt: 'Cliente no leito do studio olhando o resultado no espelho',
    caption: 'No espelho',
  },
  {
    file: 'result.jpg',
    alt: 'Acabamento de henna com spoolie rosa',
    caption: 'Henna',
  },
] as const

export const instagramStrip = [
  { file: 'portrait.jpg', alt: 'Laís Felicia no studio, em frente à logo oficial' },
  { file: 'result-smile.jpg', alt: 'Resultado de design de sobrancelha' },
  { file: 'course-setup.jpg', alt: 'Preparação do curso presencial' },
  { file: 'cert.jpg', alt: 'Entrega de certificado no studio' },
  { file: 'logo-box.jpg', alt: 'Caixa e apostila do curso com a logo oficial em rose gold' },
] as const

export const studentNote = {
  text: 'Aprendi tanto com seu curso, amei muito a experiência, foi muito mais do que eu esperava, super completo.',
  from: 'Aluna do curso presencial',
} as const

export const faqs = [
  {
    q: 'Como funciona o design?',
    a: 'Começo pela leitura do seu rosto e da densidade dos fios. Depois vem a marcação pelo método RT, a epilação e, se combinarmos, a henna ou a coloração. No fim, oriento a manutenção e o retorno.',
  },
  {
    q: 'O design é personalizado?',
    a: 'Sim. O método RT de marcação existe para todos os formatos, sem um molde único. O caso de densidade baixa, por exemplo, pede outro caimento do que uma sobrancelha cheia.',
  },
  {
    q: 'Posso fazer mesmo tendo falhas?',
    a: 'Pode. A henna preenche e a especialização da Laís inclui correção de falhas. O desenho é pensado para a estrutura que você já tem.',
  },
  {
    q: 'Quanto tempo dura o resultado?',
    a: 'A henna, com cuidado em casa, pode durar até 10 dias. A brow lamination pode chegar a 45 dias. Para manter o design, o retorno é a cada 20 dias. Depois da brow, o design nutritivo entra em torno de 25 dias.',
  },
  {
    q: 'O procedimento dói?',
    a: 'A sensibilidade muda de pessoa para pessoa. O atendimento é feito com calma, sem pressa de terminar. Se algo incomodar, você fala na hora.',
  },
  {
    q: 'Preciso deixar a sobrancelha crescer antes?',
    a: 'Nem sempre. Em alguns casos o crescimento ajuda a ler o fio natural. No WhatsApp a Laís orienta o que faz sentido para o seu momento.',
  },
  {
    q: 'Como faço para agendar?',
    a: 'Pelo WhatsApp (15) 99857-5128. A confirmação chega um dia antes. Responda para garantir o horário. Formas de pagamento: Pix, cartão ou dinheiro.',
  },
  {
    q: 'Onde fica o atendimento?',
    a: 'Rua Floriano Peixoto, 310, Capão Bonito/SP, em frente à loja Clamarroca.',
  },
  {
    q: 'Preciso ter experiência para o curso iniciante?',
    a: 'Não. O curso de 2 dias foi feito para quem está começando: teoria, demonstração em modelo e prática supervisionada em 2 modelos reais, com kit e certificado.',
  },
  {
    q: 'Os cursos têm kit e certificado?',
    a: 'Sim. O iniciante (R$ 1.300) e a especialização henna (R$ 1.100) incluem kit completo e certificado.',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file.replace(/^\//, '')}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
