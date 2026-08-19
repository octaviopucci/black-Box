export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-12.jpg',
  presence: {
    enja: '/instagram/post-2.jpg',
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
  headline: 'Direito do trabalho, explicado com clareza.',
  support:
    'Conteúdo educativo sobre direitos e deveres — da justa causa ao prazo de pagamento do salário.',
  instagram: {
    handle: 'thaianemarcon.adv',
    url: 'https://www.instagram.com/thaianemarcon.adv/',
    followers: 4508,
    source: 'Instagram @thaianemarcon.adv',
  },
  intro: [
    'No Instagram, Thaiane traduz temas trabalhistas do dia a dia — rescisões, prazos salariais e decisões que impactam empregados e empresas.',
    'Participa de encontros da jovem advocacia e eventos da OAB Sorocaba, em constante atualização sobre inovações e transformações da advocacia.',
  ],
  practice: [
    {
      id: 'justa-causa',
      title: 'Justa causa e rescisão',
      description:
        'Análise de condutas graves no ambiente de trabalho — como comercialização irregular de medicamentos nas dependências da empresa, com manutenção da dispensa por justa causa (TRT-2).',
      source: 'Legenda Instagram, post DcL3tvrRhNC',
    },
    {
      id: 'salario',
      title: 'Salário e prazos legais',
      description:
        'Orientação sobre o 5º dia útil para pagamento — inclusive quando feriados geram dúvida. Sábado conta como dia útil; domingo e feriado não.',
      source: 'Legenda Instagram, abril/2026',
    },
    {
      id: 'atualizacao',
      title: 'Atualização e formação',
      description:
        'Presença no ENJA SP 2026 e no II Simpósio de Direito do Trabalho (OAB Sorocaba), com foco em troca de experiências e reflexões sobre a advocacia trabalhista.',
      source: 'Legendas Instagram — ENJA SP 2026 e Simpósio OAB Sorocaba',
    },
  ],
  presence: [
    {
      id: 'enja',
      title: 'ENJA SP 2026',
      image: media.presence.enja,
      quote:
        'Foram dois dias de aprendizado, troca de experiências e reflexões sobre inovações e transformações da advocacia, sempre reforçando a importância de estarmos em constante atualização.',
      tags: ['#ENJASP2026', '#JovemAdvocacia', '#OABSP'],
    },
    {
      id: 'simposio',
      title: 'II Simpósio de Direito do Trabalho',
      image: media.presence.simposio,
      quote:
        'Evento realizado pela comissão @advtrabalhista.oabsorocaba — espaço de formação e conexão entre profissionais do direito do trabalho em Sorocaba.',
      tags: ['OAB Sorocaba', 'Direito do Trabalho'],
    },
  ],
  nav: [
    { label: 'Atuação', href: '#atuacao' },
    { label: 'Presença', href: '#presenca' },
    { label: 'Conteúdo', href: '#conteudo' },
    { label: 'Contato', href: '#contato' },
  ],
  cta: {
    label: 'Falar no Instagram',
    href: 'https://www.instagram.com/thaianemarcon.adv/',
  },
} as const
