export const media = {
  portrait: '/instagram/post-2.jpg',
  hero: '/instagram/post-2.jpg',
  presence: {
    enja: '/instagram/post-12.jpg',
    simposio: '/instagram/post-15.jpg',
  },
  gallery: [
    '/instagram/post-1.jpg',
    '/instagram/post-2.jpg',
    '/instagram/post-3.jpg',
    '/instagram/post-6.jpg',
    '/instagram/post-12.jpg',
    '/instagram/post-15.jpg',
    '/instagram/post-18.jpg',
    '/instagram/post-23.jpg',
  ],
} as const

export const site = {
  name: 'Thaiane Marcon',
  title: 'Advogada Trabalhista',
  headline: 'Seus direitos no trabalho, com linguagem que você entende.',
  support:
    'Orientação em rescisões, salários e relações de emprego — para quem precisa de resposta clara antes de decidir.',
  instagram: {
    handle: 'thaianemarcon.adv',
    url: 'https://www.instagram.com/thaianemarcon.adv/',
    followers: 4508,
  },
  intro: [
    'Advogada especializada em direito do trabalho, Thaiane conduz cada caso com objetividade — do empregado que precisa entender uma rescisão à empresa que busca conformidade nas relações de emprego.',
    'Atua com formação continuada no circuito da OAB Sorocaba e da jovem advocacia nacional, participando de congressos e simpósios da área.',
  ],
  practice: [
    {
      id: 'justa-causa',
      title: 'Justa causa e rescisão',
      description:
        'Análise de condutas graves no ambiente de trabalho e defesa ou impugnação de dispensa por justa causa — com avaliação técnica da gravidade dos fatos e dos riscos para empregado e empregador.',
    },
    {
      id: 'salario',
      title: 'Salário e prazos legais',
      description:
        'Esclarecimento sobre prazos de pagamento, atraso salarial e contagem de dias úteis — inclusive em meses com feriados, quando dúvidas sobre o quinto dia útil são frequentes.',
    },
    {
      id: 'relacoes',
      title: 'Relações de emprego',
      description:
        'Assessoria em conflitos e obrigações do dia a dia laboral, com foco em decisões informadas — da admissão à rescisão, passando por direitos, deveres e procedimentos legais.',
    },
  ],
  practiceHeading: 'Áreas em que atuo com foco e clareza.',
  presence: [
    {
      id: 'enja',
      title: 'ENJA SP 2026',
      image: media.presence.enja,
      quote:
        'Dois dias de aprendizado, troca de experiências e reflexões sobre inovações e transformações da advocacia — reforçando a importância de estar em constante atualização.',
      tags: ['Jovem Advocacia', 'OAB SP'],
    },
    {
      id: 'simposio',
      title: 'II Simpósio de Direito do Trabalho',
      image: media.presence.simposio,
      quote:
        'Participação no evento promovido pela comissão de direito do trabalho da OAB Sorocaba — formação e conexão entre profissionais da área.',
      tags: ['OAB Sorocaba', 'Direito do Trabalho'],
    },
  ],
  presenceHeading: 'Formação contínua e presença na advocacia trabalhista.',
  galleryHeading: 'Eventos, formação e orientação sobre direito do trabalho.',
  nav: [
    { label: 'Atuação', href: '#atuacao' },
    { label: 'Presença', href: '#presenca' },
    { label: 'Conteúdo', href: '#conteudo' },
    { label: 'Contato', href: '#contato' },
  ],
  cta: {
    label: 'Enviar mensagem',
    href: 'https://www.instagram.com/thaianemarcon.adv/',
  },
} as const
