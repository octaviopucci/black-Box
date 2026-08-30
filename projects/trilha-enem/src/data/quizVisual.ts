export type VisualPlacement = 'hero' | 'side' | 'banner'

export type QuizVisual = {
  gradient: string
  alt: string
  placement: VisualPlacement
}

/** Atmosfera por passo — sem stock genérico, gradientes editoriais */
export const quizVisuals: Record<string, QuizVisual> = {
  hook: {
    gradient:
      'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(245,213,71,0.18) 0%, transparent 55%), linear-gradient(165deg, #0a1428 0%, #0f1f3d 45%, #0b1220 100%)',
    alt: 'Mesa de estudo à noite, luz de abajur sobre caderno',
    placement: 'hero',
  },
  'broken-cycle': {
    gradient:
      'radial-gradient(circle at 80% 20%, rgba(255,107,74,0.12) 0%, transparent 40%), linear-gradient(180deg, #0d1525 0%, #151c2e 100%)',
    alt: 'Simulado zerado, frustração silenciosa',
    placement: 'hero',
  },
  redacao: {
    gradient:
      'radial-gradient(ellipse 90% 60% at 20% 80%, rgba(245,213,71,0.14) 0%, transparent 50%), linear-gradient(145deg, #0b1220 0%, #1a2332 100%)',
    alt: 'Folha de redação com marcações de correção',
    placement: 'hero',
  },
  filter: {
    gradient:
      'linear-gradient(135deg, #0f1a2e 0%, #0b1220 50%, #141824 100%)',
    alt: 'Foco total, sem distração',
    placement: 'side',
  },
  reframe: {
    gradient:
      'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(74,158,255,0.15) 0%, transparent 60%), linear-gradient(180deg, #0a1428 0%, #0f2038 100%)',
    alt: 'App aberto com correção detalhada na tela',
    placement: 'banner',
  },
  intensity: {
    gradient:
      'linear-gradient(160deg, #0b1220 0%, #162035 40%, #0d1525 100%)',
    alt: 'Contagem regressiva até o ENEM',
    placement: 'banner',
  },
  'social-proof': {
    gradient:
      'radial-gradient(circle at 30% 50%, rgba(245,213,71,0.1) 0%, transparent 45%), linear-gradient(180deg, #0f1828 0%, #0b1220 100%)',
    alt: 'Estudantes que passaram',
    placement: 'banner',
  },
  transformation: {
    gradient:
      'radial-gradient(ellipse 100% 70% at 50% 0%, rgba(245,213,71,0.22) 0%, transparent 50%), linear-gradient(180deg, #0a1428 0%, #0f1f3d 100%)',
    alt: 'Nota subindo, confiança voltando',
    placement: 'hero',
  },
  'how-it-works': {
    gradient:
      'linear-gradient(145deg, #0b1220 0%, #152238 50%, #0d1525 100%)',
    alt: 'Fluxo: questão, correção, redação, feedback',
    placement: 'banner',
  },
  offer: {
    gradient:
      'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(245,213,71,0.2) 0%, transparent 55%), linear-gradient(180deg, #0a1428 0%, #0f2038 100%)',
    alt: 'Sua trilha começa agora',
    placement: 'hero',
  },
}
