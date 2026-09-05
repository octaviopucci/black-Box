export type Sex = 'male' | 'female'

export const harrisBenedict = {
  title: 'Harris-Benedict (Revisada em 1984)',
  subtitle: 'A fórmula clássica que apps e planilhas ainda usam para chutar sua Taxa Metabólica Basal.',
  cta: 'Calcular estimativa',
  footnote:
    'Isso é uma média estatística — não mede o seu metabolismo. A Calorimetria Indireta lê a sua respiração e entrega o número real.',
  male: {
    label: 'Homens',
    base: 88.36,
    weight: 13.4,
    height: 4.8,
    age: -5.7,
    formula:
      'TMB = 88,36 + (13,4 × peso) + (4,8 × altura em cm) − (5,7 × idade)',
  },
  female: {
    label: 'Mulheres',
    base: 447.6,
    weight: 9.2,
    height: 3.1,
    age: -4.3,
    formula:
      'TMB = 447,6 + (9,2 × peso) + (3,1 × altura em cm) − (4,3 × idade)',
  },
  defaults: {
    sex: 'male' as Sex,
    weightKg: 78,
    heightCm: 172,
    age: 35,
  },
} as const

export type HarrisInputs = {
  sex: Sex
  weightKg: number
  heightCm: number
  age: number
}

export type HarrisBreakdown = {
  base: number
  weightTerm: number
  heightTerm: number
  ageTerm: number
  total: number
}

export function computeHarrisBenedict({ sex, weightKg, heightCm, age }: HarrisInputs): HarrisBreakdown {
  const coef = sex === 'male' ? harrisBenedict.male : harrisBenedict.female
  const weightTerm = coef.weight * weightKg
  const heightTerm = coef.height * heightCm
  const ageTerm = coef.age * age
  const total = coef.base + weightTerm + heightTerm + ageTerm

  return {
    base: coef.base,
    weightTerm,
    heightTerm,
    ageTerm,
    total: Math.max(Math.round(total), 0),
  }
}

export function clampInputs(inputs: HarrisInputs): HarrisInputs {
  return {
    sex: inputs.sex,
    weightKg: Math.min(Math.max(inputs.weightKg, 35), 200),
    heightCm: Math.min(Math.max(inputs.heightCm, 130), 220),
    age: Math.min(Math.max(inputs.age, 16), 90),
  }
}
