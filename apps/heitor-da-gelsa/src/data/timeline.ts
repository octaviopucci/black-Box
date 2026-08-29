import type { TimelineItem } from './site'
import { media } from './site'

export const timeline: TimelineItem[] = [
  {
    id: 'formacao',
    year: '[ANO]',
    title: 'Formação acadêmica',
    description: 'Graduação em Direito — [INSERIR INSTITUIÇÃO E DETALHES]',
    image: media.hero,
  },
  {
    id: 'vereador-1',
    year: '[ANO]',
    title: 'Primeiro mandato como vereador',
    description: 'Início da atuação legislativa em Capão Bonito — [INSERIR DETALHES]',
    image: media.about,
  },
  {
    id: 'vereador-2',
    year: '[ANO]',
    title: 'Segundo mandato como vereador',
    description: 'Continuidade da atuação na Câmara Municipal — [INSERIR DETALHES]',
    image: media.trabalho,
  },
  {
    id: 'assessor',
    year: '[ANO]',
    title: 'Assessoria parlamentar',
    description: 'Atuação como assessor parlamentar — [INSERIR DETALHES]',
    image: media.parceria,
  },
  {
    id: 'eleicao',
    year: '[ANO]',
    title: 'Candidatura a prefeito',
    description: '8.733 votos na eleição municipal de Capão Bonito.',
    image: media.presenca,
  },
]
