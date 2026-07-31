export const site = {
  name: 'Danielle Matsubara',
  shortName: 'Danielle',
  title: 'Dra. Danielle Matsubara',
  role: 'Endodontia · Fundadora',
  clinic: 'Clínica Matsubara',
  concept: 'A Escuta',
  tagline: 'Endodontia humanizada',
  headline: 'Antes do tratamento, a escuta.',
  lead: 'Canal com precisão e presença — para você sair com o sorriso firme, sem o medo de antes.',
  description:
    'Dra. Danielle Matsubara — dentista especialista em endodontia e sócia-fundadora da Clínica Matsubara em Capão Bonito/SP. Atendimento humanizado, técnica precisa e um espaço boutique para cuidar do seu sorriso.',
  promise: 'Salvar o que importa — com calma e técnica.',
  instagram: 'https://www.instagram.com/danymatsubara',
  instagramHandle: '@danymatsubara',
  clinicInstagram: 'https://www.instagram.com/clinicamatsubara_',
  clinicInstagramHandle: '@clinicamatsubara_',
  phone: {
    label: '(15) 99856-5038',
    href: 'tel:+5515998565038',
  },
  whatsapp: {
    number: '5515998565038',
    message: 'Olá Dra. Danielle! Gostaria de agendar uma avaliação.',
  },
  address: 'Av. Adhemar de Barros, 737 — Vila Santa Rosa — Capão Bonito/SP, 18307-070',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Avenida+Adhemar+de+Barros,+737,+Vila+Santa+Rosa,+Cap%C3%A3o+Bonito+SP',
  city: 'Capão Bonito/SP',
  since: 2022,
  legalName: 'Clínica Odontológica Torresilha Matsubara Ltda',
  cnpj: '46.610.920/0001-22',
  nav: [
    { label: 'Escuta', href: '#escuta' },
    { label: 'Ofício', href: '#oficio' },
    { label: 'Espaço', href: '#espaco' },
    { label: 'Momentos', href: '#momentos' },
    { label: 'Agendar', href: '#agendar' },
  ],
  voice: [
    'Eu não começo pelo dente.',
    'Começo por você — pelo que dói, pelo que assusta, pelo que você quer recuperar.',
    'Endodontia é técnica. Mas o que sustenta o resultado é a presença.',
  ],
  craft: {
    title: 'O ofício',
    line: 'Endodontia que preserva o que ainda pode viver.',
    detail:
      'Tratamento de canal com planejamento, precisão e acompanhamento. O objetivo não é só aliviar a dor — é manter o dente, a função e a confiança de sorrir.',
    pillars: [
      {
        title: 'Escuta clínica',
        text: 'Sua história, seus sintomas e o que você sente diante do consultório. Sem pressa para concluir.',
      },
      {
        title: 'Precisão no canal',
        text: 'Diagnóstico, protocolo e técnica cuidadosa — para tratar a causa e preservar o que pode ser salvo.',
      },
      {
        title: 'Presença até o fim',
        text: 'Acompanhamento próximo, ambiente climatizado e uma equipe que te reconhece pelo nome.',
      },
    ],
  },
  spaceWalk: [
    {
      id: 'fachada',
      title: 'Chegada',
      line: 'A fachada burgundy que anuncia: aqui o cuidado tem presença.',
      image: 'space/fachada.jpg',
    },
    {
      id: 'recepcao',
      title: 'Recepção',
      line: 'Poltronas de veludo, luz quente, boiserie — o contrário do consultório frio.',
      image: 'space/reception.jpg',
    },
    {
      id: 'sala',
      title: 'Sala',
      line: 'Ambiente organizado, climatizado, pensado para o seu ritmo.',
      image: 'space/sala.jpg',
    },
    {
      id: 'consultorio',
      title: 'Consultório',
      line: 'Onde a escuta vira conduta — e a técnica encontra o acolhimento.',
      image: 'space/consultorio.jpg',
    },
  ],
  duo: {
    image: 'team/duo-hero.jpg',
    title: 'Com Carina',
    line: 'Fundamos a Matsubara juntas — odontologia e estética sob o mesmo teto, com a mesma presença.',
  },
  moments: [
    { src: 'moments/ig-00.jpg', alt: 'Recepção Matsubara com poltronas burgundy' },
    { src: 'moments/ig-01.jpg', alt: 'Danielle e Carina — fundadoras' },
    { src: 'moments/ig-03.jpg', alt: 'Conforto e climatização no espaço' },
    { src: 'moments/ig-04.jpg', alt: 'Detalhe do ambiente Matsubara' },
    { src: 'moments/ig-05.jpg', alt: 'Momento da clínica' },
    { src: 'moments/ig-06.jpg', alt: 'Cuidado e presença' },
    { src: 'moments/ig-07.jpg', alt: 'Experiência Matsubara' },
    { src: 'moments/ig-08.jpg', alt: 'Espaço boutique' },
  ],
  journey: [
    {
      step: '01',
      title: 'Contar',
      description: 'Você fala o que sente. Eu escuto além do sintoma.',
    },
    {
      step: '02',
      title: 'Ler',
      description: 'Avaliação precisa — imagem, clínica e o que o seu caso pede.',
    },
    {
      step: '03',
      title: 'Tratar',
      description: 'Canal com técnica e calma. Presença do início ao resultado.',
    },
  ],
} as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file.replace(/^\//, '')}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
