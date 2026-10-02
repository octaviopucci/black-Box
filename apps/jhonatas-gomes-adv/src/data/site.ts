export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/hero.jpg',
  heroSource: 'https://www.instagram.com/p/C0NFEuILDeA/',
  gallery: [
    '/instagram/post-1.jpg',
    '/instagram/post-2.jpg',
    '/instagram/post-3.jpg',
    '/instagram/post-6.jpg',
  ],
} as const

export const site = {
  name: 'Jhonatas Gomes',
  brand: 'Jhonatas Gomes | Advogado Trabalhista',
  legalName: 'Jhonatas Gomes Sociedade Individual de Advocacia',
  role: 'Advogado Trabalhista',
  tagline: 'Seus direitos no trabalho, explicados com clareza.',
  headline: 'Quando a empresa falha, a lei pode proteger você.',
  description:
    'Orientação trabalhista direta — rescisão indireta, horas extras, salário em atraso e discriminação no emprego. Conteúdo extraído do perfil @jhonatasgomes.adv.',
  instagram: {
    handle: 'jhonatasgomes.adv',
    url: 'https://www.instagram.com/jhonatasgomes.adv',
    followers: 27642,
    posts: 790,
  },
  whatsapp: {
    number: '5516992823444',
    message:
      'Olá! Vim pelo site do Jhonatas Gomes e gostaria de orientação trabalhista.',
  },
  address: {
    street: 'Rua Angelo Alonso, 216',
    district: 'Jardim das Flores',
    city: 'Santa Rosa de Viterbo',
    state: 'SP',
    zip: '14270-000',
    full: 'Rua Angelo Alonso, 216 — Jardim das Flores — Santa Rosa de Viterbo/SP, 14270-000',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Angelo+Alonso,+216,+Jardim+das+Flores,+Santa+Rosa+de+Viterbo,+SP',
  topics: [
    {
      id: 'consignado',
      title: 'Empréstimo consignado descontado e não repassado',
      summary:
        'Quando a empresa desconta o consignado do salário e não repassa ao banco, configura falta grave do empregador — com possibilidade de rescisão indireta e verbas como demissão sem justa causa.',
      source: 'Instagram @jhonatasgomes.adv',
      image: '/instagram/post-1.jpg',
      permalink: 'https://www.instagram.com/p/DcMqTywCU-o/',
    },
    {
      id: 'discriminacao',
      title: 'Dispensa com doença grave',
      summary:
        'A Súmula 443 presume que a dispensa de trabalhador com doença que gere estigma ou preconceito foi motivada por discriminação — cabendo à empresa provar o contrário.',
      source: 'Instagram @jhonatasgomes.adv',
      image: '/instagram/post-2.jpg',
      permalink: 'https://www.instagram.com/p/DcKCLzwhy8U/',
    },
    {
      id: 'salario',
      title: 'Salário sempre atrasado',
      summary:
        'Atrasos recorrentes após o 5º dia útil descumprem obrigação essencial do contrato. O empregado pode optar pela rescisão indireta e exigir verbas rescisórias completas.',
      source: 'Instagram @jhonatasgomes.adv',
      image: '/instagram/post-3.jpg',
      permalink: 'https://www.instagram.com/p/DcJ_yhah5DN/',
    },
    {
      id: 'horas',
      title: 'Trabalho fora do ponto',
      summary:
        'Responder mensagens, fechar tarefas e atender clientes depois do horário registrado conta como jornada — com direito a horas extras, reflexos e, em casos recorrentes, rescisão indireta.',
      source: 'Instagram @jhonatasgomes.adv',
      image: '/instagram/post-6.jpg',
      permalink: 'https://www.instagram.com/p/Db9NnTGCtgE/',
    },
  ],
  approach: [
    'Linguagem acessível para quem precisa entender a lei sem juridiquês.',
    'Orientação prática: o que guardar como prova antes de qualquer passo.',
    'Foco em situações reais do dia a dia — consignado, ponto, salário, dispensa.',
  ],
  nav: [
    { label: 'Atuação', href: '#atuacao' },
    { label: 'Orientações', href: '#orientacoes' },
    { label: 'Instagram', href: '#conteudo' },
    { label: 'Contato', href: '#contato' },
  ],
} as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}

export function formatFollowers(count: number) {
  if (count >= 1000) {
    const value = count / 1000
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} mil`
  }
  return String(count)
}
