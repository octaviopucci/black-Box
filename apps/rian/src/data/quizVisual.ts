const base = `${import.meta.env.BASE_URL}quiz-v2`

/** Visual anchors for quiz v2 — copy stays in quiz.ts */
export const quizVisuals: Record<
  string,
  { src: string; alt: string; placement: 'hero' | 'side' | 'banner' }
> = {
  hook: {
    src: `${base}/hook.jpg`,
    alt: 'Noite sozinho com o celular, luz vermelha no rosto',
    placement: 'hero',
  },
  'broken-promise': {
    src: `${base}/broken-promise.jpg`,
    alt: 'Olhar no espelho depois de mais uma promessa quebrada',
    placement: 'hero',
  },
  'invisible-prison': {
    src: `${base}/cycle.jpg`,
    alt: 'Rua vazia de noite, o ciclo andando sozinho',
    placement: 'hero',
  },
  'exit-price': {
    src: `${base}/exit.jpg`,
    alt: 'Esforço e escolha: o preço de sair',
    placement: 'hero',
  },
  filter: {
    src: `${base}/mentor.jpg`,
    alt: 'Olhar direto, sem filtro',
    placement: 'side',
  },
  'reframe-protocol': {
    src: `${base}/exit.jpg`,
    alt: 'Estrutura no lugar da barganha',
    placement: 'banner',
  },
  intensity: {
    src: `${base}/hook.jpg`,
    alt: 'A fissura no escuro',
    placement: 'banner',
  },
  urgency: {
    src: `${base}/cycle.jpg`,
    alt: 'A janela agora',
    placement: 'banner',
  },
  'social-proof': {
    src: `${base}/proof.jpg`,
    alt: 'Gente que já passou por isso',
    placement: 'banner',
  },
  transformation: {
    src: `${base}/transform.jpg`,
    alt: 'Do outro lado da porta',
    placement: 'hero',
  },
  'how-it-works': {
    src: `${base}/mentor.jpg`,
    alt: 'Método, não discurso',
    placement: 'side',
  },
  offer: {
    src: `${base}/mentor.jpg`,
    alt: 'Entrar no BASE',
    placement: 'banner',
  },
}
